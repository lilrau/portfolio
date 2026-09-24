"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import GlassSurface from "../GlassSurface";
import { TagList } from "../ui";
import { period, tr, type Project } from "../../data/types";
import type { Locale } from "../../i18n";
import { EASE_OUT_EXPO, DURATION } from "../../lib/motion";

export default function FeaturedProjectCard({
  project,
  index,
  locale,
  imageLabel,
  className = "",
}: {
  project: Project;
  index: number;
  locale: Locale;
  /** Accessible name prefix for the image dots, e.g. "Image" → "Image 2". */
  imageLabel: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(0);
  const reduce = useReducedMotion();
  // Gentle parallax: the image drifts inside its frame as the card crosses the viewport.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO }}
    >
      <GlassSurface as="article" ref={ref} variant="panel" className="block p-2.5 md:p-3">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[calc(var(--border-radius-lg)-0.625rem)] bg-well">
          <AnimatePresence initial={false}>
            {project.images[shown] && (
              <motion.div
                key={project.images[shown]}
                className="absolute -inset-y-[8%] inset-x-0"
                style={{ y }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.slow }}
              >
                <Image
                  src={project.images[shown]}
                  alt={`${project.title} — ${imageLabel} ${shown + 1}`}
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="object-cover object-top"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {project.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <GlassSurface variant="pill" className="flex items-center gap-1 px-1.5 py-1">
              {project.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`${imageLabel} ${i + 1}`}
                  aria-current={i === shown ? "true" : undefined}
                  onClick={() => setShown(i)}
                  className="grid size-6 place-items-center rounded-full focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-[var(--duration-normal)] ${
                      i === shown ? "w-4 bg-ink" : "w-1.5 bg-ink/35 hover:bg-ink/60"
                    }`}
                  />
                </button>
              ))}
            </GlassSurface>
            </div>
          )}
        </div>

        <div className="px-3 pt-6 pb-4 md:px-5 md:pt-8 md:pb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="mb-3 eyebrow text-ink-muted">
                {String(index + 1).padStart(2, "0")} · {project.period ? period(project.period, locale) : project.context}
              </p>
              <h3 className="text-headline font-medium tracking-[-0.02em] text-ink">{project.title}</h3>
              <p className="mt-1 text-ink-muted">{tr(project.kind, locale)}</p>
              {project.role && <p className="mt-3 text-sm text-ink">{tr(project.role, locale)}</p>}
              <p className="mt-4 max-w-[60ch] text-ink-muted">{tr(project.description, locale)}</p>
            </div>
          </div>


          <div className="mt-6">
            <TagList tags={project.tags} max={5} />
          </div>
        </div>
      </GlassSurface>
    </motion.div>
  );
}
