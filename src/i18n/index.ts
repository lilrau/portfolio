import type { Locale } from "./config";
import { en, type Dictionary } from "./en";
import { pt } from "./pt";

const dictionaries: Record<Locale, Dictionary> = { en, pt };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

export type { Dictionary };
export * from "./config";
