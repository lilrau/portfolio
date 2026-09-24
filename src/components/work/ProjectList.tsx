"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { period, tr, type Project } from "../../data/types";
import type { Locale } from "../../i18n";
import { DURATION, EASE_OUT_EXPO, STAGGER } from "../../lib/motion";

export default function ProjectList({
  projects,
  offset,
  locale,
  title,
  compact = false,
}: {
  projects: Project[];
  /** Numbering continues after the featured cards. */
  offset: number;
  locale: Locale;
  title: string;
  /** Half-width at lg (beside a card): kind goes under the title, no period column. */
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<Project | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const update = () => setFinePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const preview = finePointer && hovered?.images[0] ? hovered : null;

  return (
    <div className="relative" onMouseMove={(e) => (x.set(e.clientX), y.set(e.clientY))} onMouseLeave={() => setHovered(null)}>
      <h3 className="mb-6 eyebrow text-ink">{title}</h3>
      <ul className="border-t border-line">
        {projects.map((project, i) => (
          <motion.li
            key={project.slug}
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -5% 0px" }}
            transition={{ duration: DURATION.slower, delay: i * STAGGER.item, ease: EASE_OUT_EXPO }}
            className="border-b border-line"
          >
            <div
              onMouseEnter={() => setHovered(project)}
              className={`grid grid-cols-[2.5rem_1fr] items-center gap-x-4 gap-y-2 py-5 md:grid-cols-[3rem_minmax(0,1.2fr)_minmax(0,1fr)_7.5rem] md:gap-x-6 md:py-6 ${
                compact ? "lg:grid-cols-[3rem_minmax(0,1fr)]" : ""
              }`}
            >
              <span className="font-mono text-xs text-ink-muted">{String(offset + i + 1).padStart(2, "0")}</span>
              <span className="min-w-0">
                <span className="block text-title font-medium tracking-[-0.015em] text-ink">{project.title}</span>
                <span className={`block text-sm text-ink-muted md:hidden ${compact ? "lg:block" : ""}`}>{tr(project.kind, locale)}</span>
              </span>
              <span className={`hidden text-ink-muted md:block ${compact ? "lg:hidden" : ""}`}>{tr(project.kind, locale)}</span>
              <span className={`hidden font-mono text-xs text-ink-muted md:block ${compact ? "lg:hidden" : ""}`}>{project.period ? period(project.period, locale) : (project.context ?? "")}</span>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Portalled: the list can sit inside a transformed wrapper (the staggered
          column), which would make position:fixed relative to it, not the viewport. */}
      {finePointer &&
        createPortal(
          <AnimatePresence>
            {preview && (
              <motion.div
                key="preview"
                aria-hidden
                className="pointer-events-none fixed top-0 left-0 z-[var(--z-overlay)] w-[22rem]"
                style={{ x: sx, y: sy, translateX: "-50%", translateY: "-115%" }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: DURATION.slow, ease: EASE_OUT_EXPO }}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-glass-md shadow-deep">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={preview.slug}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: DURATION.normal }}
                    >
                      <Image src={preview.images[0]} alt="" fill sizes="22rem" className="object-cover object-top" />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
