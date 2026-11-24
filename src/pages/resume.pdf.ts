import { getCollection } from "astro:content";
import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import {
  PDFArray,
  PDFDocument,
  PDFName,
  PDFString,
  clip,
  endPath,
  popGraphicsState,
  pushGraphicsState,
  rectangle,
  rgb
} from "pdf-lib";
import type { PDFFont, PDFPage, RGB } from "pdf-lib";

import { buildResumePdfModel } from "../lib/resumePdf";
import { buildSections, formatRange } from "../lib/resumeSections";

export const prerender = true;

// A4, Swiss grid: a margin index column for section labels, one text column.
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MX = 44;
const TOP = PAGE_H - 44;
const BOTTOM = 52;
const LABEL_W = 104;
const TEXT_X = MX + LABEL_W + 16;
const TEXT_W = PAGE_W - MX - TEXT_X;
const BODY = 9;
const LEAD = 12.6;

const C = {
  ink: rgb(0.082, 0.09, 0.11),
  ink2: rgb(0.224, 0.239, 0.275),
  grey: rgb(0.357, 0.373, 0.408),
  rule: rgb(0.835, 0.827, 0.8),
  accent: rgb(0.122, 0.247, 0.82)
};

type Link = { start: number; end: number; url: string };

// Inline markdown -> plain text plus link ranges. Code ticks are dropped.
function parseInline(source: string): { text: string; links: Link[] } {
  const links: Link[] = [];
  let text = "";
  let cursor = 0;
  for (const match of source.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    text += source.slice(cursor, match.index);
    links.push({ start: text.length, end: text.length + match[1].length, url: match[2].trim() });
    text += match[1];
    cursor = (match.index ?? 0) + match[0].length;
  }
  text += source.slice(cursor);
  const ticks = [...text.matchAll(/`/g)].map((m) => m.index ?? 0);
  for (const tick of ticks.reverse()) {
    text = text.slice(0, tick) + text.slice(tick + 1);
    for (const link of links) {
      if (link.start > tick) link.start -= 1;
      if (link.end > tick) link.end -= 1;
    }
  }
  return { text, links };
}

// Greedy wrap that keeps character offsets so links can be drawn across lines.
function wrap(text: string, width: number, size: number, font: PDFFont): Array<{ line: string; start: number }> {
  const lines: Array<{ line: string; start: number }> = [];
  const words = [...text.matchAll(/\S+/g)];
  let line = "";
  let start = 0;
  for (const word of words) {
    const candidate = line ? `${line} ${word[0]}` : word[0];
    if (line && font.widthOfTextAtSize(candidate, size) > width) {
      lines.push({ line, start });
      line = word[0];
      start = word.index ?? 0;
    } else {
      if (!line) start = word.index ?? 0;
      line = candidate;
    }
  }
  if (line) lines.push({ line, start });
  return lines;
}

const displayUrl = (url: string) => url.replace(/^(https?:\/\/|mailto:)/, "").replace(/^www\./, "").replace(/\/$/, "");
const absoluteUrl = (url: string) => (/^(https?:|mailto:)/.test(url) ? url : `https://${url}`);

export async function GET(): Promise<Response> {
  const cv = (await getCollection("cv"))[0];
  if (!cv) {
    return new Response("Missing resume content", { status: 500 });
  }
  const data = cv.data;
  const model = buildResumePdfModel(data, cv.body ?? "");

  const pdf = await PDFDocument.create();
  pdf.setTitle(`${model.name} — Curriculum Vitae`);
  pdf.setAuthor(model.name);
  pdf.setSubject(data.headline.replace(/\*/g, ""));
  pdf.registerFontkit(fontkit);
  // Static Archivo instances, so the PDF speaks in the same voice as the site.
  const embed = async (name: string) =>
    pdf.embedFont(await readFile(path.join(process.cwd(), "src", "assets", "fonts", `archivo-${name}.ttf`)), { subset: true });
  const regular = await embed("regular");
  const bold = await embed("semibold");
  const display = await embed("name");
  const figureFont = await embed("figure");
  const headline = data.headline.replace(/\*/g, "");
  const sections = buildSections(cv.body ?? "");
  const listItems = (raw: string) =>
    raw.split("\n").filter((line) => line.trim().startsWith("- ")).map((line) => line.trim().slice(2));
  const portrait = await readFile(path.join(process.cwd(), "src", "assets", "jordan.jpg"))
    .then((bytes) => pdf.embedJpg(bytes))
    .catch(() => undefined);

  let page: PDFPage = pdf.addPage([PAGE_W, PAGE_H]);
  let y = TOP;

  const link = (url: string, x: number, yBase: number, w: number, size: number) => {
    const annot = pdf.context.register(
      pdf.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: [x, yBase - 2, x + w, yBase + size],
        Border: [0, 0, 0],
        A: { Type: "Action", S: "URI", URI: PDFString.of(absoluteUrl(url)) }
      })
    );
    let annots = page.node.lookupMaybe(PDFName.of("Annots"), PDFArray);
    if (!annots) {
      annots = pdf.context.obj([]) as PDFArray;
      page.node.set(PDFName.of("Annots"), annots);
    }
    annots.push(annot);
  };

  const text = (value: string, x: number, size: number, font: PDFFont, color: RGB, yPos = y) =>
    page.drawText(value, { x, y: yPos, size, font, color });

  const rule = (color: RGB, thickness: number, x1 = MX, x2 = PAGE_W - MX) =>
    page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness, color });

  const newPage = () => {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    y = TOP;
    text(model.name, MX, 8, bold, C.ink);
    text("Curriculum Vitae", TEXT_X, 8, regular, C.grey);
    y -= 8;
    rule(C.ink, 0.6);
    y -= 22;
  };

  const ensure = (height: number) => {
    if (y - height < BOTTOM) newPage();
  };

  // Paragraph in the text column with link-aware wrapping.
  const paragraph = (source: string, opts: { size?: number; font?: PDFFont; color?: RGB; indent?: number; bullet?: boolean } = {}) => {
    const { size = BODY, font = regular, color = C.ink2, indent = 0, bullet = false } = opts;
    const { text: plain, links } = parseInline(source);
    const x0 = TEXT_X + indent + (bullet ? 10 : 0);
    const lead = size * 1.4;
    wrap(plain, TEXT_W - indent - (bullet ? 10 : 0), size, font).forEach(({ line, start }, index) => {
      ensure(lead);
      if (bullet && index === 0) {
        page.drawLine({ start: { x: TEXT_X + indent, y: y + size * 0.32 }, end: { x: TEXT_X + indent + 5, y: y + size * 0.32 }, thickness: 0.6, color: C.ink });
      }
      const end = start + line.length;
      const segments: Array<{ from: number; to: number; url: string }> = [];
      let cursor = start;
      for (const l of links) {
        const from = Math.max(start, l.start);
        const to = Math.min(end, l.end);
        if (from >= to) continue;
        if (from > cursor) segments.push({ from: cursor, to: from, url: "" });
        segments.push({ from, to, url: l.url });
        cursor = to;
      }
      if (cursor < end) segments.push({ from: cursor, to: end, url: "" });
      let x = x0;
      for (const segment of segments) {
        const piece = plain.slice(segment.from, segment.to);
        if (!piece) continue;
        const width = font.widthOfTextAtSize(piece, size);
        text(piece, x, size, font, segment.url ? C.accent : color);
        if (segment.url) link(segment.url, x, y, width, size);
        x += width;
      }
      y -= lead;
    });
  };

  const section = (index: number, label: string, minHeight = 40) => {
    y -= 14;
    ensure(minHeight);
    rule(C.ink, 0.6);
    y -= 14;
    const num = String(index + 1).padStart(2, "0");
    text(num, MX, 8, regular, C.grey);
    text(label, MX + 16, 8, bold, C.ink);
  };

  // Masthead
  const photoW = 64;
  const photoH = 80;
  if (portrait) {
    const px = PAGE_W - MX - photoW;
    const py = TOP - photoH + 8;
    const scale = Math.max(photoW / portrait.width, photoH / portrait.height);
    const w = portrait.width * scale;
    const h = portrait.height * scale;
    page.pushOperators(pushGraphicsState(), rectangle(px, py, photoW, photoH), clip(), endPath());
    page.drawImage(portrait, { x: px + (photoW - w) / 2, y: py + (photoH - h) / 2, width: w, height: h });
    page.pushOperators(popGraphicsState());
  }

  y -= 20;
  text(model.name, MX, 32, display, C.ink);
  y -= 22;
  for (const { line } of wrap(headline, PAGE_W - MX * 2 - photoW - 24, 11, regular)) {
    text(line, MX, 11, regular, C.ink);
    y -= 15;
  }
  y -= 4;
  const contacts = [`mailto:${data.email}`, data.website, data.github, data.linkedin];
  let cx = MX;
  contacts.forEach((url, index) => {
    const label = displayUrl(url);
    const width = regular.widthOfTextAtSize(label, 8.5);
    text(label, cx, 8.5, regular, C.accent);
    link(url, cx, y, width, 8.5);
    cx += width;
    if (index < contacts.length - 1) {
      text("  ·  ", cx, 8.5, regular, C.grey);
      cx += regular.widthOfTextAtSize("  ·  ", 8.5);
    }
  });
  y -= 13;
  text([data.location, data.timezone, model.contact.phone ? `Phone ${model.contact.phone.toLowerCase()}` : ""].filter(Boolean).join("  ·  "), MX, 8.5, regular, C.grey);
  y = Math.min(y, TOP - photoH + 8) - 20;

  // Key figures
  rule(C.ink, 0.6);
  y -= 26;
  const colW = (PAGE_W - MX * 2) / data.keyFigures.length;
  let figuresBottom = y;
  data.keyFigures.forEach((figure, index) => {
    const x = MX + colW * index;
    text(figure.value, x, 26, figureFont, C.ink);
    if (figure.unit) text(figure.unit, x + figureFont.widthOfTextAtSize(figure.value, 26) + 2, 9, regular, C.ink);
    let ly = y - 13;
    for (const { line } of wrap(figure.label, colW - 14, 7.5, regular)) {
      text(line, x, 7.5, regular, C.grey, ly);
      ly -= 9.5;
    }
    figuresBottom = Math.min(figuresBottom, ly);
  });
  y = figuresBottom - 4;

  // Same numbered sections, same labels, same order as the web page.
  sections.forEach((entry, index) => {
    if (entry.id === "summary") {
      section(index, entry.title);
      paragraph(model.summary, { size: 9.5, color: C.ink });
    } else if (entry.id === "experience") {
      section(index, entry.title, 90);
      model.experiences.forEach((experience, i) => {
        const span = data.experienceSpans[i];
        if (i > 0) y -= 8;
        ensure(LEAD * 5);
        const company = (span?.service ?? experience.title).replace(" - ", " – ");
        const range = span ? formatRange(`${span.start} to ${span.end}`) : experience.range;
        text(company, TEXT_X, 10.5, bold, C.ink);
        text(range, PAGE_W - MX - regular.widthOfTextAtSize(range, 8.5), 8.5, regular, C.grey);
        y -= LEAD;
        text(span?.role ?? "", TEXT_X, BODY, bold, span?.end === "Present" ? C.accent : C.ink);
        y -= LEAD + 1;
        paragraph(experience.summary);
        y -= 2;
        for (const highlight of experience.highlights) paragraph(highlight, { bullet: true });
      });
    } else if (entry.id === "projects") {
      section(index, entry.title);
      model.sideQuests.forEach((quest, i) => {
        if (i > 0) y -= 5;
        ensure(LEAD * 2);
        paragraph(quest.title, { font: bold, color: C.ink });
        for (const detail of quest.details) paragraph(detail);
      });
    } else if (entry.id === "contact") {
      section(index, entry.title);
      for (const item of listItems(entry.raw)) paragraph(item);
    } else {
      const items = listItems(entry.raw);
      section(index, entry.title);
      if (items.length > 0) items.forEach((item) => paragraph(item, { bullet: true }));
      else paragraph(entry.raw.trim());
    }
  });

  const pages = pdf.getPages();
  pages.forEach((p, index) => {
    const label = `${index + 1} / ${pages.length}`;
    p.drawText(label, { x: PAGE_W - MX - regular.widthOfTextAtSize(label, 7.5), y: 28, size: 7.5, font: regular, color: C.grey });
  });

  const bytes = await pdf.save();
  return new Response(bytes.slice().buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Jordan-Simonovski-Resume.pdf"'
    }
  });
}
