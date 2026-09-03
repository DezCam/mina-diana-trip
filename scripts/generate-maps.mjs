import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import { offlineMaps } from "../src/data/mapLocations.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const downloadsDir = path.join(root, "public", "downloads");
const tileCacheDir = path.join(root, ".cache", "osm-tiles-v2");
const siteTitle = "Diana & Mina's European Adventure";
const userAgent =
  "DianaMinaEuropeanAdventureMapGenerator/1.0 contact:https://mina-diana-trip.vercel.app";
const updated = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(new Date());

const colors = {
  parchment: [246, 240, 229],
  cream: [255, 249, 239],
  navy: [23, 50, 77],
  ink: [33, 39, 43],
  canal: [61, 127, 152],
  moss: [102, 114, 95],
  heather: [137, 119, 144],
  brass: [198, 161, 91],
  white: [255, 255, 255],
};

const mapStyles = {
  amsterdam: {
    zoom: 14,
    pin: colors.canal,
    home: colors.brass,
    mapHeight: 350,
  },
  edinburgh: {
    zoom: 14,
    pin: colors.moss,
    home: colors.brass,
    mapHeight: 350,
  },
};

function rgb(color) {
  return color.map((value) => (value / 255).toFixed(3)).join(" ");
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[—–]/g, "-")
    .replace(/·/g, "/")
    .replace(/→/g, "->")
    .replace(/[^\x09\x0A\x0D\x20-\x7E©]/g, "");
}

function pdfString(value) {
  return cleanText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/©/g, "\\251");
}

function estimateTextWidth(text, size, font = "helvetica") {
  const factor = font.includes("times") ? 0.49 : 0.52;
  return cleanText(text).length * size * factor;
}

function wrapText(text, maxWidth, size, font) {
  const words = cleanText(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && estimateTextWidth(next, size, font) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function lonToWorldX(lon, zoom) {
  return ((lon + 180) / 360) * 256 * 2 ** zoom;
}

function latToWorldY(lat, zoom) {
  const sin = Math.sin((lat * Math.PI) / 180);
  return (
    (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) *
    256 *
    2 ** zoom
  );
}

function pointToTile(point) {
  return {
    x: Math.floor(point.x / 256),
    y: Math.floor(point.y / 256),
  };
}

function destinationPoints(map, zoom) {
  const locations = [...map.pins];
  if (map.homeBase) locations.push(map.homeBase);
  return locations.map((location) => ({
    ...location,
    x: lonToWorldX(location.lon, zoom),
    y: latToWorldY(location.lat, zoom),
  }));
}

function calculateCrop(map, width, height, zoom) {
  const points = destinationPoints(map, zoom);
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const rawMinX = Math.min(...xs);
  const rawMaxX = Math.max(...xs);
  const rawMinY = Math.min(...ys);
  const rawMaxY = Math.max(...ys);
  const boundsWidth = rawMaxX - rawMinX;
  const boundsHeight = rawMaxY - rawMinY;
  const padding = 100;
  const scale = Math.min(
    1,
    (width - padding * 2) / Math.max(boundsWidth, 1),
    (height - padding * 2) / Math.max(boundsHeight, 1),
  );
  const cropWidth = Math.ceil(width / scale);
  const cropHeight = Math.ceil(height / scale);
  const centerX = (rawMinX + rawMaxX) / 2;
  const centerY = (rawMinY + rawMaxY) / 2;

  return {
    x: Math.floor(centerX - cropWidth / 2),
    y: Math.floor(centerY - cropHeight / 2),
    width: cropWidth,
    height: cropHeight,
    scale,
  };
}

function tileUrl(z, x, y) {
  return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchTile(z, x, y) {
  const tilePath = path.join(tileCacheDir, String(z), String(x), `${y}.png`);
  if (fs.existsSync(tilePath)) {
    return fs.readFileSync(tilePath);
  }

  await wait(250);
  fs.mkdirSync(path.dirname(tilePath), { recursive: true });
  const url = tileUrl(z, x, y);
  const buffer = await new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": userAgent,
          Referer: "https://mina-diana-trip.vercel.app",
        },
      },
      (response) => {
        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`Tile request failed ${response.statusCode}: ${url}`));
          return;
        }
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve(Buffer.concat(chunks)));
      },
    );
    request.on("error", reject);
    request.setTimeout(15000, () => {
      request.destroy(new Error(`Tile request timed out: ${url}`));
    });
  });

  fs.writeFileSync(tilePath, buffer);
  return buffer;
}

