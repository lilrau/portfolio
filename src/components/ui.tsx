import type { ReactNode } from "react";
import RevealHeadline from "./RevealHeadline";

/** Section shell: consistent width, rhythm, eyebrow and revealed headline. */
export function Section({
  id,
  index,
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: { before?: string; accent?: string; after?: string };
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative z-10 scroll-mt-24 px-[var(--space-gutter)] pt-[var(--space-section)] ${className}`}
    >
      <div className="mx-auto max-w-page">
        <header className="mb-12 grid gap-6 md:mb-20 lg:grid-cols-12">
          <Eyebrow className="lg:col-span-3 lg:pt-5">
            <span className="text-ink-muted">{index}</span>
            <span aria-hidden className="h-px w-8 bg-line" />
            {eyebrow}
          </Eyebrow>
          <div className="lg:col-span-9">
            <RevealHeadline
              {...title}
              id={`${id}-title`}
              className="max-w-[16ch] text-display font-medium tracking-[var(--letter-spacing-tight)] text-ink"
            />
            {intro && <p className="mt-6 max-w-content text-lead text-ink-muted">{intro}</p>}
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`flex items-center gap-3 eyebrow text-ink ${className}`}
    >
      {children}
    </p>
  );
}

/** Neutral, monochrome technology tag. */
export function TechTag({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-full border border-line px-3 py-1 font-mono text-micro tracking-[0.02em] text-ink-muted">
      {children}
    </li>
  );
}

export function TagList({ tags, max }: { tags: string[]; max?: number }) {
  const shown = max ? tags.slice(0, max) : tags;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {shown.map((t) => (
        <TechTag key={t}>{t}</TechTag>
      ))}
      {max && tags.length > max && <TechTag>+{tags.length - max}</TechTag>}
    </ul>
  );
}
