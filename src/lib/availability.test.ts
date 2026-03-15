import { describe, expect, it } from "vitest";

import { getAvailabilityViewModel } from "./availability.js";

describe("getAvailabilityViewModel", () => {
  it("returns open-to-work messaging for true", () => {
    expect(getAvailabilityViewModel(true)).toMatchObject({
      badgeLabel: "Open to work",
      srLabel: "Open to work status: currently open to new opportunities",
      icon: "availabilityOpen"
    });
  });

  it("returns closed messaging for false", () => {
    expect(getAvailabilityViewModel(false)).toMatchObject({
      badgeLabel: "Not open to work",
      srLabel: "Open to work status: currently not open to new opportunities",
      icon: "availabilityClosed"
    });
  });
});
