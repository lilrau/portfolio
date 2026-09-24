import type { Locale } from "../i18n/config";

/** A string in both site languages. */
export type Localized = Record<Locale, string>;

export const tr = (value: Localized, locale: Locale) => value[locale];

// Periods are written in English ("Oct 2025 — Now"); Portuguese gets pt-BR
// month abbreviations and "Atual". Whole-word matches only.
const PT_PERIOD: Record<string, string> = {
  Jan: "jan", Feb: "fev", Mar: "mar", Apr: "abr", May: "mai", Jun: "jun",
  Jul: "jul", Aug: "ago", Sep: "set", Oct: "out", Nov: "nov", Dec: "dez", Now: "Atual",
};
export const period = (value: string, locale: Locale) =>
  locale === "pt" ? value.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Now)\b/g, (m) => PT_PERIOD[m]) : value;


export type Project = {
  slug: string;
  title: string;
  featured: boolean;
  /** Short type line, e.g. "AI travel marketplace". */
  kind: Localized;
  role?: Localized;
  /** Where it was built (company / studio / program), shown when there is no period. */
  context?: string;
  period?: string;
  achievements: Localized[];
  description: Localized;
  tags: string[];
  images: string[];
};

export type Role = { title: Localized; period: string };

export type Job = {
  company: string;
  location: Localized;
  roles: Role[];
  highlights: { text: Localized }[];
};
