import { describe, expect, it } from "vitest";

import { createWaterfallTimeline, getDescendingLeftPercent } from "./waterfallTimeline.js";

describe("createWaterfallTimeline", () => {
  it("computes absolute offsets and durations across full range", () => {
    const timeline = createWaterfallTimeline(
      [
        { id: "sre", start: "2019-06", end: "2021-12" },
        { id: "principal", start: "2022-01", end: "Present" }
      ],
      new Date(Date.UTC(2026, 2, 10))
    );

    expect(timeline.totalMonths).toBe(82);
    expect(timeline.rangeStartLabel).toBe("2019-06");
    expect(timeline.rangeEndLabel).toBe("2026-03");

    const sre = timeline.spans.find((span) => span.id === "sre");
    const principal = timeline.spans.find((span) => span.id === "principal");

    expect(sre).toMatchObject({ offsetMonths: 0, durationMonths: 31 });
    expect(principal).toMatchObject({ offsetMonths: 31, durationMonths: 51 });
  });

  it("supports newest-first ordering without changing geometry", () => {
    const source = [
      { id: "older", start: "2019-06", end: "2021-12" },
      { id: "newer", start: "2022-01", end: "Present" }
    ];
    const timeline = createWaterfallTimeline(source, new Date(Date.UTC(2026, 2, 10)));
    const ordered = [...source].sort((left, right) => {
      const leftKey = left.end.toLowerCase() === "present" ? "9999-12" : left.start;
      const rightKey = right.end.toLowerCase() === "present" ? "9999-12" : right.start;
      return leftKey < rightKey ? 1 : -1;
    });

    expect(ordered.map((item) => item.id)).toEqual(["newer", "older"]);
    expect(timeline.spans.find((span) => span.id === "newer")).toMatchObject({ offsetMonths: 31 });
    expect(timeline.spans.find((span) => span.id === "older")).toMatchObject({ offsetMonths: 0 });
  });

  it("computes descending left positions for newest-left axis", () => {
    expect(getDescendingLeftPercent(82, 31, 51)).toBeCloseTo(0, 5);
    expect(getDescendingLeftPercent(82, 0, 31)).toBeCloseTo((51 / 82) * 100, 5);
  });
});
