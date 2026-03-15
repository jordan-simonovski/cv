import { describe, expect, it } from "vitest";

import { buildProjectEntries } from "./projectEntries";

describe("buildProjectEntries", () => {
  it("renders markdown links as anchor tags", () => {
    const entries = buildProjectEntries([
      "[Repository](https://github.com/jordan-simonovski): Built workload rightsizing recommendations."
    ]);

    expect(entries[0]).toContain('<a href="https://github.com/jordan-simonovski">Repository</a>');
    expect(entries[0]).toContain("Built workload rightsizing recommendations.");
  });
});
