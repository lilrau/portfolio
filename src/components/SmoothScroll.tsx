"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/*
 * Inertial scrolling on desktop with a fine pointer. Phones and
 * prefers-reduced-motion keep native scrolling. Lenis drives window scroll,
 * so framer-motion's useScroll and IntersectionObserver keep working as-is.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const qualifies = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let lenis: Lenis | null = null;
    let overlayObserver: MutationObserver | null = null;

    // In-page anchors to real ids glide with Lenis; anything else falls
    // through to the browser.
    const onClick = (event: MouseEvent) => {
      if (!lenis || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = decodeURIComponent(link.hash.slice(1));
      const target = id === "top" ? document.body : document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      // Lenis honours the sections' scroll-margin-top, which clears the nav.
      lenis.scrollTo(id === "top" ? 0 : target);
      history.pushState(null, "", `#${id}`);
    };

    const start = () => {
      if (lenis) return;
      lenis = new Lenis({ autoRaf: true, lerp: 0.09, wheelMultiplier: 0.9 });
      // Overlays (mobile sheet) flag <html data-overlay>; freeze while open.
      overlayObserver = new MutationObserver(() => {
        if (document.documentElement.dataset.overlay) lenis?.stop();
        else lenis?.start();
      });
      overlayObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-overlay"] });
    };
    const stop = () => {
      overlayObserver?.disconnect();
      overlayObserver = null;
      lenis?.destroy();
      lenis = null;
    };
    const sync = () => (qualifies.matches ? start() : stop());

    sync();
    qualifies.addEventListener("change", sync);
    document.addEventListener("click", onClick);
    return () => {
      qualifies.removeEventListener("change", sync);
      document.removeEventListener("click", onClick);
      stop();
    };
  }, []);

  return null;
}
