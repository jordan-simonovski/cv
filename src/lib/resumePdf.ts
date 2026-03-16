import { extractBlocks } from "./markdown";

type ResumePdfSpan = {
  id?: string;
  service: string;
  role: string;
  start: string;
  end: string;
  status?: "ok" | "warn" | "critical";
  summary: string;
  pdfSummary?: string;
  highlights: string[];
  pdfHighlights?: string[];
  stack?: string[];
  children?: unknown[];
};

type ResumePdfData = {
  title: string;
  role: string;
  location: string;
  email: string;
  website: string;
  github: string;
  linkedin: string;
  experienceSpans: ResumePdfSpan[];
};

export type ResumePdfModel = {
  name: string;
  role: string;
  location: string;
  summary: string;
  skills: string[];
  sideQuests: string[];
  extracurriculars: string[];
  experiences: Array<{
    title: string;
    range: string;
    summary: string;
    highlights: string[];
  }>;
  contact: {
    phone?: string;
    email: string;
    website: string;
    github: string;
    linkedin: string;
  };
};

function extractListItems(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^- /, "").trim())
    .filter(Boolean);
}

function extractParagraph(raw: string): string {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !line.startsWith("#"))
    .filter((line) => !line.startsWith("- "))
    .join(" ")
    .trim();
}

function extractSubsectionHeadings(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace(/^##\s+/, "").replace(/\s+\{#[a-zA-Z0-9_-]+\}\s*$/, "").trim())
    .filter(Boolean);
}

function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
}

function extractLabeledValue(item: string, label: string): string | undefined {
  const normalized = item.trim();
  if (!normalized.toLowerCase().startsWith(`${label.toLowerCase()}:`)) {
    return undefined;
  }
  const value = normalized.slice(label.length + 1).trim();
  return stripMarkdownLinks(value);
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatRangeDate(value: string): string {
  if (value.toLowerCase() === "present") {
    return "Present";
  }

  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) {
    return value;
  }

  const year = match[1];
  const monthIndex = Number(match[2]) - 1;
  const month = MONTH_NAMES[monthIndex];
  if (!month) {
    return value;
  }

  return `${month} ${year}`;
}

function mergeUniqueHighlights(primary: string[], secondary: string[]): string[] {
  const merged: string[] = [];
  const seen = new Set<string>();

  for (const item of [...primary, ...secondary]) {
    const normalized = item.trim();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    merged.push(normalized);
  }

  return merged;
}

export function buildResumePdfModel(cvData: ResumePdfData, markdown: string): ResumePdfModel {
  const blocks = extractBlocks(markdown);
  const summaryRaw = blocks.find(
    (block) => block.type === "markdown" && block.sectionId === "summary"
  );
  const skillsRaw = blocks.find((block) => block.type === "markdown" && block.sectionId === "skills");
  const extracurricularsRaw = blocks.find(
    (block) => block.type === "markdown" && block.sectionId === "extracurriculars"
  );
  const sideQuestsRaw = blocks.find((block) => block.type === "markdown" && block.sectionId === "projects");
  const contactRaw = blocks.find((block) => block.type === "markdown" && block.sectionId === "contact");
  const contactItems = contactRaw && contactRaw.type === "markdown" ? extractListItems(contactRaw.raw) : [];
  const phoneFromMarkdown = contactItems
    .map((item) => extractLabeledValue(item, "Phone"))
    .find(Boolean);

  return {
    name: cvData.title,
    role: cvData.role,
    location: cvData.location,
    summary: summaryRaw && summaryRaw.type === "markdown" ? extractParagraph(summaryRaw.raw) : "",
    skills: skillsRaw && skillsRaw.type === "markdown" ? extractListItems(skillsRaw.raw) : [],
    sideQuests:
      sideQuestsRaw && sideQuestsRaw.type === "markdown"
        ? extractSubsectionHeadings(sideQuestsRaw.raw)
        : [],
    extracurriculars:
      extracurricularsRaw && extracurricularsRaw.type === "markdown"
        ? extractListItems(extracurricularsRaw.raw)
        : [],
    experiences: cvData.experienceSpans.map((span) => {
      const pdfSpecificHighlights = span.pdfHighlights ?? [];
      return {
        title: `${span.role} - ${span.service}`,
        range: `${formatRangeDate(span.start)} - ${formatRangeDate(span.end)}`,
        summary: span.pdfSummary ?? span.summary,
        highlights: mergeUniqueHighlights(pdfSpecificHighlights, span.highlights)
      };
    }),
    contact: {
      phone: phoneFromMarkdown,
      email: cvData.email,
      website: cvData.website,
      github: cvData.github,
      linkedin: cvData.linkedin
    }
  };
}