async function renderMapImage(map, width, height) {
  const zoom = mapStyles[map.id].zoom;
  const crop = calculateCrop(map, width, height, zoom);
  const minTile = pointToTile({ x: crop.x, y: crop.y });
  const maxTile = pointToTile({
    x: crop.x + crop.width,
    y: crop.y + crop.height,
  });
  const sourceWidth = (maxTile.x - minTile.x + 1) * 256;
  const sourceHeight = (maxTile.y - minTile.y + 1) * 256;
  const source = new PNG({ width: sourceWidth, height: sourceHeight });

  for (let tileX = minTile.x; tileX <= maxTile.x; tileX += 1) {
    for (let tileY = minTile.y; tileY <= maxTile.y; tileY += 1) {
      const tile = PNG.sync.read(await fetchTile(zoom, tileX, tileY));
      const offsetX = (tileX - minTile.x) * 256;
      const offsetY = (tileY - minTile.y) * 256;
      PNG.bitblt(tile, source, 0, 0, 256, 256, offsetX, offsetY);
    }
  }

  const image = new PNG({ width, height });
  const cropOffsetX = crop.x - minTile.x * 256;
  const cropOffsetY = crop.y - minTile.y * 256;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const srcX = Math.min(
        source.width - 1,
        Math.max(0, Math.floor(cropOffsetX + x / crop.scale)),
      );
      const srcY = Math.min(
        source.height - 1,
        Math.max(0, Math.floor(cropOffsetY + y / crop.scale)),
      );
      const sourceIdx = (srcY * source.width + srcX) * 4;
      const targetIdx = (y * width + x) * 4;
      image.data[targetIdx] = source.data[sourceIdx];
      image.data[targetIdx + 1] = source.data[sourceIdx + 1];
      image.data[targetIdx + 2] = source.data[sourceIdx + 2];
      image.data[targetIdx + 3] = 255;
    }
  }

  const projected = destinationPoints(map, zoom).map((point) => ({
    ...point,
    px: (point.x - crop.x) * crop.scale,
    py: (point.y - crop.y) * crop.scale,
  }));

  const rgbData = Buffer.alloc(width * height * 3);
  for (let idx = 0; idx < width * height; idx += 1) {
    rgbData[idx * 3] = image.data[idx * 4];
    rgbData[idx * 3 + 1] = image.data[idx * 4 + 1];
    rgbData[idx * 3 + 2] = image.data[idx * 4 + 2];
  }

  return {
    width,
    height,
    rgbData,
    points: projected,
  };
}

class PdfDoc {
  constructor(title) {
    this.title = title;
    this.width = 792;
    this.height = 612;
    this.margin = 36;
    this.objects = new Map();
    this.nextId = 1;
    this.catalogId = this.alloc();
    this.pagesId = this.alloc();
    this.pages = [];
    this.current = null;
  }

  alloc() {
    return this.nextId++;
  }

  setObject(id, value) {
    this.objects.set(id, value);
  }

  addPage() {
    this.current = {
      commands: [],
      annots: [],
      xobjects: new Map(),
    };
    this.pages.push(this.current);
    this.setFill(colors.parchment);
    this.rect(0, 0, this.width, this.height, "f");
    return this.current;
  }

  setFill(color) {
    this.current.commands.push(`${rgb(color)} rg`);
  }

  setStroke(color) {
    this.current.commands.push(`${rgb(color)} RG`);
  }

  rect(x, y, w, h, mode = "S") {
    this.current.commands.push(
      `${x.toFixed(2)} ${(this.height - y - h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${mode}`,
    );
  }

