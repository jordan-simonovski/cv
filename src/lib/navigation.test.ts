import { describe, expect, it } from "vitest";

import { maybeScrollActiveNavToActiveItem, validateNavigation } from "./navigation";

describe("validateNavigation", () => {
  it("accepts anchor links and https links", () => {
    expect(() =>
      validateNavigation([
        { label: "Summary", href: "#summary" },
        { label: "GitHub", href: "https://github.com/jordan-simonovski" }
      ])
    ).not.toThrow();
  });

  it("rejects unsafe links", () => {
    expect(() =>
      validateNavigation([{ label: "Bad", href: "javascript:alert(1)" }])
    ).toThrow(/Unsupported nav link/);
  });
});

describe("maybeScrollActiveNavToActiveItem", () => {
  it("scrolls the active anchor link on mobile", () => {
    const links = [
      { getAttribute: (name: string) => (name === "href" ? "#summary" : null) },
      { getAttribute: (name: string) => (name === "href" ? "#skills" : null) }
    ];
    const scrolled: string[] = [];

    maybeScrollActiveNavToActiveItem({
      activeHref: "#skills",
      isMobileViewport: true,
      links,
      scrollLink: (link) => {
        scrolled.push(link.getAttribute("href") ?? "");
      }
    });

    expect(scrolled).toEqual(["#skills"]);
  });

  it("does not scroll for desktop viewports", () => {
    const links = [{ getAttribute: (name: string) => (name === "href" ? "#summary" : null) }];
    let calls = 0;

    maybeScrollActiveNavToActiveItem({
      activeHref: "#summary",
      isMobileViewport: false,
      links,
      scrollLink: () => {
        calls += 1;
      }
    });

    expect(calls).toBe(0);
  });
});
