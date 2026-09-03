import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { emergencyCities, quickCallGuide, stateDepartmentFallback } from "../src/data/emergency.ts";
import { offlineMaps } from "../src/data/mapLocations.ts";
import { getOfflineAddress, offlineAddresses } from "../src/data/offlineAddresses.ts";
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
    hashSource({ recommendationGroups, recommendations, recommendationsIntroVideo, offlineAddresses }),
  ],
  [
    "emergency.pdf",
    hashSource({ emergencyCities, quickCallGuide, stateDepartmentFallback }),
  ],
  ...offlineMaps.map((map) => [map.fileName, hashSource({ map, offlineAddresses })]),
]);

function hashSource(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function cleanPdfText(value) {
  return value.replace(/\\\(/g, "(").replace(/\\\)/g, ")").replace(/\\\\/g, "\\");
}

function normalizeText(value) {
  return cleanPdfText(value).replace(/\s+/g, " ").trim();
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
      const baselineY = pageHeight - Number(rawY);
      const y = baselineY - size;
      const h = size;
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

function intersects(a, b, tolerance = 0) {
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
      if (intersects(a, b, 0.75)) {
        errors.push(`${a.id} overlaps ${b.id}: "${a.text}" / "${b.text}"`);
      }
    }
  }

  if (errors.length) {
    throw new Error(`${file} text QA failed:\n${errors.slice(0, 20).join("\n")}`);
  }

  return { pageCount, textBoxes: boxes.length };
}

function validateLayoutManifest() {
  const layoutManifestPath = path.join(qaDir, "pdf-layout.json");
  if (!fs.existsSync(layoutManifestPath)) throw new Error("Missing PDF layout manifest");
  const layoutManifest = JSON.parse(fs.readFileSync(layoutManifestPath, "utf8"));
  const errors = [];

  for (const file of layoutManifest.files ?? []) {
    for (const event of file.layout ?? []) {
      if (event.type === "recommendation-header" && event.gap < 6) {
        errors.push(`${file.file} ${event.title} category/title gap is ${event.gap}pt`);
      }
      if (event.type === "emergency-contact-row" && event.gap < 5) {
        errors.push(`${file.file} ${event.number} label/value gap is ${event.gap}pt`);
      }
    }
  }

  const dezrecsLayout = layoutManifest.files?.find((file) => file.file === "dezrecs.pdf")?.layout ?? [];
  const headerCount = dezrecsLayout.filter((event) => event.type === "recommendation-header").length;
  if (headerCount !== recommendations.length) {
    errors.push(`dezrecs.pdf has ${headerCount} recommendation headers; expected ${recommendations.length}`);
  }

  if (errors.length) {
    throw new Error(`PDF semantic layout QA failed:\n${errors.join("\n")}`);
  }

  return layoutManifest;
}