  line(x1, y1, x2, y2, color = colors.brass, width = 0.7) {
    this.setStroke(color);
    this.current.commands.push(
      `${width.toFixed(2)} w ${x1.toFixed(2)} ${(this.height - y1).toFixed(2)} m ${x2.toFixed(2)} ${(this.height - y2).toFixed(2)} l S`,
    );
  }

  text(text, x, y, options = {}) {
    const size = options.size ?? 11;
    const font = options.font ?? "helvetica";
    const color = options.color ?? colors.ink;
    const leading = options.leading ?? size * 1.25;
    const width = options.width ?? this.width - this.margin * 2;
    const lines = wrapText(text, width, size, font);
    const fontName =
      font === "times-bold"
        ? "F4"
        : font === "times"
          ? "F2"
          : font === "bold"
            ? "F3"
            : "F1";
    this.setFill(color);
    lines.forEach((line, index) => {
      const lineY = y + index * leading;
      this.current.commands.push(
        `BT /${fontName} ${size} Tf ${x.toFixed(2)} ${(this.height - lineY).toFixed(2)} Td (${pdfString(line)}) Tj ET`,
      );
    });
    return lines.length * leading;
  }

  linkAnnotation(x, y, w, h, href) {
    if (!href) return;
    this.current.annots.push(
      `<< /Type /Annot /Subtype /Link /Rect [${x.toFixed(2)} ${(this.height - y - h).toFixed(2)} ${(x + w).toFixed(2)} ${(this.height - y).toFixed(2)}] /Border [0 0 0] /A << /S /URI /URI (${pdfString(href)}) >> >>`,
    );
  }

  imageRgb({ rgbData, width, height }, x, y, w, h) {
    const imageId = this.alloc();
    const imageName = `Im${imageId}`;
    this.setObject(imageId, {
      stream: zlib.deflateSync(rgbData),
      dict: `/Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode`,
    });
    this.current.xobjects.set(imageName, imageId);
    this.current.commands.push(
      `q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${(this.height - y - h).toFixed(2)} cm /${imageName} Do Q`,
    );
  }

  circle(x, y, radius, fill, stroke = colors.navy, strokeWidth = 1) {
    const c = radius * 0.5522847498;
    const cy = this.height - y;
    this.setFill(fill);
    this.setStroke(stroke);
    this.current.commands.push(`${strokeWidth.toFixed(2)} w`);
    this.current.commands.push(
      [
        `${(x + radius).toFixed(2)} ${cy.toFixed(2)} m`,
        `${(x + radius).toFixed(2)} ${(cy + c).toFixed(2)} ${(x + c).toFixed(2)} ${(cy + radius).toFixed(2)} ${x.toFixed(2)} ${(cy + radius).toFixed(2)} c`,
        `${(x - c).toFixed(2)} ${(cy + radius).toFixed(2)} ${(x - radius).toFixed(2)} ${(cy + c).toFixed(2)} ${(x - radius).toFixed(2)} ${cy.toFixed(2)} c`,
        `${(x - radius).toFixed(2)} ${(cy - c).toFixed(2)} ${(x - c).toFixed(2)} ${(cy - radius).toFixed(2)} ${x.toFixed(2)} ${(cy - radius).toFixed(2)} c`,
        `${(x + c).toFixed(2)} ${(cy - radius).toFixed(2)} ${(x + radius).toFixed(2)} ${(cy - c).toFixed(2)} ${(x + radius).toFixed(2)} ${cy.toFixed(2)} c`,
        "B",
      ].join(" "),
    );
  }

  marker(x, y, label, fill, radius = 10) {
    this.circle(x, y, radius, fill, colors.navy, 1);
    const size = label.length > 1 ? 7 : 8;
    const textWidth = estimateTextWidth(label, size, "bold");
    this.text(label, x - textWidth / 2, y + size / 2 - 1, {
      size,
      font: "bold",
      color: colors.white,
      width: radius * 2,
      leading: size,
    });
  }

