"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { INTRO_STORAGE_KEY } from "../lib/theme";
import { finishIntro } from "../lib/intro";
import { EASE_IN_OUT_EXPO } from "../lib/motion";

const HOLD_MS = 900; // A brief signature, then an 800ms dissolve into the hero.

// Keep the sim hidden until the signature dissolves into the hero.
function revealFluid() {
  document.documentElement.setAttribute("data-fluid", "on");
}

export default function Preloader({ firstName, lastName, skipLabel }: { firstName: string; lastName: string; skipLabel: string }) {
  // Rendered on the server so there is no flash of the hero; CSS hides it
  // unless the head script marked the intro as pending.
  const [visible, setVisible] = useState(true);
  const done = useRef(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {}
    finishIntro();
    setVisible(false);
    // The sheet still covers the sim as the hero begins its entrance.
    revealFluid();
  }, []);

  useEffect(() => {
    // Skipped intro: CSS already hides it from first paint; nothing to run.
    if (document.documentElement.getAttribute("data-intro") !== "pending") {
      done.current = true;
      return;
    }
    const timer = setTimeout(finish, HOLD_MS);
    const skip = (e: KeyboardEvent) => (e.key === "Escape" || e.key === "Enter" || e.key === " ") && finish();
    window.addEventListener("keydown", skip);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", skip);
    };
  }, [finish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="preloader fixed inset-0 z-[var(--z-preloader)] grid place-items-center bg-canvas px-[var(--space-gutter)]"
          onClick={finish}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: EASE_IN_OUT_EXPO } }}
        >
          <div aria-hidden className="preloader-signature flex -translate-y-4 flex-col items-center text-center">
            <p className="preloader-name font-display text-[clamp(3rem,2.5rem+2vw,4.5rem)] leading-[1.15] tracking-[-0.035em] text-ink italic">
              {firstName}<span className="text-accent">.</span>
            </p>
            <p className="preloader-role mt-3 font-mono text-[0.625rem] leading-relaxed tracking-[0.2em] text-ink-subtle uppercase sm:text-micro">
              {lastName}
            </p>
            <span className="mt-8 h-px w-10 overflow-hidden bg-line-subtle">
              <span className="preloader-bar block h-full origin-left bg-ink/40" />
            </span>
          </div>
          <button
            type="button"
            onClick={finish}
            className="absolute right-[var(--space-gutter)] bottom-6 min-h-11 rounded-sm font-mono text-micro tracking-wide text-ink-subtle transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:bottom-8"
          >
            {skipLabel}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
