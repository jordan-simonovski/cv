import { describe, expect, it } from "vitest";

import { splitHighlightIntoSegments } from "./highlightChips.js";

describe("splitHighlightIntoSegments", () => {
  it("marks observability and impact tokens for visual emphasis", () => {
    const segments = splitHighlightIntoSegments(
      "Improved Tempo query performance 30%+ with minimal impacts on cost."
    );

    expect(segments).toEqual([
      { text: "Improved ", emphasized: false },
      { text: "Tempo", emphasized: true },
      { text: " query performance ", emphasized: false },
      { text: "30%+", emphasized: true },
      { text: " with minimal impacts on cost.", emphasized: false }
    ]);
  });

  it("returns plain segment when no emphasis keywords are present", () => {
    const segments = splitHighlightIntoSegments("Built internal tooling for team workflows.");
    expect(segments).toEqual([{ text: "Built internal tooling for team workflows.", emphasized: false }]);
  });
});
