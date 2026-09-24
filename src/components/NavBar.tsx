"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import GlassSurface from "./GlassSurface";
import LocaleSwitcher from "./LocaleSwitcher";
import ResumeButton from "./ResumeButton";
import { contact } from "../data/profile";
import type { Dictionary, Locale } from "../i18n";
import { DURATION, EASE_OUT_EXPO, STAGGER } from "../lib/motion";
import { trapTab } from "../lib/focus";

const SECTIONS = ["about", "experience", "work", "contact"] as const;
type SectionId = (typeof SECTIONS)[number];

function HomeMark({ label, className }: { label: string; className: string }) {
  return (
    <a href="#top" aria-label={label} className={className}>
      <Image
        src="/memoji.png"
        alt=""
        width={96}
        height={96}
        className="size-full -translate-x-px scale-[1.3] object-cover"
        style={{ width: "100%", height: "100%" }}
      />
    </a>
  );
}

/** True once the hero has scrolled out of view. */
function usePastHero() {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setPast(!entry.isIntersecting), { rootMargin: "-20% 0px 0px 0px" });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return past;
}

/**
 * The section being read: the last one whose top has passed 45% of the
 * viewport (null over the hero). At the very bottom it is the last section,
 * which may be too short to ever reach that line.
 */
function useActiveSection() {
  const [active, setActive] = useState<SectionId | null>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current: SectionId | null = null;
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && (el.getBoundingClientRect().top <= line || atBottom)) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return active;
}

