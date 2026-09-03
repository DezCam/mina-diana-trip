import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { emergencyCities, quickCallGuide, stateDepartmentFallback } from "../src/data/emergency.ts";
import { offlineMaps } from "../src/data/mapLocations.ts";
import { recommendationGroups, recommendations, recommendationsIntroVideo } from "../src/data/recommendations.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const downloadsDir = path.join(root, "public", "downloads");
const qaDir = path.join(root, "artifacts", "pdf-qa");

const requiredPdfs = [
  "amsterdam-map.pdf",
  "dezrecs.pdf",
  "edinburgh-map.pdf",
  "emergency.pdf",
];

const expectedHashes = new Map([
  [
    "dezrecs.pdf",
    hashSource({ recommendationGroups, recommendations, recommendationsIntroVideo }),
  ],
  [
    "emergency.pdf",
    hashSource({ emergencyCities, quickCallGuide, stateDepartmentFallback }),
  ],
  ...offlineMaps.map((map) => [map.fileName, hashSource(map)]),
]);

function hashSource(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function cleanPdfText(value) {
  return value.replace(/\\\(/g, "(").replace(/\\\)/g, ")").replace(/\\\\/g, "\\");
}

function estimateWidth(text, size, fontName) {
  const factor = fontName === "F4" || fontName === "F2" ? 0.49 : 0.52;
  return cleanPdfText(text).length * size * factor;
}

function pageSize(pdfText) {
  const match = pdfText.match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
  if (!match) throw new Error("Missing MediaBox");
  return { width: Number(match[1]), height: Number(match[2]) };
}

function extractTextBoxes(pdfText, file) {
  const { width: pageWidth, height: pageHeight } = pageSize(pdfText);
  const pageMatches = [...pdfText.matchAll(/\/Type \/Page\b[\s\S]*?\/Contents (\d+) 0 R/g)];
  const contentObjects = new Map(
    [...pdfText.matchAll(/(\d+) 0 obj\s*<<\s*\/Length \d+\s*>>\s*stream\n([\s\S]*?)\nendstream/g)].map(
      (match) => [match[1], match[2]],
    ),
  );

  const boxes = [];
  pageMatches.forEach((pageMatch, pageIndex) => {
    const stream = contentObjects.get(pageMatch[1]);
    if (!stream) return;
    const textMatches = [
      ...stream.matchAll(/BT \/(F\d) ([\d.]+) Tf ([\d.-]+) ([\d.-]+) Td \((.*?)\) Tj ET/g),
    ];
    textMatches.forEach((match, textIndex) => {
      const [, font, rawSize, rawX, rawY, text] = match;
      const value = cleanPdfText(text);
      if (!value.trim()) return;
      const size = Number(rawSize);
      const x = Number(rawX);
      const y = pageHeight - Number(rawY);
      const h = size * 1.12;
      const w = Math.max(4, estimateWidth(value, size, font));
      boxes.push({
        id: `${file}:p${pageIndex + 1}:t${textIndex}`,
        file,
        page: pageIndex + 1,
        text: value,
        x,
        y,
        w,
        h,
      });
    });
  });
  return { boxes, pageWidth, pageHeight, pageCount: pageMatches.length };
}

function intersects(a, b, tolerance = 1.5) {
  return !(
    a.x + a.w <= b.x + tolerance ||
    b.x + b.w <= a.x + tolerance ||
    a.y + a.h <= b.y + tolerance ||
    b.y + b.h <= a.y + tolerance
  );
}

function validateText(file, pdfText) {
  const { boxes, pageWidth, pageHeight, pageCount } = extractTextBoxes(pdfText, file);
  if (pageCount <= 0) throw new Error(`${file} has no pages`);
  const errors = [];

  for (const box of boxes) {
    if (box.x < -1 || box.y < -1 || box.x + box.w > pageWidth + 5 || box.y + box.h > pageHeight + 5) {
      errors.push(`${box.id} text out of page bounds: ${box.text}`);
    }
  }

  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i];
      const b = boxes[j];
      if (a.page !== b.page) continue;
      if (intersects(a, b)) {
        errors.push(`${a.id} overlaps ${b.id}: "${a.text}" / "${b.text}"`);
      }
    }
  }

  if (errors.length) {
    throw new Error(`${file} text QA failed:\n${errors.slice(0, 20).join("\n")}`);
  }

  return { pageCount, textBoxes: boxes.length };
}

function validateManifest() {
  const pdfManifestPath = path.join(qaDir, "manifest.json");
  const mapManifestPath = path.join(qaDir, "map-layout.json");
  if (!fs.existsSync(pdfManifestPath)) throw new Error("Missing PDF source manifest");
  if (!fs.existsSync(mapManifestPath)) throw new Error("Missing map layout manifest");

  const pdfManifest = JSON.parse(fs.readFileSync(pdfManifestPath, "utf8"));
  const mapManifest = JSON.parse(fs.readFileSync(mapManifestPath, "utf8"));
  const manifestEntries = [
    ...pdfManifest.files,
    ...mapManifest.maps.map((map) => ({
      file: map.file,
      sourceHash: map.sourceHash,
    })),
  ];

  for (const file of requiredPdfs) {
    const manifestEntry = manifestEntries.find((entry) => entry.file === file);
    if (!manifestEntry) throw new Error(`${file} missing from source manifest`);
    const expectedHash = expectedHashes.get(file);
    if (manifestEntry.sourceHash !== expectedHash) {
      throw new Error(`${file} source hash is stale`);
    }
  }

  for (const map of mapManifest.maps) {
    if (map.remainingMarkerCollisions !== 0) {
      throw new Error(`${map.file} has ${map.remainingMarkerCollisions} marker collisions`);
    }
    for (const marker of map.markers) {
      if (
        marker.x - marker.radius < 31 ||
        marker.x + marker.radius > 761 ||
        marker.y - marker.radius < 93 ||
        marker.y + marker.radius > 453
      ) {
        throw new Error(`${map.file} marker ${marker.pin} leaves the map frame`);
      }
    }
  }

  return mapManifest;
}

function writeQaSummary(results, mapManifest) {
  fs.mkdirSync(qaDir, { recursive: true });
  const lines = [
    "# PDF QA",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Files",
    ...results.map((result) => `- ${result.file}: ${result.pageCount} pages, ${result.textBoxes} text boxes, ${result.size} bytes`),
    "",
    "## Marker QA",
    ...mapManifest.maps.map(
      (map) =>
        `- ${map.file}: ${map.initialMarkerCollisions} collisions before correction, ${map.remainingMarkerCollisions} remaining`,
    ),
  ];
  fs.writeFileSync(path.join(qaDir, "summary.md"), `${lines.join("\n")}\n`);
}

const mapManifest = validateManifest();
const results = [];

for (const file of requiredPdfs) {
  const target = path.join(downloadsDir, file);
  if (!fs.existsSync(target)) throw new Error(`${file} is missing`);
  const buffer = fs.readFileSync(target);
  if (buffer.length <= 0) throw new Error(`${file} is empty`);
  if (!buffer.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
    throw new Error(`${file} is not a PDF`);
  }
  const pdfText = buffer.toString("latin1");
  const textResult = validateText(file, pdfText);
  results.push({ file, size: buffer.length, ...textResult });
}

if (fs.existsSync(path.join(downloadsDir, "trip-guide.pdf"))) {
  throw new Error("trip-guide.pdf still exists");
}

writeQaSummary(results, mapManifest);
console.log("PDF verification passed");
