import { useEffect, useRef, useState } from "react";
import AppIcon from "./AppIcon";
import type { IconName } from "../lib/iconRegistry";
import { maybeScrollActiveNavToActiveItem, type NavItem } from "../lib/navigation";

type Props = {
  items: NavItem[];
};

function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:");
}

function getNavIcon(item: NavItem): IconName {
  if (item.href.includes("github.com")) {
    return "github";
  }
  if (item.href.includes("linkedin.com")) {
    return "linkedin";
  }
  if (item.href.startsWith("#")) {
    const section = item.href.replace(/^#/, "");
    if (section === "summary") {
      return "summary";
    }
    if (section === "skills") {
      return "skills";
    }
    if (section === "experience") {
      return "experience";
    }
    if (section === "leadership-scope") {
      return "leadershipScope";
    }
    if (section === "selected-impact") {
      return "selectedImpact";
    }
    if (section === "projects") {
      return "projects";
    }
    if (section === "contact") {
      return "contact";
    }
  }
  return "externalLink";
}

export default function NavBar({ items }: Props) {
  const [activeHref, setActiveHref] = useState<string>("");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const anchors = items
      .filter((item) => item.href.startsWith("#"))
      .map((item) => item.href.replace(/^#/, ""));

    function refreshActiveAnchor(): void {
      let active = "";
      const presentAnchors = anchors.filter((anchor) => document.getElementById(anchor));

      for (const anchor of presentAnchors) {
        const element = document.getElementById(anchor);
        if (!element) continue;
        const { top } = element.getBoundingClientRect();
        if (top <= 140) {
          active = `#${anchor}`;
        }
      }

      setActiveHref(active);
    }

    refreshActiveAnchor();
    window.addEventListener("scroll", refreshActiveAnchor, { passive: true });
    window.addEventListener("hashchange", refreshActiveAnchor);

    return () => {
      window.removeEventListener("scroll", refreshActiveAnchor);
      window.removeEventListener("hashchange", refreshActiveAnchor);
    };
  }, [items]);

  useEffect(() => {
    const navShell = navRef.current;
    if (!navShell) {
      return;
    }
    const links = Array.from(navShell.querySelectorAll<HTMLAnchorElement>(".nav-link"));
    maybeScrollActiveNavToActiveItem({
      activeHref,
      isMobileViewport: window.matchMedia("(max-width: 980px)").matches,
      links,
      scrollLink: (link) => {
        link.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
      }
    });
  }, [activeHref]);

  return (
    <nav ref={navRef} className="nav-shell" aria-label="Resume navigation">
      <p className="nav-query">query: section where visible=true</p>
      <ul className="nav-list">
        {items.map((item) => (
          <li key={`${item.label}-${item.href}`} className="nav-item">
            <a
              className={`nav-link ${activeHref === item.href ? "is-active" : ""}`}
              href={item.href}
              aria-current={item.href.startsWith("#") && activeHref === item.href ? "location" : undefined}
              target={isExternal(item.href) ? "_blank" : undefined}
              rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
            >
              <span className="nav-link-inner">
                <AppIcon name={getNavIcon(item)} className="nav-icon" />
                <span>{item.label}</span>
                {isExternal(item.href) ? (
                  <>
                    <span className="sr-only">(opens in new tab)</span>
                    <AppIcon name="externalLink" className="nav-external-icon" />
                  </>
                ) : null}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
