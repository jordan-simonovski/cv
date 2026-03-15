import { marked } from "marked";

type SectionContext = {
  sectionId?: string;
  sectionTitle?: string;
};

export type MarkdownBlock =
  | ({ type: "markdown"; html: string; raw: string } & SectionContext)
  | ({ type: "code"; language: string; code: string } & SectionContext)
  | ({ type: "diagram"; language: "mermaid"; code: string } & SectionContext);

const FENCE_REGEX = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
const HEADING_ID_SUFFIX = /\s\{#([a-zA-Z0-9_-]+)\}\s*$/;
const TOP_LEVEL_SECTION_HEADING = /^#\s+(.+?)\s+\{#([a-zA-Z0-9_-]+)\}\s*$/;

marked.setOptions({
  gfm: true,
  breaks: false
});

marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const inline = this.parser.parseInline(tokens);
      const idMatch = inline.match(HEADING_ID_SUFFIX);
      const headingHtml = idMatch ? inline.replace(HEADING_ID_SUFFIX, "") : inline;
      const headingId = idMatch?.[1];
      const idAttr = headingId ? ` id="${headingId}"` : "";
      const normalizedDepth = Math.min(depth + 1, 6);
      return `<h${normalizedDepth}${idAttr}>${headingHtml}</h${normalizedDepth}>`;
    }
  }
});

function renderMarkdown(markdown: string): string {
  return marked.parse(markdown) as string;
}

export function renderInlineMarkdown(markdown: string): string {
  return marked.parseInline(markdown) as string;
}

function splitMarkdownBySections(
  markdown: string,
  activeSection: SectionContext
): { segments: Array<{ markdown: string; section: SectionContext }>; lastSection: SectionContext } {
  const lines = markdown.split("\n");
  const segments: Array<{ markdown: string; section: SectionContext }> = [];

  let section = { ...activeSection };
  let buffer: string[] = [];

  function flushBuffer(): void {
    const content = buffer.join("\n").trim();
    if (content) {
      segments.push({ markdown: content, section: { ...section } });
    }
    buffer = [];
  }

  for (const line of lines) {
    const headingMatch = line.match(TOP_LEVEL_SECTION_HEADING);
    if (headingMatch) {
      flushBuffer();
      section = { sectionTitle: headingMatch[1].trim(), sectionId: headingMatch[2] };
    }
    buffer.push(line);
  }

  flushBuffer();
  return { segments, lastSection: section };
}

export function extractBlocks(input: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let cursor = 0;
  let activeSection: SectionContext = {};

  for (const match of input.matchAll(FENCE_REGEX)) {
    const index = match.index ?? 0;
    const [raw, rawLanguage, rawCode] = match;
    const language = (rawLanguage || "text").trim().toLowerCase();
    const code = rawCode.replace(/\n$/, "");

    if (index > cursor) {
      const markdownSlice = input.slice(cursor, index).trim();
      if (markdownSlice) {
        const { segments, lastSection } = splitMarkdownBySections(markdownSlice, activeSection);
        for (const segment of segments) {
          blocks.push({
            type: "markdown",
            raw: segment.markdown,
            html: renderMarkdown(segment.markdown),
            ...segment.section
          });
        }
        activeSection = lastSection;
      }
    }

    if (language === "mermaid") {
      blocks.push({ type: "diagram", language: "mermaid", code, ...activeSection });
    } else {
      blocks.push({ type: "code", language: language || "text", code, ...activeSection });
    }

    cursor = index + raw.length;
  }

  const trailing = input.slice(cursor).trim();
  if (trailing) {
    const { segments } = splitMarkdownBySections(trailing, activeSection);
    for (const segment of segments) {
      blocks.push({
        type: "markdown",
        raw: segment.markdown,
        html: renderMarkdown(segment.markdown),
        ...segment.section
      });
    }
  }

  if (blocks.length === 0) {
    return [{ type: "markdown", raw: input, html: renderMarkdown(input) }];
  }

  return blocks;
}
