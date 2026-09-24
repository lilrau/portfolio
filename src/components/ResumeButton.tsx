import { ArrowUpRight } from "lucide-react";
import GlassSurface from "./GlassSurface";
import { contact } from "../data/profile";

type Variant = "glass" | "primary" | "accent" | "ink";

const FOCUS = "focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none";
const ARROW = "size-4 transition-transform duration-[var(--duration-normal)] ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5";

/**
 * The résumé PDF link, in the four places it appears:
 * glass (hero), primary (Experience), accent (desktop nav), ink (mobile sheet).
 */
export default function ResumeButton({
  label,
  hint,
  variant,
  className = "",
}: {
  label: string;
  /** Small mono note after the label, e.g. "PDF" / "PDF, em inglês". */
  hint?: string;
  variant: Variant;
  className?: string;
}) {
  const link = { href: contact.resume, target: "_blank", rel: "noopener noreferrer" } as const;
  const content = (
    <>
      {label}
      {hint && <span className={`font-mono text-micro ${variant === "glass" ? "text-ink-muted" : "opacity-70"}`}>{hint}</span>}
      <ArrowUpRight aria-hidden className={ARROW} />
    </>
  );

  if (variant === "glass") {
    return (
      <GlassSurface
        as="a"
        variant="pill"
        interactive
        {...link}
        className={`group inline-flex h-12 items-center gap-2 pr-5 pl-6 text-sm font-medium text-ink ${FOCUS} ${className}`}
      >
        {content}
      </GlassSurface>
    );
  }

  const styles: Record<Exclude<Variant, "glass">, string> = {
    primary: "h-14 gap-3 bg-ink pr-6 pl-7 font-medium text-ink-inverse transition-transform duration-[var(--duration-normal)] ease-spring active:scale-[0.97]",
    accent: "h-10 gap-1.5 bg-accent pr-3.5 pl-4 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover",
    ink: "h-11 gap-1.5 bg-ink px-5 text-sm font-medium text-ink-inverse",
  };

  return (
    <a {...link} className={`group inline-flex items-center rounded-full ${styles[variant]} ${FOCUS} ${className}`}>
      {content}
    </a>
  );
}
