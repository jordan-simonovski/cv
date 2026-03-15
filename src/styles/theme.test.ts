import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const themeCssPath = resolve(process.cwd(), "src/styles/theme.css");
const themeCss = readFileSync(themeCssPath, "utf8");

describe("telemetry background styles", () => {
  it("defines full-page telemetry background layers", () => {
    expect(themeCss).toContain(".telemetry-bg");
    expect(themeCss).toContain(".telemetry-traces");
    expect(themeCss).toContain(".telemetry-sparklines");
    expect(themeCss).toContain(".telemetry-vignette");
  });

  it("disables telemetry animations for reduced motion users", () => {
    expect(themeCss).toContain("@media (prefers-reduced-motion: reduce)");
    expect(themeCss).toContain(".telemetry-traces");
    expect(themeCss).toContain(".telemetry-sparklines");
    expect(themeCss).toContain("animation: none");
  });
});
