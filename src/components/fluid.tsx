import Script from "next/script";

// public/fluid.js creates and owns its fixed <canvas id="fluid-canvas">, so
// React remounts (e.g. switching locale) never tear down the WebGL context.
// Loaded after the page is interactive: the hero paints first on
// --color-bg-primary, which matches the fluid's background colour.
export default function FluidBackground() {
  return <Script src="/fluid.js" strategy="lazyOnload" />;
}
