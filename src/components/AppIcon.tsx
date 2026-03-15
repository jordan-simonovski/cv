import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconName } from "../lib/iconRegistry";
import { getIconByName } from "../lib/iconRegistry";

type Props = {
  name: IconName;
  className?: string;
  label?: string;
};

export default function AppIcon({ name, className, label }: Props) {
  return (
    <FontAwesomeIcon
      icon={getIconByName(name)}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    />
  );
}
