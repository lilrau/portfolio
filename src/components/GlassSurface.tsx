"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type Ref,
} from "react";
import { useClientValue } from "../lib/useClient";

/*
 * Liquid glass surface.
 *
 * Layers (back to front):
 *   backdrop  — refracts what is behind (SVG displacement, Chromium only) or blurs it
 *   core      — soft tinted centre; carries text contrast (see DESIGN_TOKENS.md)
 *   specular  — rim light, top highlight, inner shade
 *   content
 *
 * Refraction happens in the bezel: near the edge the backdrop is sampled
 * further inward, like light bending through the rounded edge of a lens.
 * The centre stays undistorted and tinted so text reads cleanly.
 */

type Variant = "pill" | "panel" | "lens" | "strong";

const VARIANTS: Record<
  Variant,
  { radius: number; bezel: number; scaleVar: string; core: string | null; refract: boolean }
> = {
  pill: { radius: 999, bezel: 14, scaleVar: "--glass-refraction", core: "var(--glass-tint)", refract: true },
  strong: { radius: 999, bezel: 14, scaleVar: "--glass-refraction", core: "var(--glass-tint-strong)", refract: false },
  panel: { radius: 32, bezel: 28, scaleVar: "--glass-refraction", core: "var(--glass-tint)", refract: false },
  lens: { radius: 999, bezel: 0.5, scaleVar: "--glass-refraction-lens", core: null, refract: false },
};
// Why refraction is limited to pills: backdrop-filter:url(#svg) leaves Chromium's
// GPU filter path, so every refracting surface re-renders its backdrop on each
// frame the content behind it moves. Measured on an Iris Xe (scroll + pointer):
// refraction everywhere ≈36 fps; panels/nav/lens on blur, pills refracting ≈60 fps.

type GlassSurfaceProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  /** Corner radius in px; defaults per variant (pills clamp to half the height). */
  radius?: number;
  /** Adds the springy press state. */
  interactive?: boolean;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** Merged with the internal ref used to measure the surface. */
  ref?: Ref<HTMLElement>;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "style" | "children">;

// ── Refraction support ──────────────────────────────────────────────
// backdrop-filter:url() only renders in Chromium; Safari drops the whole
// declaration (so no blur either) and Firefox ignores the url(). Decided
// after mount to keep server and client markup identical.
let refractionSupport: boolean | null = null;
function supportsRefraction() {
  if (refractionSupport !== null) return refractionSupport;
  const nav = navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } };
  const brands = nav.userAgentData?.brands?.map((b) => b.brand) ?? [];
  const chromium =
    brands.some((b) => /Chromium|Google Chrome|Microsoft Edge/.test(b)) ||
    (/Chrome\//.test(navigator.userAgent) && !/Edg\/|OPR\/|Firefox\//.test(navigator.userAgent));
  refractionSupport = chromium && CSS.supports("backdrop-filter", "url(#a)");
  return refractionSupport;
}

// ── Displacement map ────────────────────────────────────────────────
const mapCache = new Map<string, string>();

