import { getCollection } from "astro:content";
import { readFile } from "node:fs/promises";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PDFFont, PDFImage } from "pdf-lib";

import { buildResumePdfModel } from "../lib/resumePdf";

export const prerender = true;

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 34;
const TOP_PADDING = 30;
const SIDEBAR_WIDTH = 176;
const COLUMN_GAP = 24;
const BODY_SIZE = 9;
const HEADING_SIZE = 11;
const ROLE_SIZE = 10;
const TITLE_SIZE = 26;
const LINE_HEIGHT = 12.5;
const SECTION_SPACING = 9;
const SIDEBAR_INNER_PADDING = 6;

const COLORS = {
  text: rgb(0.1, 0.14, 0.2),
  muted: rgb(0.35, 0.4, 0.5),
  accent: rgb(0.05, 0.08, 0.14),
  divider: rgb(0.78, 0.8, 0.85)
};

function wrapText(text: string, maxWidth: number, fontSize: number, font: PDFFont): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [];
  }

  const lines: string[] = [];
  let current = words[0] ?? "";

  for (const word of words.slice(1)) {
    const candidate = `${current} ${word}`;
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  lines.push(current);
  return lines;
}

export async function GET(): Promise<Response> {
  const cvCollection = await getCollection("cv");
  const cv = cvCollection[0];
  if (!cv) {
    return new Response("Missing resume content", { status: 500 });
  }

  const model = buildResumePdfModel(cv.data, cv.body ?? "");

  const pdf = await PDFDocument.create();
  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);
  let profileImage: PDFImage | undefined;
  try {
    const bytes = await readFile(new URL("../assets/jordan.jpg", import.meta.url));
    profileImage = await pdf.embedJpg(bytes);
  } catch {
    profileImage = undefined;
  }
  let y = PAGE_HEIGHT - MARGIN;

  const maxWidth = PAGE_WIDTH - MARGIN * 2;
  const mainX = MARGIN + SIDEBAR_WIDTH + COLUMN_GAP;
  const mainWidth = maxWidth - SIDEBAR_WIDTH - COLUMN_GAP;
  const sidebarX = MARGIN;
  const sidebarWidth = SIDEBAR_WIDTH;

  const ensureSpace = (required: number): void => {
    if (y - required <= MARGIN) {
      page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
  };

  const drawHeader = (isContinuation: boolean): number => {
    const headerTop = PAGE_HEIGHT - MARGIN;
    const nameLines = model.name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.toUpperCase());

    let headerY = headerTop;
    if (isContinuation) {
      page.drawText(model.name.toUpperCase(), {
        x: MARGIN,
        y: headerY,
        size: 13,
        font: titleFont,
        color: COLORS.accent
      });
      headerY -= 16;
      page.drawText("EXPERIENCE CONTD.", {
        x: MARGIN,
        y: headerY,
        size: 10,
        font: titleFont,
        color: COLORS.muted
      });
      headerY -= 16;
    } else {
      for (const line of nameLines) {
        page.drawText(line, {
          x: MARGIN,
          y: headerY,
          size: TITLE_SIZE,
          font: titleFont,
          color: COLORS.accent
        });
        headerY -= 25;
      }
      page.drawText(model.role.toUpperCase(), {
        x: MARGIN,
        y: headerY,
        size: ROLE_SIZE,
        font: titleFont,
        color: COLORS.muted
      });
      headerY -= 17;
      page.drawText(model.location, {
        x: MARGIN,
        y: headerY,
        size: BODY_SIZE,
        font: bodyFont,
        color: COLORS.muted
      });
      headerY -= 15;
    }

    page.drawLine({
      start: { x: MARGIN, y: headerY },
      end: { x: PAGE_WIDTH - MARGIN, y: headerY },
      thickness: 1,
      color: COLORS.divider
    });
    return headerY - TOP_PADDING;
  };

  const drawSidebar = (sidebarTopY: number): void => {
    let sidebarY = sidebarTopY;

    const drawSidebarHeading = (label: string): void => {
      sidebarY -= 2;
      page.drawText(label, {
        x: sidebarX,
        y: sidebarY,
        size: HEADING_SIZE,
        font: titleFont,
        color: COLORS.accent
      });
      sidebarY -= LINE_HEIGHT;
    };

    const drawSidebarSubheading = (label: string): void => {
      page.drawText(label, {
        x: sidebarX + SIDEBAR_INNER_PADDING,
        y: sidebarY,
        size: BODY_SIZE,
        font: titleFont,
        color: COLORS.muted
      });
      sidebarY -= LINE_HEIGHT;
    };

    if (profileImage) {
      const maxImageWidth = sidebarWidth - SIDEBAR_INNER_PADDING * 2;
      const imageScale = maxImageWidth / profileImage.width;
      const imageWidth = maxImageWidth;
      const imageHeight = profileImage.height * imageScale;
      page.drawImage(profileImage, {
        x: sidebarX + SIDEBAR_INNER_PADDING,
        y: sidebarY - imageHeight + 2,
        width: imageWidth,
        height: imageHeight
      });
      page.drawRectangle({
        x: sidebarX + SIDEBAR_INNER_PADDING,
        y: sidebarY - imageHeight + 2,
        width: imageWidth,
        height: imageHeight,
        borderWidth: 0.8,
        borderColor: COLORS.divider
      });
      sidebarY -= imageHeight + SECTION_SPACING;
    }

    const drawSidebarItems = (items: string[]): void => {
      for (const item of items) {
        const lines = wrapText(item, sidebarWidth - SIDEBAR_INNER_PADDING * 2, BODY_SIZE, bodyFont);
        for (const line of lines) {
          page.drawText(line, {
            x: sidebarX + SIDEBAR_INNER_PADDING,
            y: sidebarY,
            size: BODY_SIZE,
            font: bodyFont,
            color: COLORS.text
          });
          sidebarY -= LINE_HEIGHT;
        }
      }
      sidebarY -= SECTION_SPACING;
    };

    drawSidebarHeading("CONTACT");
    const contactLines = [
      model.contact.phone,
      model.contact.email,
      model.contact.website.replace(/^https?:\/\/(www\.)?/, ""),
      model.contact.linkedin.replace(/^https?:\/\/(www\.)?/, "")
    ].filter((entry): entry is string => Boolean(entry));
    drawSidebarItems(contactLines);

    drawSidebarHeading("SKILLS & OTHER");
    const sidebarSkills = model.skills
      .map((item) => item.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim())
      .filter((item) => item.length > 0)
      .slice(0, 6);
    drawSidebarItems(sidebarSkills);

    const sidebarExtracurriculars = model.extracurriculars
      .map((item) => item.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim())
      .filter((item) => item.length > 0)
      .slice(0, 3);
    if (sidebarExtracurriculars.length > 0) {
      drawSidebarSubheading("EXTRACURRICULARS");
      drawSidebarItems(sidebarExtracurriculars);
    }
  };

  const createContinuationPage = (): number => {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    return drawHeader(true);
  };

  let contentStartY = drawHeader(false);
  drawSidebar(contentStartY);
  y = contentStartY;

  const drawMainHeading = (heading: string): void => {
    ensureSpace(LINE_HEIGHT + 4);
    page.drawText(heading, {
      x: mainX,
      y,
      size: HEADING_SIZE,
      font: titleFont,
      color: COLORS.accent
    });
    page.drawLine({
      start: { x: mainX, y: y - 1 },
      end: { x: mainX + mainWidth, y: y - 1 },
      thickness: 0.6,
      color: COLORS.divider
    });
    y -= LINE_HEIGHT + 1;
  };

  const drawMainParagraph = (text: string, indent = 0): void => {
    const lines = wrapText(text, mainWidth - indent, BODY_SIZE, bodyFont);
    for (const line of lines) {
      if (y - LINE_HEIGHT <= MARGIN) {
        y = createContinuationPage();
      }
      page.drawText(line, {
        x: mainX + indent,
        y,
        size: BODY_SIZE,
        font: bodyFont,
        color: COLORS.text
      });
      y -= LINE_HEIGHT;
    }
  };

  drawMainHeading("PROFILE");
  drawMainParagraph(model.summary);
  y -= SECTION_SPACING;

  drawMainHeading("EXPERIENCE");
  model.experiences.forEach((experience) => {
    if (y - (LINE_HEIGHT * 6) <= MARGIN) {
      y = createContinuationPage();
      drawMainHeading("EXPERIENCE");
    }
    const titleText = experience.title.toUpperCase();
    const rangeWidth = bodyFont.widthOfTextAtSize(experience.range, BODY_SIZE);
    const titleMaxWidth = Math.max(130, mainWidth - rangeWidth - 10);
    const titleLines = wrapText(titleText, titleMaxWidth, BODY_SIZE, titleFont);

    page.drawText(titleLines[0] ?? titleText, {
      x: mainX,
      y,
      size: BODY_SIZE,
      font: titleFont,
      color: COLORS.accent
    });
    page.drawText(experience.range, {
      x: mainX + Math.max(0, mainWidth - rangeWidth),
      y,
      size: BODY_SIZE,
      font: bodyFont,
      color: COLORS.muted
    });
    y -= LINE_HEIGHT;

    for (const extraLine of titleLines.slice(1)) {
      page.drawText(extraLine, {
        x: mainX,
        y,
        size: BODY_SIZE,
        font: titleFont,
        color: COLORS.accent
      });
      y -= LINE_HEIGHT;
    }

    drawMainParagraph(experience.summary, 8);
    for (const highlight of experience.highlights) {
      drawMainParagraph(`• ${highlight}`, 12);
    }
    y -= SECTION_SPACING;
  });

  const bytes = await pdf.save();
  const output = new Uint8Array(bytes);
  const arrayBuffer = output.buffer.slice(output.byteOffset, output.byteOffset + output.byteLength);
  return new Response(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Jordan-Simonovski-Resume.pdf"'
    }
  });
}
