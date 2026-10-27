// Run against a production server: node scripts/check-intro.mjs http://localhost:3000/pt
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
await send("Page.addScriptToEvaluateOnNewDocument", { source: `
window.__introFrames=[];
function sample(){
 const sheet=document.querySelector('.preloader');
 const hero=document.querySelector('#top > div');
 const fluid=document.querySelector('#fluid-canvas');
 if(hero) __introFrames.push({
   time:performance.now(),
   intro:document.documentElement.dataset.intro,
   sheet:sheet&&getComputedStyle(sheet).display!=='none'?Number(getComputedStyle(sheet).opacity):0,
   hero:Number(getComputedStyle(hero).opacity),
   fluid:!!fluid&&getComputedStyle(fluid).visibility==='visible'
 });
 requestAnimationFrame(sample);
}requestAnimationFrame(sample);` });
let failed = false;
try {
 for (const mode of ['first-visit', 'reload', 'reduced-motion']) {
  if(mode==='reduced-motion') {
   await ev("sessionStorage.clear()");
   await send('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  }
  if(mode==='first-visit') await send('Page.navigate',{url});
  else await send('Page.reload');
  await sleep(5000);
  const frames=await ev('window.__introFrames');
  const revealStart=frames?.find(f=>f.intro==='done')?.time;
  // Inspect the 800ms sheet exit, before the landscape's longer zoom settles.
  const gaps=frames?.filter(f=>f.intro==='done'&&f.time-revealStart<800&&f.sheet<0.5&&f.hero<0.1&&f.fluid)??[];
  const end=frames?.at(-1);
  const expected=mode==='first-visit'?'done':'skip';
  const pending=frames?.some(f=>f.intro==='pending'&&f.sheet===1);
  const pass=!!end&&end.intro===expected&&end.hero>0.99&&gaps.length===0&&(mode!=='first-visit'||pending);
  console.log(JSON.stringify({mode,pass,frames:frames?.length??0,exposedFluidFrames:gaps.length,final:end}));
  if(!pass) failed=true;
 }
} finally {
 ws.close(); c.kill();
}
if(failed) process.exitCode=1;
