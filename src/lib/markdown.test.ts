import { describe, expect, it } from "vitest";

import { extractBlocks, renderInlineMarkdown } from "./markdown.js";

describe("extractBlocks", () => {
  it("splits markdown into html and code blocks", () => {
    const source = [
      "# Heading",
      "",
      "Some text.",
      "",
      "```js",
      "console.log('hello');",
      "```",
      "",
      "## Second",
      "",
      "```mermaid",
      "graph TD",
      "A-->B",
      "```"
    ].join("\n");

    const blocks = extractBlocks(source);
    expect(blocks).toHaveLength(4);
    expect(blocks[0]?.type).toBe("markdown");
    expect(blocks[1]).toMatchObject({ type: "code", language: "js" });
    expect(blocks[2]?.type).toBe("markdown");
    expect(blocks[3]).toMatchObject({ type: "diagram", language: "mermaid" });
  });

  it("handles content with no fences", () => {
    const blocks = extractBlocks("## Only markdown");
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({ type: "markdown" });
  });

  it("preserves heading anchors for nav links", () => {
    const blocks = extractBlocks("# Summary {#summary}");
    expect(blocks[0]).toMatchObject({ type: "markdown" });
    if (blocks[0]?.type === "markdown") {
      expect(blocks[0].html).toContain('id="summary"');
    }
  });

  it("renders nested headings and markdown links/lists correctly", () => {
    const source = [
      "# Experience {#experience}",
      "",
      "## Principal Platform Engineer - ExampleCorp",
      "",
      "- Reduced MTTR by 42%",
      "- GitHub: [github.com/jordan-simonovski](https://github.com/jordan-simonovski)"
    ].join("\n");

    const blocks = extractBlocks(source);
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({ type: "markdown" });

    if (blocks[0]?.type === "markdown") {
      expect(blocks[0].html).toContain('<h2 id="experience">Experience</h2>');
      expect(blocks[0].html).toContain("<h3>Principal Platform Engineer - ExampleCorp</h3>");
      expect(blocks[0].html).toContain("<ul>");
      expect(blocks[0].html).toContain('href="https://github.com/jordan-simonovski"');
    }
  });

  it("tracks section metadata for markdown and fenced blocks", () => {
    const source = [
      "# Summary {#summary}",
      "",
      "Intro",
      "",
      "```yaml",
      "key: value",
      "```",
      "",
      "# Projects {#projects}",
      "",
      "- Item"
    ].join("\n");

    const blocks = extractBlocks(source);
    expect(blocks).toHaveLength(3);
    expect(blocks[0]).toMatchObject({ type: "markdown", sectionId: "summary" });
    expect(blocks[1]).toMatchObject({ type: "code", sectionId: "summary" });
    expect(blocks[2]).toMatchObject({ type: "markdown", sectionId: "projects" });
  });

  it("renders inline markdown for links", () => {
    const html = renderInlineMarkdown("[GitHub](https://github.com/jordan-simonovski)");
    expect(html).toContain('href="https://github.com/jordan-simonovski"');
    expect(html).toContain(">GitHub</a>");
  });
});
