import { notFound } from "next/navigation";

// The root layout lives in [locale], so unknown paths under a locale need an
// explicit catch-all to render [locale]/not-found.tsx (with the site chrome).
export default function CatchAll() {
  notFound();
}
