// Verify section content lands below the fixed nav (desktop) or at the mobile gutter.
// Run: node scripts/check-nav.mjs http://localhost:3000/pt
// Uses Chrome's debugging protocol without additional dependencies. Each launch
// has fresh session storage; reload then checks the once-per-tab behavior.
import { spawn } from "node:child_process";
const [url = "http://localhost:3000/pt"] = process.argv.slice(2);
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
await send('Page.addScriptToEvaluateOnNewDocument',{source:`sessionStorage.setItem('intro-seen','1');const mm=window.matchMedia.bind(window);window.matchMedia=(q)=>mm(q.replace(/\\(hover: hover\\)/g,'(min-width: 0px)').replace(/\\(pointer: fine\\)/g,'(min-width: 0px)'));`});
let failed=false;
try {
 for(const [width,height] of [[1440,1000],[390,844]]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<768});
  await send('Page.navigate',{url}); await sleep(3500);
  await ev('window.scrollTo({top:innerHeight+100,behavior:"instant"})');await sleep(1700);
  for(const id of ['about','experience','work','contact']) {
   if(width<768) {
    await ev(`document.querySelector('button[aria-haspopup="dialog"]').click()`);await sleep(800);
    await ev(`document.querySelector('[role="dialog"] a[href="#${id}"]').click()`);
   }else await ev(`document.querySelector('nav a[href="#${id}"]').click()`);
   await sleep(2000);
   const result=await ev(`(()=>{const el=document.getElementById('${id}');const contentTop=el.getBoundingClientRect().top+parseFloat(getComputedStyle(el).paddingTop);const offset=innerWidth>=768?96:24;const remaining=document.documentElement.scrollHeight-innerHeight-scrollY;const expected=Math.max(offset,contentTop-remaining);return {contentTop,expected,hash:location.hash,lenis:document.documentElement.classList.contains('lenis'),pass:Math.abs(contentTop-expected)<3&&location.hash==='#${id}'}})()`);
   console.log(width,id,JSON.stringify(result));if(!result.pass)failed=true;
  }
 }
} finally {ws.close();c.kill();}
if(failed)process.exitCode=1;
