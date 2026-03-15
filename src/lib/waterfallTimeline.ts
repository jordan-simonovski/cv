export type TimelineSpanInput = {
  id: string;
  start: string;
  end: string;
};

export type TimelineSpan = {
  id: string;
  offsetMonths: number;
  durationMonths: number;
};

export type WaterfallTimeline = {
  totalMonths: number;
  rangeStartLabel: string;
  rangeEndLabel: string;
  spans: TimelineSpan[];
};

export function getDescendingLeftPercent(
  totalMonths: number,
  offsetMonths: number,
  durationMonths: number
): number {
  const safeTotal = Math.max(totalMonths, 1);
  const consumed = offsetMonths + durationMonths;
  return ((safeTotal - consumed) / safeTotal) * 100;
}

type MonthPoint = {
  index: number;
  label: string;
};

function parseYearMonth(value: string, now: Date): MonthPoint {
  if (value.toLowerCase() === "present") {
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    return {
      index: year * 12 + month,
      label: `${year}-${String(month + 1).padStart(2, "0")}`
    };
  }

  const [yearRaw, monthRaw] = value.split("-");
  const year = Number.parseInt(yearRaw ?? "", 10);
  const month = Number.parseInt(monthRaw ?? "", 10);

  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    throw new Error(`Invalid year-month value: ${value}`);
  }

  return {
    index: year * 12 + (month - 1),
    label: `${year}-${String(month).padStart(2, "0")}`
  };
}

export function createWaterfallTimeline(
  sourceSpans: TimelineSpanInput[],
  now: Date = new Date()
): WaterfallTimeline {
  if (sourceSpans.length === 0) {
    return {
      totalMonths: 1,
      rangeStartLabel: "",
      rangeEndLabel: "",
      spans: []
    };
  }

  const spans = sourceSpans.map((span) => {
    const start = parseYearMonth(span.start, now);
    const endInclusive = parseYearMonth(span.end, now);
    return {
      id: span.id,
      start,
      endLabel: endInclusive.label,
      endInclusiveIndex: endInclusive.index,
      endExclusiveIndex: endInclusive.index + 1
    };
  });

  const rangeStart = Math.min(...spans.map((span) => span.start.index));
  const rangeEndExclusive = Math.max(...spans.map((span) => span.endExclusiveIndex));
  const totalMonths = Math.max(rangeEndExclusive - rangeStart, 1);

  return {
    totalMonths,
    rangeStartLabel: spans
      .map((span) => span.start)
      .reduce((minimum, current) => (current.index < minimum.index ? current : minimum)).label,
    rangeEndLabel: spans
      .reduce((maximum, current) =>
        current.endInclusiveIndex > maximum.endInclusiveIndex ? current : maximum
      )
      .endLabel,
    spans: spans.map((span) => ({
      id: span.id,
      offsetMonths: span.start.index - rangeStart,
      durationMonths: Math.max(span.endExclusiveIndex - span.start.index, 1)
    }))
  };
}
