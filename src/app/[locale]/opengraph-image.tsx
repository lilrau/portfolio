import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getDictionary, hasLocale, locales } from "../../i18n";

export const alt = "Raul Souza Silva — Full Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const font = (file: string) => readFile(join(process.cwd(), "src/assets/fonts", file));

// Link preview (LinkedIn, WhatsApp, Slack): the hero in miniature over the fluid palette.
export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { hero } = getDictionary(hasLocale(locale) ? locale : "en");
  const [sans, sansBold, mono, serifItalic] = await Promise.all([
    font("Geist-Regular.ttf"),
    font("Geist-SemiBold.ttf"),
    font("GeistMono-Regular.ttf"),
    font("InstrumentSerif-Italic.ttf"),
  ]);

  // Word by word so the line wraps cleanly; punctuation right after the accent
  // stays glued to it ("confiáveis," never starts a line).
  const trailing = hero.valueAfter.match(/^[,.;:]/)?.[0] ?? "";
  const words = [
    ...hero.valueBefore.trim().split(/\s+/).map((text) => ({ text, accent: false })),
    { text: hero.valueAccent, accent: true },
    ...(trailing ? [{ text: trailing, accent: false, glue: true }] : []),
    ...hero.valueAfter.slice(trailing.length).trim().split(/\s+/).map((text) => ({ text, accent: false })),
  ].reduce<{ text: string; accent: boolean }[]>((acc, w) => {
    if ("glue" in w) acc[acc.length - 1] = { ...acc[acc.length - 1], text: acc[acc.length - 1].text + w.text };
    else acc.push(w);
    return acc;
  }, []);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#f3f4f7",
          backgroundImage:
            // Fade to the page colour, not "transparent" (which interpolates through grey here).
            "radial-gradient(circle at 88% 18%, rgba(124,58,237,0.30), rgba(243,244,247,0) 38%), radial-gradient(circle at 72% 92%, rgba(51,70,211,0.30), rgba(243,244,247,0) 42%), radial-gradient(circle at 98% 70%, rgba(6,182,212,0.22), rgba(243,244,247,0) 30%)",
          color: "#0b0d12",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "Geist Mono", fontSize: 22, letterSpacing: 3, textTransform: "uppercase" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#1e7a4e" }} />
          {hero.status} · {hero.location}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 156, fontWeight: 600, letterSpacing: -7, lineHeight: 0.9 }}>{hero.firstName}</div>
          <div style={{ fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: hero.lastName.length > 12 ? 72 : 172, lineHeight: 0.95, marginLeft: hero.lastName.length > 12 ? 48 : 180, letterSpacing: -2 }}>
            {hero.lastName}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(11,13,18,0.14)", paddingTop: 28 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", fontSize: 38, letterSpacing: -0.8, maxWidth: 780 }}>
            {words.map((w, i) => (
              <span
                key={i}
                style={{
                  marginRight: 10,
                  ...(w.accent ? { fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 44 } : {}),
                }}
              >
                {w.text}
              </span>
            ))}
          </div>
          <div style={{ fontFamily: "Geist Mono", fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: "#454b59", whiteSpace: "nowrap" }}>
            {hero.role.split(" · ")[0]}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: sans, weight: 400, style: "normal" },
        { name: "Geist", data: sansBold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
        { name: "Instrument Serif", data: serifItalic, weight: 400, style: "italic" },
      ],
    },
  );
}
