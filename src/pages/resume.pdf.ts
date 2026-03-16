import { getCollection } from "astro:content";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  PDFDocument,
  StandardFonts,
  appendBezierCurve,
  clip,
  closePath,
  endPath,
  moveTo,
  popGraphicsState,
  pushGraphicsState,
  rgb
} from "pdf-lib";
import type { PDFFont, PDFImage } from "pdf-lib";

import { buildResumePdfModel } from "../lib/resumePdf";

export const prerender = true;

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 28;
const TOP_PADDING = 18;
const SIDEBAR_WIDTH = 214;
const COLUMN_GAP = 28;
const BODY_SIZE = 9;
const HEADING_SIZE = 12.5;
const ROLE_SIZE = 10.5;
const TITLE_SIZE = 27;
const LINE_HEIGHT = 12;
const SECTION_SPACING = 8;
const SIDEBAR_INNER_PADDING = 14;

const COLORS = {
  text: rgb(0.1, 0.14, 0.2),
  muted: rgb(0.35, 0.4, 0.5),
  accent: rgb(0.05, 0.08, 0.14),
  divider: rgb(0.78, 0.8, 0.85),
  sidebarOverlay: rgb(0.08, 0.1, 0.14),
  sidebarHeading: rgb(0.92, 0.94, 0.98),
  sidebarText: rgb(0.96, 0.97, 1),
  sidebarMuted: rgb(0.8, 0.84, 0.9)
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
  const tryEmbedImage = async (relativePath: string): Promise<PDFImage | undefined> => {
    const assetName = relativePath.split("/").pop() ?? relativePath;
    const diskPath = path.join(process.cwd(), "src", "assets", assetName);
    try {
      const bytes = await readFile(diskPath);
      if (/\.(jpe?g)$/i.test(relativePath)) {
        return await pdf.embedJpg(bytes);
      }
      if (/\.(png)$/i.test(relativePath)) {
        return await pdf.embedPng(bytes);
      }
      return undefined;
    } catch {
      return undefined;
    }
  };
  const profileImage =
    (await tryEmbedImage("../assets/jordan.jpg")) ??
    (await tryEmbedImage("../assets/jordan.png")) ??
    (await tryEmbedImage("../assets/jordan.webp"));
  const sidebarSplashImage =
    (await tryEmbedImage("../assets/splashback.jpg")) ??
    (await tryEmbedImage("../assets/splashback.png")) ??
    (await tryEmbedImage("../assets/splashback.webp"));
  let y = PAGE_HEIGHT - MARGIN;

  const maxWidth = PAGE_WIDTH;
  const mainX = SIDEBAR_WIDTH + COLUMN_GAP;
  const mainWidth = maxWidth - mainX - MARGIN;
  const sidebarX = 0;
  const sidebarWidth = SIDEBAR_WIDTH;

  const ensureSpace = (required: number): void => {
    if (y - required <= MARGIN) {
      page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
  };

  const drawHeader = (isContinuation: boolean): number => {
    if (!isContinuation) {
      return PAGE_HEIGHT - MARGIN;
    }

    const headerY = PAGE_HEIGHT - MARGIN;
    page.drawText(model.name.toUpperCase(), {
      x: mainX,
      y: headerY,
      size: 13,
      font: titleFont,
      color: COLORS.accent
    });
    page.drawText("EXPERIENCE CONTD.", {
      x: mainX,
      y: headerY - 16,
      size: 10,
      font: titleFont,
      color: COLORS.muted
    });
    page.drawLine({
      start: { x: mainX, y: headerY - 22 },
      end: { x: PAGE_WIDTH - MARGIN, y: headerY - 22 },
      thickness: 1,
      color: COLORS.divider
    });
    return headerY - 22 - TOP_PADDING;
  };

  const drawSidebar = (sidebarTopY: number): void => {
    let sidebarY = sidebarTopY;
    page.drawRectangle({
      x: sidebarX,
      y: 0,
      width: sidebarWidth,
      height: PAGE_HEIGHT,
      color: rgb(0.12, 0.13, 0.17)
    });
    if (sidebarSplashImage) {
      const splashWidth = sidebarWidth;
      const splashScale = splashWidth / sidebarSplashImage.width;
      const splashHeight = sidebarSplashImage.height * splashScale;
      page.drawImage(sidebarSplashImage, {
        x: sidebarX,
        y: (PAGE_HEIGHT - splashHeight) / 2,
        width: splashWidth,
        height: splashHeight
      });
    }
    page.drawRectangle({
      x: sidebarX,
      y: 0,
      width: sidebarWidth,
      height: PAGE_HEIGHT,
      color: COLORS.sidebarOverlay,
      opacity: 0.75
    });

    const drawSidebarHeading = (label: string): void => {
      sidebarY -= 2;
      page.drawText(label, {
        x: sidebarX + SIDEBAR_INNER_PADDING,
        y: sidebarY,
        size: HEADING_SIZE,
        font: titleFont,
        color: COLORS.sidebarHeading
      });
      sidebarY -= LINE_HEIGHT;
    };

    const drawSidebarSubheading = (label: string): void => {
      page.drawText(label, {
        x: sidebarX + SIDEBAR_INNER_PADDING,
        y: sidebarY,
        size: BODY_SIZE,
        font: titleFont,
        color: COLORS.sidebarMuted
      });
      sidebarY -= LINE_HEIGHT;
    };

    const drawCircularProfile = (): void => {
      if (!profileImage) {
        return;
      }

      const radius = 56;
      const centerX = sidebarX + sidebarWidth / 2;
      const centerY = PAGE_HEIGHT - 108;
      const kappa = 0.552284749831;
      const control = radius * kappa;

      page.pushOperators(
        pushGraphicsState(),
        moveTo(centerX + radius, centerY),
        appendBezierCurve(
          centerX + radius,
          centerY + control,
          centerX + control,
          centerY + radius,
          centerX,
          centerY + radius
        ),
        appendBezierCurve(
          centerX - control,
          centerY + radius,
          centerX - radius,
          centerY + control,
          centerX - radius,
          centerY
        ),
        appendBezierCurve(
          centerX - radius,
          centerY - control,
          centerX - control,
          centerY - radius,
          centerX,
          centerY - radius
        ),
        appendBezierCurve(
          centerX + control,
          centerY - radius,
          centerX + radius,
          centerY - control,
          centerX + radius,
          centerY
        ),
        closePath(),
        clip(),
        endPath()
      );

      const imageScale = Math.max((radius * 2) / profileImage.width, (radius * 2) / profileImage.height);
      const imageWidth = profileImage.width * imageScale;
      const imageHeight = profileImage.height * imageScale;
      page.drawImage(profileImage, {
        x: centerX - imageWidth / 2,
        y: centerY - imageHeight / 2,
        width: imageWidth,
        height: imageHeight
      });
      page.pushOperators(popGraphicsState());

      page.drawCircle({
        x: centerX,
        y: centerY,
        size: radius + 1.5,
        borderColor: rgb(1, 1, 1),
        borderWidth: 2.5,
        color: undefined
      });
    };
    drawCircularProfile();

    const nameLines = wrapText(
      model.name.toUpperCase(),
      sidebarWidth - SIDEBAR_INNER_PADDING * 2,
      TITLE_SIZE - 2,
      titleFont
    );
    let nameY = PAGE_HEIGHT - 194;
    for (const line of nameLines) {
      page.drawText(line, {
        x: sidebarX + SIDEBAR_INNER_PADDING,
        y: nameY,
        size: TITLE_SIZE - 2,
        font: titleFont,
        color: COLORS.sidebarText
      });
      nameY -= 23;
    }
    page.drawText(model.role, {
      x: sidebarX + SIDEBAR_INNER_PADDING,
      y: nameY - 6,
      size: ROLE_SIZE,
      font: bodyFont,
      color: COLORS.sidebarMuted
    });
    page.drawText(model.location, {
      x: sidebarX + SIDEBAR_INNER_PADDING,
      y: nameY - 22,
      size: BODY_SIZE,
      font: bodyFont,
      color: COLORS.sidebarMuted
    });
    sidebarY = nameY - 56;

    const drawSidebarItems = (items: string[]): void => {
      for (const item of items) {
        const lines = wrapText(item, sidebarWidth - SIDEBAR_INNER_PADDING * 2, BODY_SIZE, bodyFont);
        for (const line of lines) {
          page.drawText(line, {
            x: sidebarX + SIDEBAR_INNER_PADDING,
            y: sidebarY,
            size: BODY_SIZE,
            font: bodyFont,
            color: COLORS.sidebarText
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
      size: HEADING_SIZE + 1.5,
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
