export type HighlightSegment = {
  text: string;
  emphasized: boolean;
};

const EMPHASIS_PATTERN =
  /\b(?:OpenTelemetry|Tempo|ClickHouse|Grafana|Mimir|Prometheus|TraceQL|PromQL|SQL|SPL|MTTR|DX)\b|\b\d+(?:\.\d+)?%[+]?|\b\d+(?:\.\d+)?\s?(?:TB|GB|k|m)(?:\/day)?\b/g;

export function splitHighlightIntoSegments(highlight: string): HighlightSegment[] {
  const segments: HighlightSegment[] = [];
  let lastIndex = 0;

  for (const match of highlight.matchAll(EMPHASIS_PATTERN)) {
    const start = match.index ?? 0;
    const text = match[0];
    if (start > lastIndex) {
      segments.push({ text: highlight.slice(lastIndex, start), emphasized: false });
    }
    segments.push({ text, emphasized: true });
    lastIndex = start + text.length;
  }

  if (lastIndex < highlight.length) {
    segments.push({ text: highlight.slice(lastIndex), emphasized: false });
  }

  return segments.length > 0 ? segments : [{ text: highlight, emphasized: false }];
}
