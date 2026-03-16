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

describe("mobile navigation styles", () => {
  it("keeps the nav container sticky at the top on mobile", () => {
    expect(themeCss).toContain("@media (max-width: 980px)");
    expect(themeCss).toMatch(/\.console-nav\s*\{[\s\S]*?position:\s*sticky;[\s\S]*?\}/);
    expect(themeCss).toMatch(
      /@media \(max-width: 980px\)\s*\{[\s\S]*?\.console-nav\s*\{[\s\S]*?top:\s*0;[\s\S]*?\}/
    );
  });
});
