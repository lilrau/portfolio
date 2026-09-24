"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";
import { DURATION, EASE_OUT_EXPO, STAGGER, inView } from "../lib/motion";

type Part = { text: string; accent?: boolean };

/*
 * Headline that rises word by word out of a mask. Splitting by word (not by
 * measured line) keeps it correct on resize without re-measuring. Screen
 * readers get the whole sentence from aria-label; the pieces are hidden.
 * Accent parts render in the italic display serif.
 */
export default function RevealHeadline({
  before = "",
  accent = "",
  after = "",
  as = "h2",
  id,
  className = "",
  delay = 0,
  animateOnMount = false,
}: {
  before?: string;
  accent?: string;
  after?: string;
  as?: ElementType;
  id?: string;
  className?: string;
  delay?: number;
  /** Play on mount instead of when scrolled into view (hero). */
  animateOnMount?: boolean;
}) {
  const reduce = useReducedMotion();
  const Tag = as;
  const label = `${before}${accent}${after}`.trim();

  const parts: Part[] = [
    ...split(before),
    ...split(accent).map((p) => ({ ...p, accent: true })),
    ...split(after),
  ];

  const trigger = animateOnMount
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: inView };

  return (
    <Tag id={id} aria-label={label} className={className}>
      <motion.span
        aria-hidden
        className="block"
        {...trigger}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : STAGGER.line * 0.6, delayChildren: delay } },
        }}
      >
        {parts.map((part, i) =>
          part.text === " " ? (
            " "
          ) : (
            <span
              key={i}
              // Room for descenders and the italic's overhang, cancelled by the
              // negative margins so the mask doesn't change the layout.
              className={`inline-block overflow-hidden pb-[0.3em] -mb-[0.3em] align-bottom ${
                part.accent ? "-mx-[0.12em] px-[0.12em]" : ""
              }`}
            >
              <motion.span
                className={`inline-block ${part.accent ? "font-display font-normal italic tracking-[-0.01em]" : ""}`}
                variants={
                  reduce
                    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: DURATION.slow } } }
                    : {
                        hidden: { y: "140%" },
                        show: { y: "0%", transition: { duration: DURATION.reveal, ease: EASE_OUT_EXPO } },
                      }
                }
              >
                {part.text}
              </motion.span>
            </span>
          ),
        )}
      </motion.span>
    </Tag>
  );
}

// "Selected work." → ["Selected", " ", "work."] so spaces stay breakable.
function split(text: string): Part[] {
  return text
    .split(/(\s+)/)
    .filter(Boolean)
    .map((t) => ({ text: /^\s+$/.test(t) ? " " : t }));
}
