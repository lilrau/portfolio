import { ArrowUp } from "lucide-react";
import type { Dictionary } from "../../i18n";

export default function Footer({ copy }: { copy: Dictionary["footer"] }) {
  // pb clears the floating mobile nav pill (NavBar, bottom-4) so the links stay tappable.
  return (
    <footer className="relative z-10 px-[var(--space-gutter)] pb-28 md:pb-8">
      <div className="mx-auto flex max-w-page flex-col gap-6 border-t border-line pt-6 eyebrow text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {copy.rights}
        </p>
        <ul className="flex flex-wrap items-center gap-6">
          <li>
            <a href="#top" className="group inline-flex min-h-11 items-center gap-2 rounded-full text-ink focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none">
              {copy.top}
              <ArrowUp aria-hidden className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
