import { describe, expect, it } from "vitest";

import { getIconByName } from "./iconRegistry.js";

describe("getIconByName", () => {
  it("returns icon definitions for supported names", () => {
    expect(getIconByName("location")).toBeTruthy();
    expect(getIconByName("github")).toBeTruthy();
    expect(getIconByName("availabilityOpen")).toBeTruthy();
  });

  it("throws for unsupported icon names", () => {
    expect(() => getIconByName("nonexistent")).toThrow("Unknown icon name: nonexistent");
  });
});
