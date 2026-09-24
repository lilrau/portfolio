"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type Mode = "default" | "link" | "hidden";

const ARROW: Record<Mode, { scale: number; rotate: number }> = {
  default: { scale: 1, rotate: 0 },
  link: { scale: 0.82, rotate: -12 },
  hidden: { scale: 0.4, rotate: 0 },
};

/*
 * A stylised arrow that trails the pointer on a spring. Ink fill with a rim in
 * the page colour, so it reads on light pages and dark photos alike. Links tip
 * it inward. Desktop + fine pointer +
 * motion allowed only; the native cursor comes back over form fields, and
 * whenever this isn't running.
 */
export default function GlassCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("hidden");
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.5 });

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-glass-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as Element | null;
      if (!el?.closest) return;
      if (el.closest("input, textarea, select, [contenteditable='true']")) {
        setMode("hidden");
        return;
      }
      setMode(el.closest("a, button, [role='button'], [data-cursor='link']") ? "link" : "default");
    };
    const onLeave = () => setMode("hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-glass-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[var(--z-cursor)]"
      style={{ x: sx, y: sy }}
    >
      {/* The arrow's tip sits on the pointer; it pivots around the tip. */}
      <motion.svg
        width="26"
        height="28"
        viewBox="0 0 26 28"
        className="absolute -top-[2px] -left-[2px] overflow-visible drop-shadow-[0_2px_6px_rgb(11_13_18/0.25)]"
        style={{ originX: "2px", originY: "2px" }}
        animate={{ ...ARROW[mode], opacity: mode === "hidden" ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      >
        <path
          d="M2.5 2.2 L22.6 11.4 C23.5 11.8 23.4 13.1 22.4 13.3 L14.2 15.2 C13.8 15.3 13.5 15.6 13.4 16 L10.8 24.7 C10.5 25.7 9.1 25.7 8.8 24.7 Z"
          fill="var(--color-ink)"
          stroke="var(--color-bg-primary)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}
