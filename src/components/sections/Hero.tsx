"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import Image from "next/image";
import ResumeButton from "../ResumeButton";
import type { Dictionary } from "../../i18n";
import { useIntroReady } from "../../lib/intro";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, delay, ease: EASE_OUT_EXPO },
  }),
};

const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45 } },
};

// The landscape fades up while settling from a slight zoom.
const settle: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  show: { opacity: 1, scale: 1, transition: { duration: 2, ease: EASE_OUT_EXPO } },
};

const line: Variants = {
  hidden: { y: "140%" },
  show: (delay: number) => ({
    y: "0%",
    transition: { duration: 1.2, delay, ease: EASE_OUT_EXPO },
  }),
};

export default function Hero({
  copy,
  nextSectionId,
}: {
  copy: Dictionary["hero"];
  nextSectionId: string;
}) {
  // Entrance waits for the preloader (plays at once when there is none).
  const state = useIntroReady() ? "show" : "hidden";
  const reduce = useReducedMotion();
  const riseV = reduce ? fade : rise;
  const lineV = reduce ? fade : line;
  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[100svh] flex-col px-[var(--space-gutter)] pt-6 pb-8 md:pt-8 md:pb-10"
    >
      {/* Full-bleed landscape behind the hero. A wash of the page colour keeps it
          airy and the dark type legible; a mask dissolves it into the page below. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        initial="hidden"
        animate={state}
        variants={reduce ? fade : settle}
      >
        <Image
          src="/hero-landscape.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_35%] saturate-[0.55]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-bg-primary)_35%,transparent),color-mix(in_srgb,var(--color-bg-primary)_65%,transparent))]" />
      </motion.div>

      {/* Top bar: clears the fixed language control (beside it from sm, below it on phones) */}
      <motion.div
        className="eyebrow flex items-center gap-3 pt-14 text-ink sm:pt-0 sm:pr-28"
        initial="hidden"
        animate={state}
        variants={riseV}
        custom={0.6}
      >
        {/* Static and neutral: a pulsing green dot reads as "available for hire". */}
        <span aria-hidden className="inline-flex size-1.5 rounded-full bg-ink" />
        <span>{copy.status}</span>
        <span aria-hidden className="hidden h-px w-6 bg-ink/30 sm:block" />
        <span className="hidden sm:inline">{copy.location}</span>
      </motion.div>

      {/* Monumental name */}
      <div className="flex flex-1 items-end pt-8 pb-8 md:pb-10">
        <h1 aria-label={`${copy.firstName}, ${copy.lastName}`} className="w-full">
          <span aria-hidden className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="block font-sans text-hero font-semibold"
              initial="hidden"
              animate={state}
              variants={lineV}
              custom={0.15}
            >
              {copy.firstName}
            </motion.span>
          </span>
          {/* Extra room for the italic's descenders and overhang; net spacing unchanged. */}
          <span aria-hidden className="-mx-[0.12em] -mb-[0.18em] block overflow-hidden px-[0.12em] pb-[0.3em]" style={{ fontSize: "clamp(2rem, 0.7rem + 4.4vw, 7rem)" }}>
            <motion.span
              className="block pl-[8vw] font-display italic leading-[0.9] tracking-[-0.03em] md:pr-[2vw] md:pl-0 md:text-right"
              initial="hidden"
              animate={state}
              variants={lineV}
              custom={0.3}
            >
              {copy.lastName}
            </motion.span>
          </span>
        </h1>
      </div>

      {/* Bottom rail */}
      <motion.div
        className="grid grid-cols-1 gap-8 border-t border-line pt-6 md:pt-8 lg:grid-cols-12 lg:items-end lg:gap-6"
        initial="hidden"
        animate={state}
        variants={riseV}
        custom={0.4}
      >
        <div className="lg:col-span-6">
          <p className="mb-4 eyebrow text-ink">
            {copy.role}
          </p>
          <p className="max-w-[28ch] text-headline font-medium tracking-[-0.015em] text-ink">
            {copy.valueBefore}
            <em className="font-display text-[1.12em] font-normal italic">
              {copy.valueAccent}
            </em>
            {copy.valueAfter}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:col-span-6 lg:justify-end">
          <a
            href="#contact"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent pr-5 pl-6 text-sm font-medium text-accent-fg transition-colors duration-[var(--duration-normal)] hover:bg-accent-hover focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none"
          >
            {copy.contact}
            <ArrowDownRight
              aria-hidden
              className="size-4 transition-transform duration-[var(--duration-normal)] ease-out-expo group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </a>
          <ResumeButton variant="glass" label={copy.resume} hint={copy.resumeHint} />

          <a
            href={`#${nextSectionId}`}
            className="ml-4 hidden items-center gap-3 eyebrow text-ink lg:inline-flex"
          >
            <span>{copy.scroll}</span>
            <span aria-hidden className="relative h-10 w-px overflow-hidden bg-ink/20">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.2s_var(--easing-in-out)_infinite] bg-ink motion-reduce:animate-none" />
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
