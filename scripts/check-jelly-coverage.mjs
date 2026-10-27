// Run: node scripts/check-jelly-coverage.mjs
// Advance the real simulation for three minutes with deterministic randomness.
// Drawing is stubbed; this checks that visible bells keep occupying the area.
import fs from 'node:fs';
import vm from 'node:vm';
let source=fs.readFileSync('src/components/about-jellies/ocean.js','utf8');
source=source.replace('export function createJellyfishOcean','function createJellyfishOcean').replace('  return {\n    resize,','  return {\n    advance: step, inspect: () => jellies,\n    resize,');
let failed=false;
for(const [width,height,viewHeight] of [[1380,752,752],[358,1505,700]]) {
 let seed=42;const math=Object.create(Math);math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const context=new Proxy({getImageData:()=>({data:new Uint8ClampedArray(2_000_000)}),createRadialGradient:()=>({addColorStop(){}})}, {get:(obj,key)=>obj[key]??(()=>{})});
 const canvas={getContext:()=>context};
 const sandbox={Math:math,document:{createElement:()=>canvas},window:{devicePixelRatio:1},getComputedStyle:()=>({getPropertyValue:()=>''}),requestAnimationFrame:()=>1,cancelAnimationFrame(){}};
 vm.createContext(sandbox);vm.runInContext(source+';globalThis.make=createJellyfishOcean',sandbox);
 const engine=sandbox.make({getBoundingClientRect:()=>({width,height})},canvas);engine.resize();
 if(width>=1024)engine.setPortraitAnchor(width*.16,true);
 let empty=0,maxGap=0,gap=0,missingPortrait=0;
 for(let frame=0;frame<180*60;frame++){
  engine.advance(1/60);
  if(frame%30)continue;
  if(width>=1024&&!engine.inspect().some(j=>j.portrait&&j.x>0&&j.x<width*.33&&j.y>0&&j.y<height*.4))missingPortrait++;
  const visible=engine.inspect().filter(j=>j.x+j.R>0&&j.x-j.R<width&&j.y>j.R*.15&&j.y-j.R<viewHeight).length;
  if(!visible){empty++;gap+=.5;maxGap=Math.max(maxGap,gap)}else gap=0;
 }
 const pass=maxGap===0&&missingPortrait===0;console.log(JSON.stringify({width,height,emptySamples:empty,maxEmptySeconds:maxGap,missingPortraitSamples:missingPortrait,pass}));if(!pass)failed=true;
}
if(failed)process.exitCode=1;