function displacementMap(w: number, h: number, r: number, bezel: number) {
  const key = `${w}x${h}r${r}b${bezel}`;
  const cached = mapCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(w, h);
  const data = img.data;
  const hx = w / 2;
  const hy = h / 2;

  // Everything deeper than the bezel is neutral (no displacement): fill it in
  // one go and only walk the band along the edges (corners need max(bezel, r)).
  new Uint32Array(data.buffer).fill(0xff808080);
  const band = Math.ceil(Math.max(bezel, r));

  for (let y = 0; y < h; y++) {
    const fullRow = y < band || y >= h - band;
    for (let x = 0; x < w; x++) {
      if (!fullRow && x === band && w - band > band) x = w - band;
      // Signed distance to the rounded rect (negative inside).
      const px = x + 0.5 - hx;
      const py = y + 0.5 - hy;
      const qx = Math.abs(px) - (hx - r);
      const qy = Math.abs(py) - (hy - r);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const outside = Math.hypot(ox, oy);
      const d = outside + Math.min(Math.max(qx, qy), 0) - r;
      const depth = -d; // distance from the edge, inward

      let dx = 0;
      let dy = 0;
      if (depth > 0 && depth < bezel) {
        // Outward normal of the nearest edge.
        let nx: number;
        let ny: number;
        if (qx > 0 && qy > 0) {
          nx = (ox / outside) * Math.sign(px);
          ny = (oy / outside) * Math.sign(py);
        } else if (qx > qy) {
          nx = Math.sign(px);
          ny = 0;
        } else {
          nx = 0;
          ny = Math.sign(py);
        }
        // Convex profile: strongest bend at the rim, fading to zero inside.
        const t = 1 - depth / bezel;
        const mag = t * t;
        dx = -nx * mag;
        dy = -ny * mag;
      }

      const i = (y * w + x) * 4;
      data[i] = 128 + dx * 127;
      data[i + 1] = 128 + dy * 127;
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const url = canvas.toDataURL();
  mapCache.set(key, url);
  return url;
}

const requestIdle = (cb: () => void): number =>
  typeof window.requestIdleCallback === "function"
    ? window.requestIdleCallback(cb, { timeout: 600 })
    : window.setTimeout(cb, 50);
const cancelIdle = (handle: number) =>
  typeof window.cancelIdleCallback === "function" ? window.cancelIdleCallback(handle) : window.clearTimeout(handle);

function readNumberVar(name: string, fallback: number) {
  const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isNaN(value) ? fallback : value;
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function GlassSurface<T extends ElementType = "div">({
  as,
  variant = "pill",
  radius,
  interactive = false,
  className = "",
  contentClassName = "",
  style,
  children,
  ref: externalRef,
  ...rest
}: GlassSurfaceProps<T>) {
  const Component: ElementType = as ?? "div";
  const spec = VARIANTS[variant];
  const ref = useRef<HTMLElement>(null);
  const filterId = `glass-${useId().replace(/:/g, "")}`;
  const refract = useClientValue(supportsRefraction, false) && spec.refract;
  const [map, setMap] = useState<{ url: string; w: number; h: number; scale: number } | null>(null);

  useIsoLayoutEffect(() => {
    if (!refract || !ref.current) return;
    const el = ref.current;

    const build = () => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      if (!w || !h) return;
      const r = Math.min(radius ?? spec.radius, w / 2, h / 2);
      // Lens bezel is a fraction of its radius; others are absolute px.
      const bezel = spec.bezel < 1 ? r * spec.bezel * 2 : Math.min(spec.bezel, r, w / 2, h / 2);
      const scale = readNumberVar(spec.scaleVar, 40);
      setMap({ url: displacementMap(w, h, Math.round(r), Math.round(bezel)), w, h, scale });
    };

    // Map generation is a per-pixel JS loop (≈0.5M px for a card); run it when
    // the browser is idle so hydration isn't one long task. The blur fallback
    // shows until then.
    let handle = 0;
    const schedule = () => {
      cancelIdle(handle);
      handle = requestIdle(build);
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    return () => {
      cancelIdle(handle);
      ro.disconnect();
    };
  }, [refract, radius, spec]);

  const cornerRadius = radius ?? spec.radius;
  const backdrop =
    refract && map
      ? `url(#${filterId}) blur(var(--glass-blur-refract)) saturate(var(--glass-saturate))`
      : "blur(var(--glass-blur)) saturate(var(--glass-saturate))";

  return (
    <Component
      ref={(node: HTMLElement | null) => {
        ref.current = node;
        if (typeof externalRef === "function") externalRef(node);
        else if (externalRef) externalRef.current = node;
      }}
      className={`relative isolate ${interactive ? "transition-transform duration-[var(--duration-normal)] ease-spring active:scale-[0.97]" : ""} ${className}`}
      style={{ borderRadius: cornerRadius, ...style }}
      {...rest}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
        style={{
          backdropFilter: backdrop,
          // Chromium aliases the prefixed property, so it would override the
          // url() filter; only Safari needs it, and only for the blur fallback.
          ...(refract ? {} : { WebkitBackdropFilter: backdrop }),
          background: spec.core ? "var(--glass-edge-tint)" : "var(--glass-tint-subtle)",
        }}
      />
      {spec.core && (
        <span
          aria-hidden
          className="pointer-events-none absolute -z-10 rounded-[inherit]"
          style={{
            // Leaves a clear ring over the bezel where the refraction shows.
            inset: spec.bezel * 0.6,
            background: spec.core,
            filter: `blur(${Math.min(spec.bezel * 0.35, 10)}px)`,
          }}
        />
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
        style={{
          background:
            "linear-gradient(180deg, var(--glass-highlight) 0%, transparent 38%) top / 100% 100% no-repeat",
          opacity: 0.35,
        }}
      />
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] shadow-glass" />

      {contentClassName ? <span className={contentClassName}>{children}</span> : children}

      {refract && map && (
        <svg aria-hidden width="0" height="0" className="absolute" focusable="false">
          <filter
            id={filterId}
            x="0"
            y="0"
            width={map.w}
            height={map.h}
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage href={map.url} x="0" y="0" width={map.w} height={map.h} result="map" preserveAspectRatio="none" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={map.scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      )}
    </Component>
  );
}
