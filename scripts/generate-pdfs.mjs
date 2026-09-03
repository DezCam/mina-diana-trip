import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { emergencyCities, quickCallGuide, stateDepartmentFallback } from "../src/data/emergency.ts";
import { recommendationGroups, recommendations, recommendationsIntroVideo } from "../src/data/recommendations.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const downloadsDir = path.join(root, "public", "downloads");
const siteTitle = "Diana & Mina's European Adventure";
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
  coral: [216, 107, 94],
  white: [255, 255, 255],
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
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
}

function pdfString(value) {
  return cleanText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function contentString(value) {
  return pdfString(value).replace(/\n/g, " ");
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

function parseJpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  throw new Error("Could not read JPEG dimensions");
}

class PdfDoc {
  constructor(title) {
    this.title = title;
    this.width = 612;
    this.height = 792;
    this.margin = 50;
    this.objects = new Map();
    this.nextId = 1;
    this.catalogId = this.alloc();
    this.pagesId = this.alloc();
    this.pages = [];
    this.current = null;
    this.imageCache = new Map();
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
    this.y = this.margin;
    this.setFill(colors.parchment);
    this.rect(0, 0, this.width, this.height, "f");
    return this.current;
  }

  ensure(height) {
    if (!this.current || this.y + height > this.height - this.margin) {
      this.addPage();
    }
  }

  setFill(color) {
    this.current.commands.push(`${rgb(color)} rg`);
  }

  setStroke(color) {
    this.current.commands.push(`${rgb(color)} RG`);
  }

  rect(x, y, w, h, mode = "S") {
    this.current.commands.push(`${x.toFixed(2)} ${(this.height - y - h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${mode}`);
  }

  line(x1, y1, x2, y2, color = colors.brass, width = 0.8) {
    this.setStroke(color);
    this.current.commands.push(`${width.toFixed(2)} w ${x1.toFixed(2)} ${(this.height - y1).toFixed(2)} m ${x2.toFixed(2)} ${(this.height - y2).toFixed(2)} l S`);
  }

  text(text, x, y, options = {}) {
    const size = options.size ?? 11;
    const font = options.font ?? "helvetica";
    const color = options.color ?? colors.ink;
    const leading = options.leading ?? size * 1.35;
    const maxWidth = options.width ?? this.width - this.margin * 2;
    const lines = wrapText(text, maxWidth, size, font);
    this.setFill(color);
    const fontName = font === "times-bold" ? "F4" : font === "times" ? "F2" : font === "bold" ? "F3" : "F1";
    lines.forEach((line, index) => {
      const lineY = y + index * leading;
      this.current.commands.push(`BT /${fontName} ${size} Tf ${x.toFixed(2)} ${(this.height - lineY).toFixed(2)} Td (${contentString(line)}) Tj ET`);
    });
    return lines.length * leading;
  }

  heading(text, level = 1) {
    const size = level === 1 ? 30 : level === 2 ? 22 : 15;
    const font = level <= 2 ? "times-bold" : "bold";
    const color = level === 1 ? colors.navy : level === 2 ? colors.canal : colors.moss;
    this.ensure(size * 2);
    const used = this.text(text, this.margin, this.y, { size, font, color, leading: size * 1.1 });
    this.y += used + (level === 1 ? 14 : 8);
  }

  paragraph(text, options = {}) {
    if (!text) return;
    const size = options.size ?? 11;
    const leading = options.leading ?? 15;
    const width = options.width ?? this.width - this.margin * 2;
    cleanText(text).split(/\n/).forEach((line) => {
      const height = wrapText(line, width, size, options.font ?? "helvetica").length * leading + 4;
      this.ensure(height);
      this.y += this.text(line, options.x ?? this.margin, this.y, {
        size,
        leading,
        width,
        font: options.font ?? "helvetica",
        color: options.color ?? colors.ink,
      }) + 1;
    });
    this.y += 2;
  }

  label(text, color = colors.canal) {
    this.ensure(20);
    this.y += this.text(text.toUpperCase(), this.margin, this.y, {
      size: 8,
      font: "bold",
      color,
      leading: 10,
      width: this.width - this.margin * 2,
    }) + 3;
  }

  linkAnnotation(x, y, w, h, href) {
    this.current.annots.push(`<< /Type /Annot /Subtype /Link /Rect [${x.toFixed(2)} ${(this.height - y - h).toFixed(2)} ${(x + w).toFixed(2)} ${(this.height - y).toFixed(2)}] /Border [0 0 0] /A << /S /URI /URI (${pdfString(href)}) >> >>`);
  }

  button(label, href, options = {}) {
    const x = options.x ?? this.margin;
    const y = this.y;
    const w = options.width ?? 145;
    const h = options.height ?? 30;
    this.ensure(h + 6);
    this.setFill(options.primary ? colors.navy : colors.cream);
    this.rect(x, y, w, h, "f");
    this.setStroke(colors.brass);
    this.rect(x, y, w, h, "S");
    this.text(label, x + 12, y + 19, {
      size: 9,
      font: "bold",
      color: options.primary ? colors.white : colors.navy,
      width: w - 24,
      leading: 10,
    });
    this.linkAnnotation(x, y, w, h, href);
    this.y += h + 8;
  }

  image(src, options = {}) {
    const fullPath = path.join(root, "public", src.replace(/^\//, ""));
    if (!fs.existsSync(fullPath)) return;
    const buffer = fs.readFileSync(fullPath);
    const { width, height } = parseJpegDimensions(buffer);
    let image = this.imageCache.get(fullPath);
    if (!image) {
      const id = this.alloc();
      image = { id, width, height, name: `Im${this.imageCache.size + 1}` };
      this.imageCache.set(fullPath, image);
      this.setObject(id, {
        stream: buffer,
        dict: `/Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode`,
      });
    }

    const x = options.x ?? this.margin;
    const maxW = options.width ?? this.width - this.margin * 2;
    const maxH = options.height ?? 150;
    const scale = Math.min(maxW / width, maxH / height, 1);
    const w = width * scale;
    const h = height * scale;
    this.ensure(h + 12);
    const drawX = x;
    const drawY = this.y;
    this.current.xobjects.set(image.name, image.id);
    this.current.commands.push(`q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${drawX.toFixed(2)} ${(this.height - drawY - h).toFixed(2)} cm /${image.name} Do Q`);
    this.setStroke(colors.brass);
    this.rect(drawX, drawY, w, h, "S");
    this.y += h + 10;
  }

  header(type) {
    this.heading(siteTitle, 1);
    this.label(type, colors.brass);
    this.paragraph(`Updated: ${updated}`, { size: 9, color: colors.moss });
    this.line(this.margin, this.y + 4, this.width - this.margin, this.y + 4);
    this.y += 18;
  }

  save(filePath) {
    const pageIds = [];
    for (const page of this.pages) {
      const contentId = this.alloc();
      const pageId = this.alloc();
      pageIds.push(pageId);
      const content = Buffer.from(`${page.commands.join("\n")}\n`, "binary");
      this.setObject(contentId, { stream: content, dict: "" });
      const xobjects = [...page.xobjects.entries()].map(([name, id]) => `/${name} ${id} 0 R`).join(" ");
      const resources = `/Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >> /F3 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F4 << /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >> >>${xobjects ? ` /XObject << ${xobjects} >>` : ""}`;
      const annots = page.annots.length ? ` /Annots [${page.annots.join(" ")}]` : "";
      this.setObject(pageId, `<< /Type /Page /Parent ${this.pagesId} 0 R /MediaBox [0 0 ${this.width} ${this.height}] /Resources << ${resources} >> /Contents ${contentId} 0 R${annots} >>`);
    }

    this.setObject(this.pagesId, `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`);
    this.setObject(this.catalogId, `<< /Type /Catalog /Pages ${this.pagesId} 0 R >>`);

    const chunks = [Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "binary")];
    const offsets = [0];
    for (let id = 1; id < this.nextId; id += 1) {
      offsets[id] = Buffer.concat(chunks).length;
      const obj = this.objects.get(id);
      chunks.push(Buffer.from(`${id} 0 obj\n`, "binary"));
      if (obj && typeof obj === "object" && "stream" in obj) {
        chunks.push(Buffer.from(`<< ${obj.dict} /Length ${obj.stream.length} >>\nstream\n`, "binary"));
        chunks.push(obj.stream);
        chunks.push(Buffer.from("\nendstream\n", "binary"));
      } else {
        chunks.push(Buffer.from(`${obj}\n`, "binary"));
      }
      chunks.push(Buffer.from("endobj\n", "binary"));
    }
    const body = Buffer.concat(chunks);
    const xrefOffset = body.length;
    const xref = [
      "xref",
      `0 ${this.nextId}`,
      "0000000000 65535 f ",
      ...offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `),
      "trailer",
      `<< /Size ${this.nextId} /Root ${this.catalogId} 0 R /Info << /Title (${pdfString(`${siteTitle} - ${this.title}`)}) >> >>`,
      "startxref",
      String(xrefOffset),
      "%%EOF",
      "",
    ].join("\n");
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, Buffer.concat([body, Buffer.from(xref, "binary")]));
  }
}

function createDoc(title) {
  const doc = new PdfDoc(title);
  doc.addPage();
  doc.header(title);
  return doc;
}

function sourceHash(value) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");
}

function writeManifest(entries) {
  const manifestPath = path.join(root, "artifacts", "pdf-qa", "manifest.json");
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        files: entries,
      },
      null,
      2,
    ),
  );
}

function generateDezrecs() {
  const doc = createDoc("Desmond's Amsterdam Recommendations");
  doc.label(recommendationsIntroVideo.title, colors.canal);
  doc.paragraph(recommendationsIntroVideo.url, { size: 11, font: "bold", color: colors.navy });
  doc.linkAnnotation(doc.margin, doc.y - 28, 250, 18, recommendationsIntroVideo.url);
  doc.y += 10;
  recommendationGroups.forEach((group) => {
    const groupItems = recommendations.filter((recommendation) => recommendation.group === group.id);
    if (!groupItems.length) return;
    doc.heading(group.label, 2);
    groupItems.forEach((recommendation) => {
      doc.ensure(95);
      doc.label(recommendation.category ?? group.label, colors.heather);
      doc.paragraph(recommendation.name, { size: 19, font: "times-bold", color: colors.navy, leading: 23 });
      if (recommendation.proximityNote) {
        doc.paragraph(recommendation.proximityNote, { size: 10, font: "bold", color: colors.canal, leading: 13 });
      }
      if (recommendation.shortRecommendation) {
        doc.paragraph(recommendation.shortRecommendation, { size: 12, leading: 16 });
      }
      if (recommendation.personalNote) {
        doc.paragraph(recommendation.personalNote, { size: 12, leading: 16 });
      }
      if (recommendation.historicalCost) {
        doc.label(recommendation.historicalCost.label, colors.canal);
        doc.paragraph(recommendation.historicalCost.value, { size: 15, font: "times-bold", color: colors.navy, leading: 18 });
        if (recommendation.historicalCost.note) {
          doc.paragraph(recommendation.historicalCost.note, { size: 10, font: "bold", color: colors.moss, leading: 13 });
        }
      }
      if (recommendation.video) {
        doc.label(recommendation.video.title, colors.canal);
        doc.button(recommendation.video.url, recommendation.video.url, { width: 235, height: 28 });
      }
      if (recommendation.images?.length) {
        recommendation.images.slice(0, 3).forEach((image) => {
          doc.image(image.src, {
            width: recommendation.images.length === 1 ? 340 : 230,
            height: recommendation.images.length === 1 ? 170 : 125,
          });
        });
      }
      if (recommendation.mapsUrl) {
        doc.button("Open in Maps", recommendation.mapsUrl);
      }
      if (recommendation.websiteUrl) {
        doc.button("Open Website", recommendation.websiteUrl);
      }
      if (recommendation.reservationUrl === null) {
        doc.paragraph("Reservation Link Coming Soon", { size: 10, font: "bold", color: colors.moss });
      } else if (recommendation.reservationUrl) {
        doc.button(recommendation.reservationLabel ?? "Reservation", recommendation.reservationUrl);
      }
      doc.y += 8;
      doc.line(doc.margin, doc.y, doc.width - doc.margin, doc.y, colors.brass, 0.4);
      doc.y += 14;
    });
  });
  doc.save(path.join(downloadsDir, "dezrecs.pdf"));
  return {
    file: "dezrecs.pdf",
    sourceHash: sourceHash({ recommendationGroups, recommendations, recommendationsIntroVideo }),
  };
}

function generateEmergency() {
  const doc = createDoc("Emergency Contacts");
  doc.label("Quick Emergency Numbers", colors.coral);
  doc.paragraph("Amsterdam", { size: 14, font: "bold", color: colors.canal, leading: 18 });
  doc.y += 12;
  doc.paragraph("112", { size: 42, font: "bold", color: colors.navy, leading: 46 });
  doc.linkAnnotation(doc.margin, doc.y - 55, 100, 48, "tel:112");
  doc.y += 10;
  doc.paragraph("Police / Ambulance / Fire", { size: 12, font: "bold", color: colors.ink, leading: 16 });
  doc.y += 22;
  doc.paragraph("Edinburgh", { size: 14, font: "bold", color: colors.moss, leading: 18 });
  doc.y += 12;
  doc.paragraph("999 / 112", { size: 42, font: "bold", color: colors.navy, leading: 46 });
  doc.linkAnnotation(doc.margin, doc.y - 55, 160, 48, "tel:999");
  doc.y += 10;
  doc.paragraph("Police / Ambulance / Fire", { size: 12, font: "bold", color: colors.ink, leading: 16 });
  doc.y += 16;
  doc.heading("What Do I Call?", 2);
  quickCallGuide.forEach((item) => {
    doc.paragraph(item.need, { size: 11, font: "bold", color: colors.ink, leading: 14 });
    if (item.amsterdam) doc.paragraph(`Amsterdam: ${item.amsterdam}`, { size: 11, color: colors.navy });
    doc.paragraph(`Edinburgh: ${item.edinburgh}`, { size: 11, color: colors.navy });
  });

  doc.addPage();
  doc.header("Emergency Contacts");
  emergencyCities.forEach((city, cityIndex) => {
    if (cityIndex > 0) doc.y += 12;
    doc.heading(city.name.toUpperCase(), 2);
    city.contacts.forEach((contact) => {
      doc.ensure(contact.title.includes("Consulate") ? 112 : 72);
      doc.label(contact.title, contact.title === "Emergency" ? colors.coral : colors.canal);
      if (contact.number) {
        doc.paragraph(contact.number, { size: contact.title === "Emergency" ? 28 : 20, font: "bold", color: colors.navy, leading: contact.title === "Emergency" ? 32 : 24 });
        doc.linkAnnotation(doc.margin, doc.y - 34, 170, 28, `tel:${contact.number.replace(/[^\d+]/g, "")}`);
      }
      if (contact.label) {
        doc.paragraph(contact.label, { size: 11, font: "bold", color: colors.ink, leading: 14 });
      }
      if (contact.address) {
        doc.paragraph(contact.address.join("\n"), { size: 10, leading: 13 });
      }
      if (contact.description) {
        doc.paragraph(contact.description, { size: 9, leading: 12 });
      }
      contact.actions.filter((action) => action.number !== contact.number).forEach((action) => {
        doc.paragraph(`${action.label}: ${action.number}`, { size: 10, font: "bold", color: colors.navy, leading: 13 });
        doc.linkAnnotation(doc.margin, doc.y - 16, 220, 16, action.href);
      });
      if (contact.warning) {
        doc.paragraph(contact.warning, { size: 10, font: "bold", color: colors.coral, leading: 13 });
      }
      doc.y += 8;
    });
  });

  doc.ensure(135);
  doc.heading(stateDepartmentFallback.title, 2);
  doc.paragraph(stateDepartmentFallback.description, { size: 11 });
  doc.paragraph(stateDepartmentFallback.label, { size: 10, font: "bold", color: colors.moss });
  doc.paragraph(stateDepartmentFallback.number, { size: 26, font: "bold", color: colors.navy, leading: 30 });
  doc.linkAnnotation(doc.margin, doc.y - 36, 190, 30, stateDepartmentFallback.href);
  doc.save(path.join(downloadsDir, "emergency.pdf"));
  return {
    file: "emergency.pdf",
    sourceHash: sourceHash({ emergencyCities, quickCallGuide, stateDepartmentFallback }),
  };
}

const manifestEntries = [generateDezrecs(), generateEmergency()];
writeManifest(manifestEntries);

for (const file of ["dezrecs.pdf", "emergency.pdf"]) {
  const target = path.join(downloadsDir, file);
  const size = fs.statSync(target).size;
  if (size <= 0) throw new Error(`${file} was not generated`);
  console.log(`${path.relative(root, target)} ${(size / 1024).toFixed(1)} KB`);
}
