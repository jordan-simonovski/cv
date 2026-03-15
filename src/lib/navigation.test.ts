import { describe, expect, it } from "vitest";

import { validateNavigation } from "./navigation";

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
