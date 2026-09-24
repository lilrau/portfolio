"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FluidBackground from "../../components/fluid";
import RevealHeadline from "../../components/RevealHeadline";
import GlassSurface from "../../components/GlassSurface";
import { getDictionary, hasLocale, defaultLocale } from "../../i18n";

export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale && hasLocale(params.locale) ? params.locale : defaultLocale;
  const { notFound: copy } = getDictionary(locale);

  return (
    <>
      <FluidBackground />
      <main className="relative z-10 flex min-h-[100svh] flex-col justify-end px-[var(--space-gutter)] pt-24 pb-12">
        <p className="eyebrow text-ink-muted">404</p>
        <RevealHeadline
          as="h1"
          animateOnMount
          before={`${copy.title.split(" ").slice(0, -1).join(" ")} `}
          accent={copy.title.split(" ").slice(-1)[0]}
          className="mt-4 max-w-[12ch] text-closing font-medium text-ink"
        />
        <div className="mt-10 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-content text-lead text-ink-muted">{copy.body}</p>
          <GlassSurface
            as={Link}
            href={`/${locale}`}
            variant="pill"
            interactive
            className="inline-flex h-12 items-center gap-2 self-start pr-6 pl-5 text-sm font-medium text-ink focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none sm:self-auto"
          >
            <ArrowLeft aria-hidden className="size-4" />
            {copy.back}
          </GlassSurface>
        </div>
      </main>
    </>
  );
}
