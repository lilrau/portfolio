"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "../ui";
import GlassSurface from "../GlassSurface";
import ResumeButton from "../ResumeButton";
import { education, experience } from "../../data/profile";
import { period, tr } from "../../data/types";
import type { Dictionary, Locale } from "../../i18n";
import { DURATION, EASE_OUT_EXPO } from "../../lib/motion";

export default function Experience({ copy, locale }: { copy: Dictionary["experience"]; locale: Locale }) {
  const reduce = useReducedMotion();

  return (
    <Section
      id="experience"
      index="02"
      eyebrow={copy.eyebrow}
      title={{ before: copy.titleBefore, accent: copy.titleAccent, after: copy.titleAfter }}
    >
      <ol className="border-t border-line">
        {experience.map((job, i) => (
          <motion.li
            key={job.company}
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: DURATION.slower, delay: 0.05 * i, ease: EASE_OUT_EXPO }}
            className="grid gap-6 border-b border-line py-10 md:py-14 lg:grid-cols-12 lg:gap-10"
          >
            <div className="lg:col-span-3">
              <p className="eyebrow text-ink-muted">
                {tr(job.location, locale)}
              </p>
            </div>

            <div className="lg:col-span-4">
              <h3 className="text-headline font-medium tracking-[-0.02em] text-ink">{job.company}</h3>
              <ul className="mt-4 space-y-2">
                {job.roles.map((role) => (
                  <li key={role.period} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="text-ink">{tr(role.title, locale)}</span>
                    <span className="font-mono text-xs text-ink-muted">{period(role.period, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="space-y-5 lg:col-span-5">
              {job.highlights.map((h) => (
                <li key={h.text.en} className="flex gap-4">
                  <span aria-hidden className="mt-[0.7em] h-px w-24 shrink-0 bg-line sm:w-28" />
                  <span className="text-ink-muted">{tr(h.text, locale)}</span>
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ol>

      <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <h3 className="eyebrow text-ink">{copy.education}</h3>
        </div>
        <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-9">
          {education.map((item) => (
            <GlassSurface as="li" key={item.title.en} variant="panel" radius={24} className="flex flex-col p-6">
              <p className="font-display text-headline leading-none text-ink">{tr(item.mark, locale)}</p>
              <p className="mt-4 font-medium text-ink">{tr(item.title, locale)}</p>
              <p className="mt-1 text-sm text-ink-muted">{tr(item.detail, locale)}</p>
            </GlassSurface>
          ))}
        </ul>
      </div>

      <div className="mt-16 flex lg:mt-20 lg:justify-end">
        <ResumeButton variant="primary" label={copy.download} hint={copy.downloadHint} />
      </div>
    </Section>
  );
}
