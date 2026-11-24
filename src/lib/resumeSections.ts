import { renderInlineMarkdown, renderMarkdown } from "./markdown";

export type ExperienceEntry = {
  role: string;
  company: string;
  range: string;
  current: boolean;
  html: string;
};

export type ResumeSection = {
  id: string;
  title: string;
  raw: string;
  html: string;
  entries?: ExperienceEntry[];
  items?: Array<{ label: string; html: string }>;
};

const SECTION_HEADING = /^#\s+(.+?)\s+\{#([a-zA-Z0-9_-]+)\}\s*$/;
const ROLE_HEADING = /^(.+?)\s+-\s+(.+?)\s+\((.+)\)$/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatRange(range: string): string {
  return range
    .replace(/(\d{4})-(\d{2})/g, (match, year: string, month: string) => {
      const name = MONTHS[Number(month) - 1];
      return name ? `${name} ${year}` : match;
    })
    .replace(/\s+to\s+/g, " – ");
}

export function parseRoleHeading(heading: string): Omit<ExperienceEntry, "html"> {
  const match = ROLE_HEADING.exec(heading.trim());
  if (!match) {
    return { role: heading.trim(), company: "", range: "", current: false };
  }
  const [, role, company, range] = match;
  return { role, company, range: formatRange(range), current: /present/i.test(range) };
}

function labelFullRecord(markdown: string): string {
  return markdown.replace(/<summary>[^<]*<\/summary>([\s\S]*?)<\/details>/g, (_match, inner: string) => {
    const count = inner.split("\n").filter((line) => line.trim().startsWith("- ")).length;
    return `<summary>Full record <span class="count">${count} items</span></summary>${inner}</details>`;
  });
}

function splitByHeading(markdown: string, pattern: RegExp): Array<{ heading: string; body: string }> {
  const chunks: Array<{ heading: string; body: string }> = [];
  for (const line of markdown.split("\n")) {
    if (pattern.test(line)) {
      chunks.push({ heading: line, body: "" });
    } else if (chunks.length > 0) {
      chunks[chunks.length - 1].body += `${line}\n`;
    }
  }
  return chunks;
}

export function buildSections(markdown: string): ResumeSection[] {
  return splitByHeading(markdown, SECTION_HEADING).map(({ heading, body }) => {
    const [, title, id] = SECTION_HEADING.exec(heading) ?? [];
    const section: ResumeSection = { id, title, raw: body, html: renderMarkdown(body) };

    if (id === "experience") {
      section.entries = splitByHeading(body, /^##\s+/).map((chunk) => ({
        ...parseRoleHeading(chunk.heading.replace(/^##\s+/, "")),
        html: renderMarkdown(labelFullRecord(chunk.body))
      }));
    }

    if (id === "contact") {
      section.items = body
        .split("\n")
        .filter((line) => line.trim().startsWith("- "))
        .map((line) => {
          const text = line.trim().replace(/^- /, "");
          const split = text.indexOf(": ");
          return split === -1
            ? { label: "", html: renderInlineMarkdown(text) }
            : { label: text.slice(0, split), html: renderInlineMarkdown(text.slice(split + 2)) };
        });
    }

    return section;
  });
}
