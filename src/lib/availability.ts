import type { IconName } from "./iconRegistry";

type AvailabilityViewModel = {
  badgeLabel: string;
  srLabel: string;
  icon: IconName;
};

export function getAvailabilityViewModel(openToWork: boolean): AvailabilityViewModel {
  if (openToWork) {
    return {
      badgeLabel: "Open to work",
      srLabel: "Open to work status: currently open to new opportunities",
      icon: "availabilityOpen"
    };
  }

  return {
    badgeLabel: "Not open to work",
    srLabel: "Open to work status: currently not open to new opportunities",
    icon: "availabilityClosed"
  };
}