  addPageObjects() {
    const kids = [];
    for (const page of this.pages) {
      const contentId = this.alloc();
      const pageId = this.alloc();
      kids.push(`${pageId} 0 R`);

      this.setObject(contentId, {
        stream: Buffer.from(page.commands.join("\n"), "utf8"),
        dict: "",
      });

      const xobjects =
        page.xobjects.size > 0
          ? `/XObject << ${[...page.xobjects.entries()]
              .map(([name, id]) => `/${name} ${id} 0 R`)
              .join(" ")} >>`
          : "";
      const annots =
        page.annots.length > 0 ? `/Annots [${page.annots.join(" ")}]` : "";

      this.setObject(
        pageId,
        `<< /Type /Page /Parent ${this.pagesId} 0 R /MediaBox [0 0 ${this.width} ${this.height}] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >> /F3 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F4 << /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >> >> ${xobjects} >> /Contents ${contentId} 0 R ${annots} >>`,
      );
    }

    this.setObject(
      this.pagesId,
      `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${kids.length} >>`,
    );
    this.setObject(
      this.catalogId,
      `<< /Type /Catalog /Pages ${this.pagesId} 0 R >>`,
    );
  }

  save(outputPath) {
    this.addPageObjects();
    const chunks = [Buffer.from("%PDF-1.7\n%\xFF\xFF\xFF\xFF\n", "binary")];
    const offsets = [0];

    for (let id = 1; id < this.nextId; id += 1) {
      offsets[id] = Buffer.concat(chunks).length;
      const object = this.objects.get(id);
      if (!object) throw new Error(`Missing PDF object ${id}`);
      if (typeof object === "string") {
        chunks.push(Buffer.from(`${id} 0 obj\n${object}\nendobj\n`, "utf8"));
      } else {
        chunks.push(
          Buffer.from(
            `${id} 0 obj\n<< ${object.dict} /Length ${object.stream.length} >>\nstream\n`,
            "utf8",
          ),
          object.stream,
          Buffer.from("\nendstream\nendobj\n", "utf8"),
        );
      }
    }

    const bodyLength = Buffer.concat(chunks).length;
    const xref = [
      "xref",
      `0 ${this.nextId}`,
      "0000000000 65535 f ",
      ...offsets
        .slice(1)
        .map((offset) => `${String(offset).padStart(10, "0")} 00000 n `),
      "trailer",
      `<< /Size ${this.nextId} /Root ${this.catalogId} 0 R >>`,
      "startxref",
      String(bodyLength),
      "%%EOF",
    ].join("\n");

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, Buffer.concat([...chunks, Buffer.from(xref)]));
  }
}

function groupedPins(pins) {
  return pins.reduce((groups, pin) => {
    const group = groups.get(pin.group) ?? [];
    group.push(pin);
    groups.set(pin.group, group);
    return groups;
  }, new Map());
}

function drawLegend(doc, map, yStart, xStart, columnWidth, rowHeight) {
  let y = yStart;
  let x = xStart;
  let row = 0;
  const maxRows = 8;

  if (map.homeBase) {
    doc.text(`HOME ${map.homeBase.name} - ${map.homeBase.label}`, x, y, {
      size: 9.5,
      font: "bold",
      color: colors.navy,
      width: columnWidth,
      leading: 11,
    });
    doc.linkAnnotation(x, y - 9, columnWidth, 14, map.homeBase.mapsUrl);
    y += rowHeight;
    row += 1;
  }

  for (const [group, pins] of groupedPins(map.pins)) {
    if (row >= maxRows) {
      x += columnWidth + 16;
      y = yStart;
      row = 0;
    }
    doc.text(group.toUpperCase(), x, y, {
      size: 7.5,
      font: "bold",
      color: group === "Could Do's" ? colors.heather : colors.canal,
      width: columnWidth,
      leading: 9,
    });
    y += 10;
    row += 1;
    for (const pin of pins) {
      if (row >= maxRows) {
        x += columnWidth + 16;
        y = yStart;
        row = 0;
      }
      const label = `${pin.pin}. ${pin.name}`;
      doc.text(label, x, y, {
        size: 9,
        font: "helvetica",
        color: colors.ink,
        width: columnWidth,
        leading: 10.5,
      });
      doc.linkAnnotation(x, y - 8, columnWidth, 13, pin.mapsUrl);
      y += rowHeight;
      row += 1;
    }
  }
}

