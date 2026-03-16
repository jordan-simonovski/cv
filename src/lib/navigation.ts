export type NavItem = {
  label: string;
  href: string;
};

type NavLinkLike = {
  getAttribute(name: string): string | null;
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

type MaybeScrollActiveNavArgs<T extends NavLinkLike> = {
  activeHref: string;
  isMobileViewport: boolean;
  links: T[];
  scrollLink: (link: T) => void;
};

export function maybeScrollActiveNavToActiveItem<T extends NavLinkLike>({
  activeHref,
  isMobileViewport,
  links,
  scrollLink
}: MaybeScrollActiveNavArgs<T>): void {
  if (!isMobileViewport || !activeHref.startsWith("#")) {
    return;
  }
  const activeLink = links.find((link) => link.getAttribute("href") === activeHref);
  if (!activeLink) {
    return;
  }
  scrollLink(activeLink);
}
