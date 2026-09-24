// Scroll-performance regression check with the real GPU.
//   pnpm build && pnpm start   (another terminal)
//   node scripts/bench-scroll.mjs http://localhost:3000/en [variant]
// Drives mouse moves (fluid + glass lens) and wheel scrolling (Lenis) for 6s and
// reports frame cadence. Healthy: fps ≈ 60, p95 ≈ 16.7 ms, over50ms ≈ 0.
// Variants disable one suspect by injection: no-fluid, no-backdrop,
// no-refraction, no-halo, no-cursor, no-glass-all.
// CHROME=/path/to/chrome overrides the browser (defaults to Playwright's headless shell).
import { spawn } from "node:child_process";
const [url, variant = "baseline"] = process.argv.slice(2);
const B = process.env.CHROME ?? `${process.env.HOME}/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell`;
const port = 9700 + Math.floor(Math.random() * 250);
const c = spawn(B, ["--headless", "--no-sandbox", "--use-angle=gl-egl", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", `--remote-debugging-port=${port}`, "--window-size=1920,1080", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 150 && !t; i++) { await sleep(150); try { t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === "page"); } catch {} }
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const P = new Map(); ws.onmessage = (m) => { const d = JSON.parse(m.data); if (P.has(d.id)) { P.get(d.id)(d); P.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; P.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => (await send("Runtime.evaluate", { expression: e, awaitPromise: true, returnByValue: true })).result.result?.value;
await send("Page.enable"); await send("Network.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1.25, mobile: false });
const css = {
  "no-backdrop": `*,*::before,*::after{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}`,
  "no-halo": `main,footer{text-shadow:none!important}`,
  "no-cursor": `.fixed.top-0.left-0.pointer-events-none{display:none!important}`,
  "no-glass-all": `*,*::before,*::after{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}main,footer{text-shadow:none!important}.fixed.top-0.left-0.pointer-events-none{display:none!important}`,
}[variant];
let pre = `sessionStorage.setItem('intro-seen','1');{const o=window.matchMedia.bind(window);window.matchMedia=(q)=>o(q.replace(/\(hover: hover\)/g,'(min-width: 0px)').replace(/\(pointer: fine\)/g,'(min-width: 0px)'))}`;
if (css) pre += `document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(css)};document.head.appendChild(s)});`;
if (variant === "no-refraction") pre += `{const o=CSS.supports.bind(CSS);CSS.supports=(p,v)=>String(v??p).includes('url(')?false:o(p,v)}`;
await send("Page.addScriptToEvaluateOnNewDocument", { source: pre });
if (variant === "no-fluid") await send("Network.setBlockedURLs", { urls: ["*fluid.js"] });
await send("Page.navigate", { url }); await sleep(4000);
await ev(`window.__fluid && window.__fluid.burst(20)`); await sleep(800);
// Page measures frame cadence; Node drives real input (mouse moves feed the fluid
// and the glass lens, wheel goes through Lenis) like a person reading the page.
await ev(`window.__deltas = []; (() => { let last = performance.now(); const tick = (now) => { __deltas.push(now - last); last = now; if (!window.__stop) requestAnimationFrame(tick); }; requestAnimationFrame(tick); })()`);
const t0 = Date.now(); let k = 0;
while (Date.now() - t0 < 6000) {
  k++;
  const x = 960 + Math.sin(k / 9) * 600, y = 540 + Math.cos(k / 7) * 300;
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, pointerType: "mouse" });
  if (k % 3 === 0) await send("Input.dispatchMouseEvent", { type: "mouseWheel", x, y, deltaX: 0, deltaY: 120 });
  await sleep(16);
}
const res = await ev(`(() => { window.__stop = true; const d = __deltas.slice(1).sort((a,b)=>a-b); const avg = d.reduce((a,b)=>a+b,0)/d.length;
  return { frames: d.length, fps: +(1000/avg).toFixed(1), p50: +d[Math.floor(d.length*0.5)].toFixed(1), p95: +d[Math.floor(d.length*0.95)].toFixed(1), over50ms: d.filter(x=>x>50).length, lenis: document.documentElement.classList.contains('lenis'), cursor: document.documentElement.classList.contains('has-glass-cursor'), scrolled: Math.round(scrollY) }; })()`);
console.log(variant.padEnd(14), JSON.stringify(res));
ws.close(); c.kill();
