import { useMemo, useState } from "react";
import AppIcon from "./AppIcon";
import { createWaterfallTimeline, getDescendingLeftPercent } from "../lib/waterfallTimeline";
import { splitHighlightIntoSegments } from "../lib/highlightChips";

export type ExperienceChildSpan = {
  id: string;
  name: string;
  status: "ok" | "warn" | "critical";
  startOffset: number;
  endOffset: number;
  detail: string;
};

export type ExperienceSpan = {
  id: string;
  service: string;
  role: string;
  start: string;
  end: string;
  status: "ok" | "warn" | "critical";
  summary: string;
  highlights: string[];
  stack: string[];
  children: ExperienceChildSpan[];
};

type Props = {
  spans: ExperienceSpan[];
};

export default function ExperienceTraceWaterfall({ spans }: Props) {
  const [expandedSpanId, setExpandedSpanId] = useState<string>(spans[0]?.id ?? "");
  const orderedSpans = useMemo(
    () =>
      [...spans].sort((left, right) => {
        const leftKey = left.end.toLowerCase() === "present" ? "9999-12" : left.start;
        const rightKey = right.end.toLowerCase() === "present" ? "9999-12" : right.start;
        if (leftKey === rightKey) {
          return left.start < right.start ? 1 : -1;
        }
        return leftKey < rightKey ? 1 : -1;
      }),
    [spans]
  );
  const timeline = useMemo(
    () =>
      createWaterfallTimeline(
        spans.map((span) => ({
          id: span.id,
          start: span.start,
          end: span.end
        }))
      ),
    [spans]
  );

  if (spans.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="waterfall-panel" aria-label="Experience Trace Waterfall">
      <header className="panel-header">
        <h2>Experience Timeline</h2>
        <p>
          {timeline.rangeStartLabel} to {timeline.rangeEndLabel} ({timeline.totalMonths} months)
        </p>
      </header>

      <div className="waterfall-rows">
        {orderedSpans.map((span) => {
          const geometry = timeline.spans.find((entry) => entry.id === span.id);
          if (!geometry) {
            return null;
          }
          const leftPercent = getDescendingLeftPercent(
            timeline.totalMonths,
            geometry.offsetMonths,
            geometry.durationMonths
          );
          const widthPercent = Math.max((geometry.durationMonths / timeline.totalMonths) * 100, 9);
          const isExpanded = expandedSpanId === span.id;
          const previewHighlights = span.highlights.slice(0, 2);

          return (
            <article key={span.id} className={`waterfall-row ${isExpanded ? "is-expanded" : ""}`}>
              <div className="waterfall-row-shell">
                <aside className="waterfall-y-label">
                  <strong>{span.service}</strong>
                  <small>{span.start} - {span.end}</small>
                </aside>
                <div className="waterfall-track">
                  <button
                    type="button"
                    className="waterfall-main-span"
                    data-status={span.status}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`
                    }}
                    onClick={() => setExpandedSpanId((current) => (current === span.id ? "" : span.id))}
                    aria-expanded={isExpanded}
                    aria-controls={`experience-details-${span.id}`}
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} details for ${span.service}`}
                  >
                    <span className="waterfall-chevron" aria-hidden="true">
                      <AppIcon name={isExpanded ? "chevronDown" : "chevronRight"} />
                    </span>
                    <span className="waterfall-role">{span.role}</span>
                    <span className="waterfall-service">{span.service}</span>
                    <span className="waterfall-range">
                      {span.start} - {span.end}
                    </span>
                  </button>
                </div>
              </div>

              {!isExpanded ? (
                <div className="waterfall-highlight-preview">
                  <h3 className="waterfall-subheading">Top impact highlights</h3>
                  <ul className="waterfall-highlight-chips waterfall-highlight-chips-preview">
                    {previewHighlights.map((highlight) => (
                      <li key={highlight} className="waterfall-highlight-chip" data-status={span.status}>
                        <span className="waterfall-highlight-icon" aria-hidden="true">
                          <AppIcon
                            name={
                              span.status === "ok"
                                ? "statusOk"
                                : span.status === "warn"
                                  ? "statusWarn"
                                  : "statusCritical"
                            }
                          />
                        </span>
                        <span className="waterfall-highlight-text">
                          {splitHighlightIntoSegments(highlight).map((segment, index) => (
                            <span
                              key={`${highlight}-${index}-${segment.text}`}
                              className={segment.emphasized ? "is-emphasized" : undefined}
                            >
                              {segment.text}
                            </span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {isExpanded ? (
                <div
                  id={`experience-details-${span.id}`}
                  className="waterfall-details"
                  role="region"
                  aria-label={`${span.service} role details`}
                >
                  <h3 className="waterfall-subheading">Role summary</h3>
                  <p>{span.summary}</p>
                  <ul className="waterfall-highlight-chips">
                    {span.highlights.map((highlight) => (
                      <li key={highlight} className="waterfall-highlight-chip" data-status={span.status}>
                        <span className="waterfall-highlight-icon" aria-hidden="true">
                          <AppIcon
                            name={
                              span.status === "ok"
                                ? "statusOk"
                                : span.status === "warn"
                                  ? "statusWarn"
                                  : "statusCritical"
                            }
                          />
                        </span>
                        <span className="waterfall-highlight-text">
                          {splitHighlightIntoSegments(highlight).map((segment, index) => (
                            <span
                              key={`${highlight}-${index}-${segment.text}`}
                              className={segment.emphasized ? "is-emphasized" : undefined}
                            >
                              {segment.text}
                            </span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="waterfall-stack">
                    {span.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <div className="waterfall-child-spans">
                    {span.children.map((child) => (
                      <article key={child.id} className="waterfall-child" data-status={child.status}>
                        <header>
                          <strong>{child.name}</strong>
                          <small>
                            {child.startOffset}%{" -> "}{child.endOffset}%
                          </small>
                        </header>
                        <p>{child.detail}</p>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
