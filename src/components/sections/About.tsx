"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Section } from "../ui";
import GlassSurface from "../GlassSurface";
import { stack } from "../../data/profile";
import { tr } from "../../data/types";
import type { Dictionary, Locale } from "../../i18n";

export default function About({ copy, locale }: { copy: Dictionary["about"]; locale: Locale }) {
  const photoRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-5%", "5%"]);

  return (
    <Section
      id="about"
      index="01"
      eyebrow={copy.eyebrow}
      title={{ before: copy.titleBefore, accent: copy.titleAccent, after: copy.titleAfter }}
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div ref={photoRef} className="lg:col-span-4 lg:col-start-1">
          <GlassSurface variant="panel" className="p-2.5 md:p-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(var(--border-radius-lg)-0.625rem)] bg-well">
              <motion.div className="absolute -inset-y-[6%] inset-x-0" style={{ y }}>
                <Image
                  src="/dev_pic_blur_bg.png"
                  alt={copy.photoAlt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </div>
          </GlassSurface>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="max-w-content space-y-6 text-lead text-ink">
            {copy.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="border-l border-line pl-5 text-ink-muted">{copy.educator}</p>
          </div>

          <div className="mt-16">
            <h3 className="mb-6 eyebrow text-ink">{copy.stack}</h3>
            <div className="grid gap-8 border-t border-line pt-8 sm:grid-cols-3">
              {stack.map((group) => (
                <div key={group.group.en}>
                  <h4 className="mb-4 font-display text-headline leading-none italic text-ink">{tr(group.group, locale)}</h4>
                  <ul className="space-y-1.5 text-ink-muted">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 border-t border-line pt-6">
            <h3 className="mb-4 eyebrow text-ink">{copy.languages}</h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {copy.languageList.map((lang) => (
                <GlassSurface as="li" key={lang.name} variant="panel" radius={20} className="flex items-center gap-4 p-4">
                  <Flag code={lang.flag} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-tight text-ink">{lang.name}</p>
                    <p className="mt-0.5 eyebrow text-micro text-ink-muted">{lang.level}</p>
                  </div>
                  {/* CEFR scale, A1 → C2 */}
                  <span aria-hidden className="flex items-end gap-0.5">
                    {Array.from({ length: 6 }, (_, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full ${i < lang.cefr ? "bg-ink" : "bg-line"}`}
                        style={{ height: 6 + i * 2.5 }}
                      />
                    ))}
                  </span>
                </GlassSurface>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

// Round flags drawn inline: emoji flags don't render on Windows.
function Flag({ code }: { code: string }) {
  const id = `flag-${code}`;
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="size-8 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08),0_1px_3px_rgb(11_13_18/0.12)]">
      <clipPath id={id}>
        <circle cx="10" cy="10" r="10" />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        {code === "br" ? (
          <>
            <rect width="20" height="20" fill="#009c3b" />
            <polygon points="10,3.2 18,10 10,16.8 2,10" fill="#ffdf00" />
            <circle cx="10" cy="10" r="3.9" fill="#002776" />
            <path d="M6.3 9.2 Q10 8.3 13.7 10.6" stroke="#fff" strokeWidth="0.7" fill="none" />
          </>
        ) : (
          <>
            <rect width="20" height="20" fill="#fff" />
            {Array.from({ length: 7 }, (_, i) => (
              <rect key={i} y={i * (40 / 13)} width="20" height={20 / 13} fill="#b22234" />
            ))}
            <rect width="9.5" height={(20 / 13) * 7} fill="#3c3b6e" />
          </>
        )}
      </g>
      <circle cx="10" cy="10" r="9.6" fill="none" stroke="rgb(0 0 0 / 0.08)" strokeWidth="0.8" />
    </svg>
  );
}
