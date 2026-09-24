"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { INTRO_STORAGE_KEY } from "../lib/theme";
import { finishIntro } from "../lib/intro";
import { EASE_IN_OUT_EXPO } from "../lib/motion";

const HOLD_MS = 1050; // name reveal + hairline; the dissolve adds 0.7s (total ≈ 1.75s, under the 1.8s cap)

// The fluid script loads lazily; give it a moment before the reveal splash.
function burstWhenReady(tries = 20) {
  const fluid = (window as Window & { __fluid?: { burst: (n?: number) => void } }).__fluid;
  if (fluid) fluid.burst(14);
  else if (tries > 0) setTimeout(() => burstWhenReady(tries - 1), 100);
}

// The sim stays hidden until the name has risen. Revealing it here is what
// the dissolving sheet opens onto.
function revealFluid() {
  document.documentElement.setAttribute("data-fluid", "on");
  burstWhenReady();
}

export default function Preloader({ firstName, lastName, skipLabel }: { firstName: string; lastName: string; skipLabel: string }) {
  // Rendered on the server so there is no flash of the hero; CSS hides it
  // unless the head script marked the intro as pending.
  const [visible, setVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const done = useRef(false);

  // Starts the CSS reveal before paint, so hydration can't flash the resting layout.
  useLayoutEffect(() => {
    setPlaying(true);
  }, []);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {}
    finishIntro();
    setVisible(false);
    // The name has already risen. The sim was hidden until now, so its
    // first frames can't flash behind the type.
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
          className={`preloader fixed inset-0 z-[var(--z-preloader)] flex flex-col bg-canvas px-[var(--space-gutter)] py-8${playing ? " is-playing" : ""}`}
          onClick={finish}
          // Dissolves into the page (the brief's "sheet of glass melting away")
          // instead of lifting like a curtain.
          exit={{ opacity: 0, y: "-4%", transition: { duration: 0.7, ease: EASE_IN_OUT_EXPO } }}
        >
          <div className="flex flex-1 items-center">
            <p aria-hidden className="w-full text-display leading-[0.9] font-semibold tracking-[var(--letter-spacing-tighter)] text-ink">
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="preloader-line block">{firstName}</span>
              </span>
              <span className="-mx-[0.12em] -mb-[0.18em] block overflow-hidden px-[0.12em] pb-[0.3em]" style={{ fontSize: "clamp(2rem, 0.7rem + 4.4vw, 5.5rem)" }}>
                <span className="preloader-line preloader-line-delay block pl-[8vw] font-display font-normal italic leading-[0.9] tracking-[-0.03em]">
                  {lastName}
                </span>
              </span>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="relative h-px flex-1 overflow-hidden bg-line">
              <span className="preloader-bar absolute inset-y-0 left-0 w-full origin-left bg-ink" />
            </span>
            <button
              type="button"
              onClick={finish}
              className="min-h-11 eyebrow text-ink-muted hover:text-ink"
            >
              {skipLabel}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
