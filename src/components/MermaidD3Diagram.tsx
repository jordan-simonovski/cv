import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import mermaid from "mermaid";

type Props = {
  chart: string;
  title?: string;
};

let initialized = false;

function idForChart(chart: string): string {
  return `mermaid-${chart.length}-${Math.abs(
    chart.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  )}`;
}

export default function MermaidD3Diagram({ chart, title = "Architecture Diagram" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");
  const renderId = useMemo(() => idForChart(chart), [chart]);

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "dark"
      });
      initialized = true;
    }

    let cancelled = false;

    async function renderDiagram() {
      try {
        const { svg } = await mermaid.render(renderId, chart);
        if (cancelled || !containerRef.current) {
          return;
        }

        containerRef.current.innerHTML = svg;
        const svgEl = containerRef.current.querySelector("svg");
        const groupEl = containerRef.current.querySelector("svg g");

        if (svgEl && groupEl) {
          const svgSelection = d3.select(svgEl);
          const groupSelection = d3.select(groupEl);
          const isSmallScreen = window.matchMedia("(max-width: 760px)").matches;
          const bounds = svgEl.getBBox();

          if (!svgEl.getAttribute("viewBox") && bounds.width && bounds.height) {
            svgSelection.attr("viewBox", `0 0 ${Math.ceil(bounds.width)} ${Math.ceil(bounds.height)}`);
          }

          svgSelection.attr("preserveAspectRatio", "xMinYMin meet");

          svgSelection.attr("width", "100%").attr("height", "auto");

          if (!isSmallScreen) {
            svgSelection.call(
              d3
                .zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.5, 2.5])
                .on("zoom", (event) => {
                  groupSelection.attr("transform", event.transform.toString());
                })
            );
          }
        }

        setError("");
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not render mermaid diagram.");
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [chart, renderId]);

  if (error) {
    return (
      <div className="diagram-error" role="alert">
        <p>Diagram failed to render: {error}</p>
        <pre>{chart}</pre>
      </div>
    );
  }

  return (
    <section className="diagram-card" aria-label={title}>
      <header className="diagram-card-header">
        <h3>{title}</h3>
        <p>Drag to pan, scroll to zoom.</p>
      </header>
      <div className="diagram-canvas" ref={containerRef} />
      <noscript>
        <pre>{chart}</pre>
      </noscript>
    </section>
  );
}
