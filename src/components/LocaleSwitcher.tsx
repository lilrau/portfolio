"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import GlassSurface from "./GlassSurface";
import { locales, type Locale } from "../i18n/config";

// The section closest to the top of the viewport, so switching language keeps
// the reader where they were even if they scrolled without using an anchor.
function currentSectionHash() {
  if (window.location.hash) return window.location.hash;
  const probe = window.innerHeight * 0.35;
  let current = "";
  document.querySelectorAll<HTMLElement>("main section[id]").forEach((section) => {
    if (section.getBoundingClientRect().top <= probe) current = section.id;
  });
  return current && current !== "top" ? `#${current}` : "";
}

export default function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const go = (event: MouseEvent<HTMLAnchorElement>, target: Locale) => {
    if (target === locale || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    // Full navigation, not router.push: each locale has its own root layout, and a
    // client transition would re-render <html> (and its inline script) on the client.
    window.location.assign(`/${target}${currentSectionHash()}`);
  };

  return (
    <GlassSurface
      as="nav"
      variant="pill"
      aria-label={label}
      className="inline-flex h-10 items-center gap-0.5 px-1.5 eyebrow"
    >
      {locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={`/${l}`}
            hrefLang={l}
            lang={l}
            aria-current={active ? "page" : undefined}
            onClick={(e) => go(e, l)}
            className={`inline-flex h-8 min-w-10 items-center justify-center rounded-full px-2 transition-colors duration-[var(--duration-normal)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none ${
              active ? "bg-ink text-ink-inverse" : "text-ink-muted hover:text-ink"
            }`}
          >
            {l}
          </Link>
        );
      })}
    </GlassSurface>
  );
}
