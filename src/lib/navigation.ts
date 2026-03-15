export type NavItem = {
  label: string;
  href: string;
};

const SAFE_EXTERNAL_PREFIXES = ["https://", "http://", "mailto:"];

export function validateNavigation(items: NavItem[]): NavItem[] {
  for (const item of items) {
    const isAnchor = item.href.startsWith("#");
    const isExternal = SAFE_EXTERNAL_PREFIXES.some((prefix) => item.href.startsWith(prefix));
    if (!isAnchor && !isExternal) {
      throw new Error(`Unsupported nav link: ${item.href}`);
    }
  }
  return items;
}
