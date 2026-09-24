"use client";

import { useSyncExternalStore } from "react";

// The hero waits for the preloader. <html data-intro> is "pending" while it
// plays, then "done" (or "skip" when it never plays).
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-intro"] });
  return () => observer.disconnect();
};
const ready = () => document.documentElement.getAttribute("data-intro") !== "pending";

export const useIntroReady = () => useSyncExternalStore(subscribe, ready, () => false);

export const finishIntro = () => document.documentElement.setAttribute("data-intro", "done");
