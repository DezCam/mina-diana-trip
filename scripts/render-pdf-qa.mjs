import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const downloadsDir = path.join(root, "public", "downloads");
const qaDir = path.join(root, "artifacts", "pdf-qa");
const standardFontDataUrl = `${path.join(root, "node_modules", "pdfjs-dist", "standard_fonts")}${path.sep}`;
const dpiScale = 200 / 72;
const targets = [
  { file: "dezrecs.pdf", folder: "dezrecs" },
  { file: "emergency.pdf", folder: "emergency" },
];

async function renderPdf(target) {
  const pdfPath = path.join(downloadsDir, target.file);
  if (!fs.existsSync(pdfPath)) throw new Error(`${target.file} is missing`);
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdf = await getDocument({ data, disableWorker: true, standardFontDataUrl }).promise;
  const outputDir = path.join(qaDir, target.folder);
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });
  const pageFiles = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: dpiScale });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: context, viewport }).promise;
    const pagePath = path.join(outputDir, `page-${String(pageNumber).padStart(2, "0")}.png`);
    fs.writeFileSync(pagePath, canvas.toBuffer("image/png"));
    pageFiles.push(pagePath);
  }

  await writeContactSheet(target, pageFiles);
  return { file: target.file, pages: pdf.numPages };
}

async function writeContactSheet(target, pageFiles) {
  const thumbWidth = 420;
  const gap = 28;
  const labelHeight = 28;
  const columns = Math.min(2, pageFiles.length);
  const images = await Promise.all(pageFiles.map((pageFile) => loadImage(pageFile)));
  const thumbs = images.map((image) => {
    const scale = thumbWidth / image.width;
    return {
      image,
      width: thumbWidth,
      height: Math.round(image.height * scale),
    };
  });
  const rows = Math.ceil(thumbs.length / columns);
  const rowHeights = Array.from({ length: rows }, (_, row) =>
    Math.max(...thumbs.slice(row * columns, row * columns + columns).map((thumb) => thumb.height + labelHeight)),
  );
  const sheetWidth = columns * thumbWidth + (columns + 1) * gap;
  const sheetHeight = rowHeights.reduce((sum, rowHeight) => sum + rowHeight, gap) + rows * gap;
  const canvas = createCanvas(sheetWidth, sheetHeight);
  const context = canvas.getContext("2d");
  context.fillStyle = "#f6f0e5";
  context.fillRect(0, 0, sheetWidth, sheetHeight);
  context.fillStyle = "#17324d";
  context.font = "18px Helvetica";

  let y = gap;
  thumbs.forEach((thumb, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    if (col === 0 && index > 0) {
      y += rowHeights[row - 1] + gap;
    }
    const x = gap + col * (thumbWidth + gap);
    context.fillText(`${target.file} - page ${index + 1}`, x, y + 18);
    context.drawImage(thumb.image, x, y + labelHeight, thumb.width, thumb.height);
    context.strokeStyle = "#c6a15b";
    context.lineWidth = 2;
    context.strokeRect(x, y + labelHeight, thumb.width, thumb.height);
  });

  fs.writeFileSync(path.join(qaDir, `${target.folder}-contact-sheet.png`), canvas.toBuffer("image/png"));
}

fs.mkdirSync(qaDir, { recursive: true });
for (const target of targets) {
  const result = await renderPdf(target);
  console.log(`${result.file}: rendered ${result.pages} pages`);
}
