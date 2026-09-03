import fs from "node:fs";
import crypto from "node:crypto";
import https from "node:https";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import { getOfflineAddress, offlineAddresses } from "../src/data/offlineAddresses.ts";
import { offlineMaps } from "../src/data/mapLocations.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const downloadsDir = path.join(root, "public", "downloads");
const qaDir = path.join(root, "artifacts", "pdf-qa");
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

function sourceHash(value) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");
}

function mapAddressSource(map) {
  const ids = [
    map.homeBase?.id,
    ...map.pins.map((pin) => pin.id),
    ...map.offMapSections.flatMap((section) => section.items.map((item) => item.id)),
  ].filter(Boolean);
  return Object.fromEntries(ids.map((id) => [id, offlineAddresses[id]]));
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

function textHeight(text, width, size, font = "helvetica", leading = size * 1.25) {
  return cleanText(text)
    .split(/\n/)
    .reduce((sum, line) => sum + wrapText(line, width, size, font).length * leading, 0);
}

function addressLinesFor(id) {
  const address = getOfflineAddress(id);
  if (!address) {
    return {
      id,
      lines: ["Location not resolved"],
      status: "UNRESOLVED",
      sourceUrl: "",
    };
  }
  return address;
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

function drawLegend(doc, map, yStart, xStart) {
  const maxY = doc.height - 12;
  const gap = 10;
  const columns = 4;
  const columnWidth = (doc.width - doc.margin * 2 - gap * (columns - 1)) / columns;
  let column = 0;
  let x = xStart;

  if (map.homeBase) {
    doc.text(`HOME ${map.homeBase.name} - ${map.homeBase.label}`, xStart, yStart, {
      size: 10,
      font: "bold",
      color: colors.navy,
      width: doc.width - doc.margin * 2,
      leading: 12,
    });
  }

  const columnStartY = yStart + (map.homeBase ? 32 : 0);
  let y = columnStartY;

  function nextColumn() {
    column += 1;
    if (column >= columns) {
      throw new Error(`${map.fileName} legend exceeds allocated bounds`);
    }
    x = xStart + column * (columnWidth + gap);
    y = columnStartY;
  }

  function ensureLegendHeight(height) {
    if (y + height > maxY) nextColumn();
  }

  for (const [group, pins] of groupedPins(map.pins)) {
    const firstPin = pins[0];
    const firstPinHeight = firstPin ? textHeight(`${firstPin.pin}. ${firstPin.name}`, columnWidth, 8, "helvetica", 9.3) + 3 : 0;
    ensureLegendHeight(10 + firstPinHeight);
    doc.text(group.toUpperCase(), x, y, {
      size: 7.5,
      font: "bold",
      color: group === "Could Do's" ? colors.heather : colors.canal,
      width: columnWidth,
      leading: 9,
    });
    y += 10;
    for (const pin of pins) {
      const label = `${pin.pin}. ${pin.name}`;
      const height = textHeight(label, columnWidth, 8, "helvetica", 9.3) + 3;
      ensureLegendHeight(height);
      doc.text(label, x, y, {
        size: 8,
        font: "helvetica",
        color: colors.ink,
        width: columnWidth,
        leading: 9.3,
      });
      y += height;
    }
  }
}

function markerDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function countMarkerCollisions(markers, minDistance) {
  let collisions = 0;
  for (let i = 0; i < markers.length; i += 1) {
    for (let j = i + 1; j < markers.length; j += 1) {
      if (markerDistance(markers[i], markers[j]) < minDistance) collisions += 1;
    }
  }
  return collisions;
}

function markerCandidates(anchor, mapBounds) {
  const directions = [
    [0, 0],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];
  const distances = [0, 25, 36, 49, 63, 78, 94];
  const candidates = [];
  for (const distance of distances) {
    for (const [dx, dy] of directions) {
      if (distance === 0 && (dx !== 0 || dy !== 0)) continue;
      if (distance > 0 && dx === 0 && dy === 0) continue;
      const length = Math.hypot(dx, dy) || 1;
      const x = anchor.x + (dx / length) * distance;
      const y = anchor.y + (dy / length) * distance;
      if (
        x >= mapBounds.x + 13 &&
        x <= mapBounds.x + mapBounds.w - 13 &&
        y >= mapBounds.y + 13 &&
        y <= mapBounds.y + mapBounds.h - 13
      ) {
        candidates.push({ x, y });
      }
    }
  }
  return candidates.sort(
    (a, b) => markerDistance(a, anchor) - markerDistance(b, anchor) || a.y - b.y || a.x - b.x,
  );
}

function layoutMarkers(mapImage, mapX, mapY, mapW, mapH) {
  const radius = 10;
  const minDistance = radius * 2 + 5;
  const mapBounds = { x: mapX, y: mapY, w: mapW, h: mapH };
  const rawMarkers = mapImage.points.map((point) => ({
    id: point.id,
    label: "pin" in point ? String(point.pin) : "H",
    isHome: !("pin" in point),
    pin: "pin" in point ? point.pin : "HOME",
    anchorX: mapX + point.px * (mapW / mapImage.width),
    anchorY: mapY + point.py * (mapH / mapImage.height),
    x: mapX + point.px * (mapW / mapImage.width),
    y: mapY + point.py * (mapH / mapImage.height),
    radius: point.pin ? radius : 11,
  }));
  const initialCollisions = countMarkerCollisions(rawMarkers, minDistance);
  const placed = [];

  for (const marker of rawMarkers) {
    const candidates = markerCandidates(
      { x: marker.anchorX, y: marker.anchorY },
      mapBounds,
    );
    const chosen = candidates.find((candidate) =>
      placed.every((existing) => markerDistance(candidate, existing) >= minDistance),
    );
    if (!chosen) {
      throw new Error(`Could not place non-overlapping marker ${marker.label}`);
    }
    placed.push({
      ...marker,
      x: chosen.x,
      y: chosen.y,
      displaced: markerDistance(chosen, { x: marker.anchorX, y: marker.anchorY }) > 2,
    });
  }

  const remainingCollisions = countMarkerCollisions(placed, minDistance);
  if (remainingCollisions > 0) {
    throw new Error(`Marker collision QA failed with ${remainingCollisions} remaining collisions`);
  }

  return {
    markers: placed,
    initialCollisions,
    remainingCollisions,
  };
}

function addDirectoryPage(doc, map, subtitle) {
  doc.addPage();
  doc.text(siteTitle, doc.margin, 34, {
    size: 15,
    font: "times-bold",
    color: colors.navy,
    width: 360,
  });
  doc.text(map.title, doc.margin, 68, {
    size: 26,
    font: "times-bold",
    color: colors.navy,
    width: 460,
  });
  doc.text(subtitle, doc.width - 310, 72, {
    size: 13,
    font: "bold",
    color: colors.canal,
    width: 270,
  });
  doc.line(doc.margin, 94, doc.width - doc.margin, 94);
  return 118;
}

function addressEntryHeight(name, address, numberLabel = "") {
  const width = 520;
  const title = numberLabel ? `${numberLabel}. ${name}` : name;
  return (
    textHeight(title, width, 10, "bold", 12) +
    address.lines.reduce((sum, line) => sum + textHeight(line, width, 8.5, "helvetica", 10.5), 0) +
    12
  );
}

function drawDirectorySection(doc, map, state, title) {
  if (state.y > 510) {
    state.y = addDirectoryPage(doc, map, `${map.id.toUpperCase()} - ADDRESS DIRECTORY`);
  }
  doc.text(title.toUpperCase(), doc.margin, state.y, {
    size: 9,
    font: "bold",
    color: colors.canal,
    width: doc.width - doc.margin * 2,
    leading: 11,
  });
  state.y += 18;
}

function drawDirectoryEntry(doc, map, state, entry) {
  const address = addressLinesFor(entry.id);
  const needed = addressEntryHeight(entry.name, address, entry.pin);
  if (state.y + needed > 565) {
    state.y = addDirectoryPage(doc, map, `${map.id.toUpperCase()} - ADDRESS DIRECTORY`);
  }

  const title = entry.pin ? `${entry.pin}. ${entry.name}` : entry.name;
  doc.text(title, doc.margin, state.y, {
    size: 10,
    font: "bold",
    color: colors.navy,
    width: doc.width - doc.margin * 2,
    leading: 12,
  });
  state.y += textHeight(title, doc.width - doc.margin * 2, 10, "bold", 12) + 3;

  for (const line of address.lines) {
    doc.text(line, doc.margin + 18, state.y, {
      size: 8.5,
      font: "helvetica",
      color: colors.ink,
      width: doc.width - doc.margin * 2 - 18,
      leading: 10.5,
    });
    state.y += textHeight(line, doc.width - doc.margin * 2 - 18, 8.5, "helvetica", 10.5);
  }
  state.y += 10;

  state.entries.push({
    id: entry.id,
    pin: entry.pin ?? null,
    name: entry.name,
    lines: address.lines,
    status: address.status,
    sourceUrl: address.sourceUrl,
    section: state.currentSection,
  });
}

function drawAddressDirectoryPages(doc, map) {
  const state = {
    y: addDirectoryPage(doc, map, `${map.id.toUpperCase()} - ADDRESS DIRECTORY`),
    entries: [],
    currentSection: "",
  };

  if (map.homeBase) {
    state.currentSection = "Home";
    drawDirectorySection(doc, map, state, "Home");
    drawDirectoryEntry(doc, map, state, {
      id: map.homeBase.id,
      name: `${map.homeBase.name} - ${map.homeBase.label}`,
    });
    state.y += 4;
  }

  for (const [group, pins] of groupedPins(map.pins)) {
    state.currentSection = group;
    drawDirectorySection(doc, map, state, group);
    for (const pin of pins) {
      drawDirectoryEntry(doc, map, state, pin);
    }
    state.y += 4;
  }

  for (const section of map.offMapSections) {
    state.currentSection = section.title;
    drawDirectorySection(doc, map, state, section.title);
    for (const item of section.items) {
      drawDirectoryEntry(doc, map, state, item);
    }
    state.y += 4;
  }

  return state.entries;
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
  doc.text(map.title, doc.margin, 68, {
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
  doc.line(doc.margin, 92, doc.width - doc.margin, 92);

  doc.setFill(colors.cream);
  doc.rect(mapX - 5, mapY - 5, mapW + 10, mapH + 10, "f");
  doc.imageRgb(mapImage, mapX, mapY, mapW, mapH);

  const markerLayout = layoutMarkers(mapImage, mapX, mapY, mapW, mapH);
  for (const marker of markerLayout.markers) {
    if (marker.displaced) {
      doc.line(marker.anchorX, marker.anchorY, marker.x, marker.y, colors.navy, 0.45);
    }
  }
  for (const marker of markerLayout.markers) {
    if (marker.isHome) {
      doc.marker(marker.x, marker.y, marker.label, style.home, 11);
    } else {
      doc.marker(marker.x, marker.y, marker.label, style.pin);
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

  drawLegend(doc, map, 474, doc.margin);

  const directoryEntries = drawAddressDirectoryPages(doc, map);

  return { markerLayout, directoryEntries };
}

async function generateMapPdf(map) {
  const mapImage = await renderMapImage(map, 1440, 700);
  const doc = new PdfDoc(map.title);
  const { markerLayout, directoryEntries } = drawMapPage(doc, map, mapImage);
  const outputPath = path.join(downloadsDir, map.fileName);
  doc.save(outputPath);
  return { outputPath, markerLayout, directoryEntries };
}

fs.mkdirSync(downloadsDir, { recursive: true });
fs.mkdirSync(qaDir, { recursive: true });
const mapManifest = {
  generatedAt: new Date().toISOString(),
  maps: [],
};

for (const map of offlineMaps) {
  const { outputPath, markerLayout, directoryEntries } = await generateMapPdf(map);
  const size = fs.statSync(outputPath).size;
  mapManifest.maps.push({
    file: map.fileName,
    sourceHash: sourceHash({ map, offlineAddresses: mapAddressSource(map) }),
    initialMarkerCollisions: markerLayout.initialCollisions,
    remainingMarkerCollisions: markerLayout.remainingCollisions,
    markers: markerLayout.markers.map((marker) => ({
      id: marker.id,
      pin: marker.pin,
      anchorX: Number(marker.anchorX.toFixed(2)),
      anchorY: Number(marker.anchorY.toFixed(2)),
      x: Number(marker.x.toFixed(2)),
      y: Number(marker.y.toFixed(2)),
      radius: marker.radius,
      displaced: marker.displaced,
    })),
    directoryEntries,
  });
  console.log(`${path.relative(root, outputPath)} ${(size / 1024).toFixed(1)} KB`);
}

fs.writeFileSync(
  path.join(qaDir, "map-layout.json"),
  JSON.stringify(mapManifest, null, 2),
);
