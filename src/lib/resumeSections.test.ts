import { describe, expect, it } from "vitest";

import { buildSections, formatRange, parseRoleHeading } from "./resumeSections";

describe("resume sections", () => {
  it("formats month ranges", () => {
    expect(formatRange("2026-06 to Present")).toBe("Jun 2026 – Present");
    expect(formatRange("2017")).toBe("2017");
  });

  it("parses role headings and flags the current role", () => {
    expect(parseRoleHeading("Staff Software Engineer - Atlassian (2020-05 to 2026-05)")).toEqual({
      role: "Staff Software Engineer",
      company: "Atlassian",
      range: "May 2020 – May 2026",
      current: false
    });
    expect(parseRoleHeading("Senior Software Engineer - ClickHouse (2026-06 to Present)").current).toBe(true);
  });

  it("splits sections, experience entries, and contact items", () => {
    const sections = buildSections(
      [
        "# Profile {#summary}",
        "Hello.",
        "# Experience {#experience}",
        "## Engineer - Acme (2019-01 to Present)",
        "- Did things.",
        "<details>",
        "  <summary>Expand full impact</summary>",
        "",
        "- One",
        "- Two",
        "",
        "</details>",
        "# Contact {#contact}",
        "- Email: [a@b.co](mailto:a@b.co)"
      ].join("\n")
    );

    expect(sections.map((section) => section.id)).toEqual(["summary", "experience", "contact"]);
    expect(sections[0].html).not.toContain("<h2");
    expect(sections[1].entries?.[0]).toMatchObject({ company: "Acme", current: true });
    expect(sections[1].entries?.[0].html).toContain("Full record <span class=\"count\">2 items</span>");
    expect(sections[2].items).toEqual([{ label: "Email", html: '<a href="mailto:a@b.co">a@b.co</a>' }]);
  });
});
