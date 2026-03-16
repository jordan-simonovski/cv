import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowUpRightFromSquare,
  faBriefcase,
  faCalendarDays,
  faCheckCircle,
  faChevronDown,
  faChevronRight,
  faClock,
  faCodeBranch,
  faDiagramProject,
  faDownload,
  faEnvelope,
  faGlobe,
  faHouseSignal,
  faLocationDot,
  faSatelliteDish,
  faScrewdriverWrench,
  faTriangleExclamation,
  faUserCheck,
  faUserClock,
  faWaveSquare
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const iconRegistry = {
  summary: faHouseSignal,
  skills: faScrewdriverWrench,
  experience: faWaveSquare,
  leadershipScope: faUserCheck,
  selectedImpact: faCheckCircle,
  projects: faDiagramProject,
  contact: faEnvelope,
  github: faGithub,
  linkedin: faLinkedin,
  externalLink: faArrowUpRightFromSquare,
  email: faEnvelope,
  website: faGlobe,
  location: faLocationDot,
  role: faBriefcase,
  timezone: faClock,
  workMode: faSatelliteDish,
  responseSla: faCalendarDays,
  updatedAt: faCalendarDays,
  availabilityOpen: faUserCheck,
  availabilityClosed: faUserClock,
  chevronDown: faChevronDown,
  chevronRight: faChevronRight,
  statusOk: faCheckCircle,
  statusWarn: faTriangleExclamation,
  statusCritical: faTriangleExclamation,
  timeline: faCodeBranch,
  download: faDownload
} as const satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof iconRegistry;

export function getIconByName(name: string): IconDefinition {
  const icon = iconRegistry[name as IconName];
  if (!icon) {
    throw new Error(`Unknown icon name: ${name}`);
  }
  return icon;
}
