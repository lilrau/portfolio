export const locales = ["en", "pt"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

// Open Graph / <html lang> values per locale.
export const localeTags: Record<Locale, { lang: string; og: string }> = {
  en: { lang: "en", og: "en_US" },
  pt: { lang: "pt-BR", og: "pt_BR" },
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://raul.moonrock.com.br";