export default function NavBar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const past = usePastHero();
  const active = useActiveSection();
  const [sheetOpen, setSheetOpen] = useState(false);
  const reduce = useReducedMotion();
  // Switching language keeps this component mounted; don't carry an open sheet over.
  const [sheetLocale, setSheetLocale] = useState(locale);
  if (sheetLocale !== locale) {
    setSheetLocale(locale);
    setSheetOpen(false);
  }
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const labels: Record<SectionId, string> = {
    work: dict.nav.work,
    experience: dict.nav.experience,
    about: dict.nav.about,
    contact: dict.nav.contact,
  };

  const slide = (from: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : from },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduce ? 0 : from },
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  });

  return (
    <>
      {/* Mobile: corner switcher while the hero is on screen */}
      <AnimatePresence>
        {!past && (
          <motion.div key="corner" className="fixed top-6 right-[var(--space-gutter)] z-[var(--z-nav)] flex items-center gap-2 md:hidden" {...slide(-12)}>
            <LocaleSwitcher locale={locale} label={dict.ui.languageLabel} />
          </motion.div>
        )}
      </AnimatePresence>

      <DesktopNav past={past} active={active} labels={labels} dict={dict} locale={locale} />

      {/* Mobile pill, in thumb reach */}
      <AnimatePresence>
        {past && (
          <motion.div key="mobile" className="fixed inset-x-0 bottom-4 z-[var(--z-nav)] flex justify-center px-4 md:hidden" {...slide(24)}>
            <GlassSurface as="nav" aria-label={dict.nav.main} variant="strong" className="flex items-center gap-1 p-1.5 shadow-soft">
              <HomeMark
                label={dict.nav.home}
                className="mr-1 inline-flex size-11 items-center justify-center overflow-hidden rounded-full"
              />
              <a href="#contact" className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-fg">
                {dict.nav.contact}
              </a>
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={sheetOpen}
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-ink"
              >
                <Menu aria-hidden className="size-4" />
                {dict.nav.menu}
              </button>
            </GlassSurface>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileSheet open={sheetOpen} onClose={closeSheet} dict={dict} locale={locale} labels={labels} active={active} />
    </>
  );
}

const PAD = 6; // segment padding (p-1.5)
const H = 52; // segment height: 40px controls + padding
const R = H / 2;
const GAP = 14; // resting gap between segments
const GOO = 6; // goo blur σ; necks hold until the gap is ≈1.5σ, then snap
const STRETCH = 1.12; // split overshoot: droplets pull past GAP before settling

/*
 * Desktop nav as liquid-glass segments. Over the hero only the centre capsule
 * shows, as wide as the language switcher, in the corner. Past the hero it
 * glides to the centre and widens (real width, never scaled) while its row
 * slides in step, keeping the switcher pinned. Then the avatar and the résumé
 * bud off its ends: all segment bodies are drawn in one SVG through a goo
 * filter (blur + alpha threshold), so they read as a single liquid whose neck
 * stretches, thins and snaps as the droplets pull away.
 */
function DesktopNav({
  past,
  active,
  labels,
  dict,
  locale,
}: {
  past: boolean;
  active: SectionId | null;
  labels: Record<SectionId, string>;
  dict: Dictionary;
  locale: Locale;
}) {
  const reduce = useReducedMotion();
  const gooId = `goo-${useId().replace(/:/g, "")}`;
  const barRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const switchRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [m, setM] = useState<{ bar: number; gutter: number; row: number; sx: number; sw: number; rw: number } | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    const row = rowRef.current;
    const sw = switchRef.current;
    const rs = resumeRef.current;
    if (!bar || !row || !sw || !rs) return;
    const measure = () =>
      setM({
        bar: bar.clientWidth,
        gutter: parseFloat(getComputedStyle(bar).paddingRight) || 0,
        row: row.offsetWidth,
        sx: sw.offsetLeft,
        sw: sw.offsetWidth,
        rw: rs.offsetWidth,
      });
    measure();
    const ro = new ResizeObserver(measure);
    [bar, row, rs].forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [locale]);

  // Geometry in the group's own coordinates; the capsule starts after the avatar slot.
  const narrow = m ? m.sw + PAD * 2 : 0; // capsule with only the switcher
  const wide = m ? m.row : 0; // capsule with the whole row
  const rw = m?.rw ?? H;
  const start = H + GAP;

  const width = useMotionValue(0);
  const split = useMotionValue(0);
  const left = useMotionValue(0);
  const top = useMotionValue(24);

  const first = useRef(true);
  useEffect(() => {
    if (!m) return;
    const targetLeft = past ? (m.bar - (start + wide + GAP + rw)) / 2 : m.bar - m.gutter - narrow - start;
    const targetWidth = past ? wide : narrow;
    if (first.current || reduce) {
      first.current = false;
      left.jump(targetLeft);
      width.jump(targetWidth);
      split.jump(past ? 1 : 0);
      top.jump(past ? 20 : 24);
      return;
    }
    const spring = { type: "spring", stiffness: 240, damping: 30, mass: 0.9 } as const;
    const controls = past
      ? [
          animate(left, targetLeft, spring),
          animate(top, 20, spring),
          animate(width, targetWidth, spring),
          animate(split, [0, STRETCH, 1], { duration: 1.2, times: [0, 0.6, 1], ease: ["easeInOut", "easeOut"], delay: 0.3 }),
        ]
      : [
          animate(split, 0, { duration: 0.45, ease: "easeIn" }),
          animate(left, targetLeft, { ...spring, delay: 0.3 }),
          animate(top, 24, { ...spring, delay: 0.3 }),
          animate(width, targetWidth, { ...spring, delay: 0.3 }),
        ];
    return () => controls.forEach((c) => c.stop());
  }, [past, m, reduce, narrow, wide, rw, start, left, top, width, split]);

  // Droplets start tucked inside the capsule's ends (merged by the goo) and
  // pull out to GAP. The résumé grows from a round droplet into its pill.
  const avatarX = useTransform(split, (s) => start * (1 - s));
  const avatarCx = useTransform(avatarX, (x) => x + R);
  // Tucked droplets overlap the capsule's ends and the goo would swell them;
  // keep them out of the liquid until they start to bud.
  const dropFill = useTransform(split, [0, 0.06], [0, 1]);
  const resumeW = useTransform(split, (s) => H + (rw - H) * Math.min(s, 1));
  const resumeX = useTransform([width, split, resumeW], ([w, s, rsw]: number[]) => start + w - rsw + (GAP + rsw) * s);
  const content = useTransform(split, [0.5, 1], [0, 1]);
  const contentBlur = useTransform(split, [0.5, 1], ["blur(6px)", "blur(0px)"]);
  // The row slides in step with the width so the switcher stays put.
  const shift = useTransform(width, (w) => {
    if (!m || wide === narrow) return 0;
    const t = (w - narrow) / (wide - narrow);
    return (PAD - m.sx) * (1 - t);
  });

  const fade = (delay: number) => ({
    initial: false as const,
    animate: past ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(8px)" },
    transition: reduce
      ? { duration: 0 }
      : past
        ? { duration: DURATION.slower, ease: EASE_OUT_EXPO, delay }
        : { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  });

  const blurLayer = "absolute inset-0 rounded-full [backdrop-filter:blur(var(--glass-blur))_saturate(var(--glass-saturate))]";

  return (
    <div ref={barRef} className="pointer-events-none fixed inset-x-0 top-0 z-[var(--z-nav)] hidden h-24 px-[var(--space-gutter)] md:block">
      <motion.nav aria-label={dict.nav.main} className={`absolute h-[52px] w-0 ${m ? "" : "invisible"}`} style={{ left, top }}>
        {/* 1. Backdrop blur under each body (the goo layer can't carry backdrop-filter). */}
        <motion.div aria-hidden className="absolute top-0 left-0 size-[52px]" style={{ x: avatarX, opacity: content }}>
          <div className={blurLayer} />
        </motion.div>
        <motion.div aria-hidden className="absolute top-0 left-0 h-[52px]" style={{ x: resumeX, width: resumeW, opacity: content }}>
          <div className={blurLayer} />
        </motion.div>
        <motion.div aria-hidden className="absolute top-0 h-[52px]" style={{ left: start, width }}>
          <div className={blurLayer} />
        </motion.div>

        {/* 2. Liquid bodies: merged through the goo filter, then rim-lit. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 overflow-visible [filter:drop-shadow(0_4px_12px_rgb(11_13_18/0.06))_drop-shadow(0_16px_40px_rgb(11_13_18/0.08))]"
          width="1"
          height={H}
        >
          <defs>
            <filter id={gooId} x="-200" y="-60" width="3000" height="180" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceGraphic" stdDeviation={GOO} result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11" result="goo" />
              <feComponentTransfer in="goo" result="body">
                <feFuncA type="linear" slope="0.86" />
              </feComponentTransfer>
              <feMorphology in="goo" operator="erode" radius="1" result="inner" />
              <feComposite in="goo" in2="inner" operator="out" result="ring" />
              <feFlood style={{ floodColor: "var(--glass-highlight)" }} floodOpacity="0.9" />
              <feComposite in2="ring" operator="in" result="rim" />
              <feMerge>
                <feMergeNode in="body" />
                <feMergeNode in="rim" />
              </feMerge>
            </filter>
          </defs>
          <g filter={`url(#${gooId})`} style={{ fill: "var(--glass-tint-strong)" }}>
            <motion.circle cy={R} r={R} cx={avatarCx} opacity={dropFill} />
            <motion.rect y={0} height={H} rx={R} x={resumeX} width={resumeW} opacity={dropFill} />
            <motion.rect y={0} height={H} rx={R} x={start} width={width} />
          </g>
        </svg>

        {/* 3. Content. */}
        <motion.div className="absolute top-0 left-0 grid size-[52px] place-items-center" style={{ x: avatarX }} inert={!past}>
          <motion.div className={`flex ${past ? "pointer-events-auto" : ""}`} style={{ opacity: content, filter: contentBlur }}>
            <HomeMark
              label={dict.nav.home}
              className="inline-flex size-10 items-center justify-center overflow-hidden rounded-full focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none"
            />
          </motion.div>
        </motion.div>

        <motion.div className="absolute top-0 left-0" style={{ x: resumeX }} inert={!past}>
          <motion.div
            ref={resumeRef}
            className={`flex h-[52px] w-max items-center p-1.5 ${past ? "pointer-events-auto" : ""}`}
            style={{ opacity: content, filter: contentBlur }}
          >
            <ResumeButton variant="accent" label={dict.hero.resume} />
          </motion.div>
        </motion.div>

        <motion.div className="pointer-events-auto absolute top-0 h-[52px] overflow-hidden rounded-full" style={{ left: start, width }}>
          <motion.div ref={rowRef} className="flex w-max items-center gap-1" style={{ padding: PAD, x: shift }}>
            <motion.div className="flex items-center gap-1" inert={!past} {...fade(0.05)}>
              <ul className="flex items-center">
                {SECTIONS.map((id) => (
                  <li key={id} className="relative">
                    {active === id && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    <a
                      href={`#${id}`}
                      aria-current={active === id ? "location" : undefined}
                      className={`relative inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors duration-[var(--duration-normal)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none ${
                        active === id ? "text-ink-inverse" : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      {labels[id]}
                    </a>
                  </li>
                ))}
              </ul>
              <span aria-hidden className="mx-1.5 h-6 w-px bg-line" />
            </motion.div>
            <div ref={switchRef}>
              <LocaleSwitcher locale={locale} label={dict.ui.languageLabel} />
            </div>
          </motion.div>
        </motion.div>
      </motion.nav>
    </div>
  );
}

function MobileSheet({
  open,
  onClose,
  dict,
  locale,
  labels,
  active,
}: {
  open: boolean;
  onClose: () => void;
  dict: Dictionary;
  locale: Locale;
  labels: Record<SectionId, string>;
  active: SectionId | null;
}) {
  const sheetRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  // Scroll lock, Esc, focus trap; focus returns to the menu button on close.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    root.dataset.overlay = "open";
    requestAnimationFrame(() => closeRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else trapTab(e, sheetRef.current);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = previous;
      delete root.dataset.overlay;
      const target =
        opener && opener !== document.body && opener.isConnected
          ? opener
          : document.querySelector<HTMLElement>('button[aria-haspopup="dialog"]');
      target?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  // Close first (releases the scroll lock), then jump to the section.
  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    onClose();
    // Two frames: the effect cleanup that releases the scroll lock runs first.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        history.replaceState(null, "", `#${id}`);
      }),
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="sheet"
          className="fixed inset-0 z-[var(--z-overlay)] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.normal }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label={dict.nav.close}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--color-surface-overlay)] backdrop-blur-sm"
          />
          <GlassSurface
            as={motion.div}
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={dict.nav.menu}
            variant="panel"
            radius={36}
            drag={reduce ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
              if (info.offset.y > 100 || info.velocity.y > 500) onClose();
            }}
            initial={{ y: reduce ? 0 : "100%", opacity: reduce ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduce ? 0 : "100%", opacity: reduce ? 0 : 1 }}
            transition={{ duration: DURATION.slower, ease: EASE_OUT_EXPO }}
            className="absolute inset-x-2 bottom-2 px-6 pt-3 pb-6"
            style={{ "--glass-tint": "var(--glass-tint-strong)" } as React.CSSProperties}
          >
            <span aria-hidden className="mx-auto mb-4 block h-1 w-10 rounded-full bg-ink/20" />
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-2xl italic text-ink">Raul Souza Silva</span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={dict.nav.close}
                className="inline-flex size-11 items-center justify-center rounded-full border border-line text-ink"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>
            <nav aria-label={dict.nav.main}>
              <ul>
                {SECTIONS.map((id, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION.slower, delay: 0.1 + i * STAGGER.item, ease: EASE_OUT_EXPO }}
                    className="border-b border-line"
                  >
                    <a
                      href={`#${id}`}
                      onClick={(e) => go(e, id)}
                      aria-current={active === id ? "location" : undefined}
                      className="flex min-h-16 items-center justify-between text-metric font-medium tracking-[-0.03em] text-ink"
                    >
                      {labels[id]}
                      <span className="font-mono text-xs text-ink-subtle">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 flex items-center justify-between gap-3">
              <LocaleSwitcher locale={locale} label={dict.ui.languageLabel} />
              <ResumeButton variant="ink" label={dict.hero.resume} />
            </div>
            <a href={`mailto:${contact.email}`} className="mt-5 block truncate text-center font-mono text-xs text-ink-muted">
              {contact.email}
            </a>
          </GlassSurface>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