function validateEmergencyContent(pdfText) {
  const textValues = [
    ...pdfText.matchAll(/BT \/(F\d) ([\d.]+) Tf ([\d.-]+) ([\d.-]+) Td \((.*?)\) Tj ET/g),
  ].map((match) => normalizeText(match[5]));
  const fullText = textValues.join("\n");
  const detailNumbers = [
    "+31 343 57 8844",
    "+31 70 310 2209",
    "+44 131 556 8315",
    "+44 20 7499 9000",
  ];
  const errors = [];

  for (const number of detailNumbers) {
    const count = textValues.filter((value) => value === number).length;
    if (count !== 1) {
      errors.push(`${number} appears ${count} times as a detail value; expected 1`);
    }
    const duplicatePattern = new RegExp(`${number.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*${number.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
    if (duplicatePattern.test(fullText)) {
      errors.push(`${number} is duplicated inside a contact row`);
    }
  }

  if (/From an international\/foreign phone:\s*\+31 343 57 8844:\s*\+31 343 57 8844/.test(fullText)) {
    errors.push("International Netherlands police row repeats its phone value");
  }

  if (errors.length) {
    throw new Error(`emergency.pdf duplicate-number QA failed:\n${errors.join("\n")}`);
  }
}

function validateDezrecsContent(pdfText) {
  const fullText = [
    ...pdfText.matchAll(/BT \/(F\d) ([\d.]+) Tf ([\d.-]+) ([\d.-]+) Td \((.*?)\) Tj ET/g),
  ].map((match) => normalizeText(match[5])).join(" ");
  const required = [
    "This is where I bought the stroop waffle gift bags",
    "they make the stroop waffles right in front of you.",
  ];
  const missing = required.filter((snippet) => !fullText.includes(snippet));
  if (missing.length) {
    throw new Error(`dezrecs.pdf is missing current Hans Egstorf copy: ${missing.join(", ")}`);
  }
}

function validateNoGoogleMapsControls(file, pdfText) {
  const fullText = [
    ...pdfText.matchAll(/BT \/(F\d) ([\d.]+) Tf ([\d.-]+) ([\d.-]+) Td \((.*?)\) Tj ET/g),
  ].map((match) => normalizeText(match[5])).join(" ");
  const forbidden = ["Open in Maps", "google.com/maps", "maps.app.goo.gl"];
  const hits = forbidden.filter((text) => fullText.includes(text));
  if (hits.length) {
    throw new Error(`${file} still exposes Google Maps controls/URLs: ${hits.join(", ")}`);
  }
}

function validateOfflineAddressContent(file, pdfText) {
  const fullText = normalizeText(
    [
      ...pdfText.matchAll(/BT \/(F\d) ([\d.]+) Tf ([\d.-]+) ([\d.-]+) Td \((.*?)\) Tj ET/g),
    ].map((match) => normalizeText(match[5])).join(" "),
  );

  if (file === "dezrecs.pdf") {
    const missing = recommendations
      .map((recommendation) => ({
        name: recommendation.name,
        address: getOfflineAddress(recommendation.id),
      }))
      .filter(({ address }) => !address?.lines?.length)
      .flatMap(({ name }) => [`${name} has no offline address data`]);
    for (const recommendation of recommendations) {
      const address = getOfflineAddress(recommendation.id);
      for (const line of address?.lines ?? []) {
        if (!fullText.includes(normalizeText(line))) {
          missing.push(`${recommendation.name} missing offline address line: ${line}`);
        }
      }
    }
    if (missing.length) throw new Error(`dezrecs.pdf offline address QA failed:\n${missing.join("\n")}`);
  }

  if (file === "amsterdam-map.pdf" || file === "edinburgh-map.pdf") {
    const map = offlineMaps.find((entry) => entry.fileName === file);
    const missing = [];
    if (!map) throw new Error(`${file} has no source map data`);
    const entries = [
      ...(map.homeBase ? [{ id: map.homeBase.id, name: map.homeBase.name }] : []),
      ...map.pins.map((pin) => ({ id: pin.id, name: pin.name })),
      ...map.offMapSections.flatMap((section) => section.items.map((item) => ({ id: item.id, name: item.name }))),
    ];
    for (const entry of entries) {
      if (!fullText.includes(normalizeText(entry.name))) missing.push(`${entry.name} missing from ${file}`);
      const address = getOfflineAddress(entry.id);
      for (const line of address?.lines ?? []) {
        if (!fullText.includes(normalizeText(line))) {
          missing.push(`${entry.name} missing address line from ${file}: ${line}`);
        }
      }
    }
    if (missing.length) throw new Error(`${file} address directory QA failed:\n${missing.join("\n")}`);
  }
}

function validateMapDirectory(mapManifest) {
  const errors = [];
  for (const map of offlineMaps) {
    const manifestMap = mapManifest.maps.find((entry) => entry.file === map.fileName);
    if (!manifestMap) {
      errors.push(`${map.fileName} missing map manifest entry`);
      continue;
    }
    const entries = manifestMap.directoryEntries ?? [];
    const pinEntries = entries.filter((entry) => entry.pin !== null);
    const expectedPins = map.pins.map((pin) => pin.pin).sort((a, b) => a - b);
    const actualPins = pinEntries.map((entry) => entry.pin).sort((a, b) => a - b);
    if (JSON.stringify(actualPins) !== JSON.stringify(expectedPins)) {
      errors.push(`${map.fileName} directory pins ${actualPins.join(",")} do not match map pins ${expectedPins.join(",")}`);
    }
    const duplicates = actualPins.filter((pin, index) => actualPins.indexOf(pin) !== index);
    if (duplicates.length) {
      errors.push(`${map.fileName} duplicates directory pin numbers: ${[...new Set(duplicates)].join(", ")}`);
    }
    const expectedIds = [
      ...(map.homeBase ? [map.homeBase.id] : []),
      ...map.pins.map((pin) => pin.id),
      ...map.offMapSections.flatMap((section) => section.items.map((item) => item.id)),
    ];
    const actualIds = entries.map((entry) => entry.id);
    for (const id of expectedIds) {
      if (!actualIds.includes(id)) errors.push(`${map.fileName} directory missing ${id}`);
      const address = getOfflineAddress(id);
      if (!address?.lines?.length) errors.push(`${map.fileName} has no offline address for ${id}`);
    }
  }
  if (errors.length) {
    throw new Error(`map directory QA failed:\n${errors.join("\n")}`);
  }
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
  validateMapDirectory(mapManifest);

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
const layoutManifest = validateLayoutManifest();
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
  if (["dezrecs.pdf", "amsterdam-map.pdf", "edinburgh-map.pdf"].includes(file)) {
    validateNoGoogleMapsControls(file, pdfText);
    validateOfflineAddressContent(file, pdfText);
  }
  if (file === "emergency.pdf") validateEmergencyContent(pdfText);
  if (file === "dezrecs.pdf") validateDezrecsContent(pdfText);
  results.push({ file, size: buffer.length, ...textResult });
}

if (fs.existsSync(path.join(downloadsDir, "trip-guide.pdf"))) {
  throw new Error("trip-guide.pdf still exists");
}

writeQaSummary(results, mapManifest);
console.log("PDF verification passed");
