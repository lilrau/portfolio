"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import RevealHeadline from "../RevealHeadline";
import GlassSurface from "../GlassSurface";
import { Eyebrow } from "../ui";
import { contact } from "../../data/profile";
import type { Dictionary } from "../../i18n";

export default function Contact({ copy }: { copy: Dictionary["contact"] }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); the mailto link still works.
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative z-10 scroll-mt-24 px-[var(--space-gutter)] pt-[var(--space-section)] pb-16"
    >
      <div className="mx-auto max-w-page">
        <Eyebrow className="mb-10">
          <span className="text-ink-muted">04</span>
          <span aria-hidden className="h-px w-8 bg-line" />
          {copy.eyebrow}
        </Eyebrow>

        <RevealHeadline
          id="contact-title"
          before={copy.titleBefore}
          accent={copy.titleAccent}
          after={copy.titleAfter}
          className="max-w-[14ch] text-closing font-medium text-ink"
        />

        <div className="mt-14 grid gap-10 border-t border-line pt-10 lg:mt-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="mb-6 max-w-content text-lead text-ink-muted">{copy.intro}</p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${contact.email}`}
                data-cursor="link"
                className="group inline-flex min-h-11 items-baseline gap-3 text-headline font-medium tracking-[-0.02em] text-ink underline decoration-line decoration-1 underline-offset-[0.2em] transition-[text-decoration-color] hover:decoration-ink focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none"
              >
                <span className="break-all sm:break-normal">{contact.email}</span>
              </a>
              <GlassSurface
                as="button"
                type="button"
                variant="pill"
                interactive
                onClick={copyEmail}
                className="inline-flex h-11 items-center gap-2 px-4 text-sm font-medium text-ink focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none"
              >
                {copied ? <Check aria-hidden className="size-4 text-success" /> : <Copy aria-hidden className="size-4" />}
                {copied ? copy.copied : copy.copy}
              </GlassSurface>
              <span role="status" aria-live="polite" className="sr-only">
                {copied ? copy.copied : ""}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5 lg:items-end">
            <ul className="flex flex-wrap gap-3">
              {[
                { label: "LinkedIn", href: contact.linkedin, Icon: LinkedInIcon },
                { label: "GitHub", href: contact.github, Icon: GitHubIcon },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-12 items-center gap-2.5 rounded-full border border-line pr-5 pl-5 font-medium text-ink transition-colors hover:bg-ink hover:text-ink-inverse focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none"
                  >
                    <link.Icon />
                    {link.label}
                    <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="eyebrow text-ink-muted">{copy.where}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Brand marks inline (lucide deprecated its brand icons). Paths: Simple Icons.
function GitHubIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-[1.125rem]" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-[1.125rem]" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