function drawOffMapPage(doc, map) {
  doc.addPage();
  doc.text(siteTitle, doc.margin, 34, {
    size: 15,
    font: "times-bold",
    color: colors.navy,
    width: 360,
  });
  doc.text(map.title, doc.margin, 58, {
    size: 26,
    font: "times-bold",
    color: colors.navy,
    width: 460,
  });
  doc.line(doc.margin, 87, doc.width - doc.margin, 87);
  let y = 112;
  const colWidth = 220;
  const rowHeight = 14;
  const columns = [doc.margin, doc.margin + colWidth + 24, doc.margin + (colWidth + 24) * 2];
  let col = 0;

  for (const section of map.offMapSections) {
    if (y > 520) {
      col += 1;
      y = 112;
    }
    const x = columns[Math.min(col, columns.length - 1)];
    doc.text(section.title.toUpperCase(), x, y, {
      size: 9,
      font: "bold",
      color: colors.canal,
      width: colWidth,
    });
    y += 18;

    for (const item of section.items) {
      if (y > 560) {
        col += 1;
        y = 112;
      }
      const itemX = columns[Math.min(col, columns.length - 1)];
      const label = item.location ? `${item.name} - ${item.location}` : item.name;
      doc.text(label, itemX, y, {
        size: 9,
        color: colors.ink,
        width: colWidth,
        leading: 11,
      });
      doc.linkAnnotation(itemX, y - 8, colWidth, 13, item.mapsUrl);
      y += rowHeight;
    }
    y += 10;
  }
}

function drawMapPage(doc, map, mapImage) {
  const style = mapStyles[map.id];
  const mapX = doc.margin;
  const mapY = 98;
  const mapW = doc.width - doc.margin * 2;
  const mapH = style.mapHeight;

  doc.addPage();
  doc.text(siteTitle, doc.margin, 30, {
    size: 15,
    font: "times-bold",
    color: colors.navy,
    width: 360,
  });
  doc.text(map.title, doc.margin, 55, {
    size: 31,
    font: "times-bold",
    color: colors.navy,
    width: 460,
  });
  doc.text(`Updated: ${updated}`, doc.width - 190, 37, {
    size: 9,
    font: "bold",
    color: colors.heather,
    width: 150,
  });
  doc.line(doc.margin, 84, doc.width - doc.margin, 84);

  doc.setFill(colors.cream);
  doc.rect(mapX - 5, mapY - 5, mapW + 10, mapH + 10, "f");
  doc.imageRgb(mapImage, mapX, mapY, mapW, mapH);

  for (const point of mapImage.points) {
    const x = mapX + point.px * (mapW / mapImage.width);
    const y = mapY + point.py * (mapH / mapImage.height);
    if ("pin" in point) {
      doc.marker(x, y, String(point.pin), style.pin);
    } else {
      doc.marker(x, y, "H", style.home, 11);
    }
  }

  doc.setFill(colors.cream);
  doc.rect(mapX + 8, mapY + mapH - 24, 174, 17, "f");
  doc.text("© OpenStreetMap contributors", mapX + 14, mapY + mapH - 12, {
    size: 7,
    font: "bold",
    color: colors.ink,
    width: 165,
  });
  doc.setStroke(colors.brass);
  doc.rect(mapX - 5, mapY - 5, mapW + 10, mapH + 10, "S");

  drawLegend(doc, map, 474, doc.margin, 210, 13.8);

  if (map.offMapSections.length > 0) {
    drawOffMapPage(doc, map);
  }
}

async function generateMapPdf(map) {
  const mapImage = await renderMapImage(map, 1440, 700);
  const doc = new PdfDoc(map.title);
  drawMapPage(doc, map, mapImage);
  const outputPath = path.join(downloadsDir, map.fileName);
  doc.save(outputPath);
  return outputPath;
}

fs.mkdirSync(downloadsDir, { recursive: true });

for (const map of offlineMaps) {
  const outputPath = await generateMapPdf(map);
  const size = fs.statSync(outputPath).size;
  console.log(`${path.relative(root, outputPath)} ${(size / 1024).toFixed(1)} KB`);
}
