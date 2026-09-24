import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "../globals.css";
import { introInitScript } from "../../lib/theme";
import { getDictionary, hasLocale, localeTags, locales, siteUrl } from "../../i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const { meta } = getDictionary(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", "pt-BR": "/pt", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      title: meta.title,
      description: meta.description,
      locale: localeTags[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeTags[l].og),
    },
    icons: {
      icon: "/memoji.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return (
    <html
      lang={localeTags[locale].lang}
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      // data-intro is set by the inline script before hydration.
      suppressHydrationWarning
      // Lets Next turn smooth scrolling off during route transitions.
      data-scroll-behavior="smooth"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introInitScript }} />
      </head>
      <body className="bg-canvas text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
