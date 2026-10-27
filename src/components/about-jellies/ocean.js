// Adapted from the user-provided Kurage Dashboard 1.0.0 by HorizonX.
// See SOURCE.md for provenance and integration notes.
/**
 * @param {HTMLElement} host
 * @param {HTMLCanvasElement} canvas
 */
export function createJellyfishOcean(host, canvas) {
  const ctx = canvas.getContext('2d');
  const off = document.createElement('canvas');
  const octx = off.getContext('2d', { willReadFrequently: true });
  if (!ctx || !octx) return null;
  const SS = 2; // offscreen samples per cell, per axis

  const RAMP = [['.', ','], ["'", '`'], [':', "'"], [';', ':'], ['o', ';'], ['t', 'o'], ['%', 't'], ['S', '%'], ['X', 'S'], ['8', 'X'], ['@', '8'], ['#', '@']];
  const FONT = getComputedStyle(host).getPropertyValue('--font-family-mono') || 'ui-monospace, monospace';

  let W = 0, H = 0, dpr = 1, cw = 10, ch = 15, cols = 0, rows = 0, ow = 0, oh = 0, fs = 11;
  let jellies = [];
  let time = 0, last = 0, acc = 0, raf = 0;
  let playing = false;
  const gain = 1;
  const pal = { a: [51, 70, 211], b: [91, 108, 255], tempo: .75, size: 1.1 };
  let dimBoxes = [];
  const pointer = { x: -1e5, y: -1e5 };
  const styles = new Map();

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
  function hash(x, y, t) {
    let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(t, 1103515245);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function contraction(p) {
    return p < .28 ? Math.sin(p / .28 * Math.PI / 2) : .5 + .5 * Math.cos((p - .28) / .72 * Math.PI);
  }

  /* ---- creatures ---- */
  function baseRadius() { return clamp(Math.min(W, H * 1.25) * .09, 48, 92); }

  function makeJelly(x, y, z) {
    const R0 = baseRadius() * (.62 + .55 * z) * (.88 + Math.random() * .24);
    const j = {
      x, y, homeX: x, homeY: y, z, R0, R: R0 * pal.size, vx: 0, vy: 0,
      theta: (Math.random() - .5) * .6, phase: Math.random(), c: 0, rush: false,
      rate: .86 + Math.random() * .28, mix: Math.random(), wander: Math.random() * 100, tents: []
    };
    const nT = 9;
    for (let i = 0; i < nT; i++) {
      j.tents.push({ u: -.92 + 1.84 * i / (nT - 1), n: 15, seg: .25, w0: .075, w1: .022, sw: .6 + Math.random() * .8, seed: Math.random() * 6.28, arm: false, pts: [] });
    }
    for (const u of [-.3, -.1, .1, .3]) {
      j.tents.push({ u, n: 10, seg: .2, w0: .17, w1: .05, sw: 1.1 + Math.random() * .5, seed: Math.random() * 6.28, arm: true, pts: [] });
    }
    resetTentacles(j);
    return j;
  }

  function resetTentacles(j) {
    const hx = Math.sin(j.theta), hy = -Math.cos(j.theta);
    for (const t of j.tents) {
      const a = anchor(j, t, 0);
      t.pts = [];
      for (let k = 0; k < t.n; k++) {
        const x = a.x - hx * k * t.seg * j.R, y = a.y - hy * k * t.seg * j.R;
        t.pts.push({ x, y, px: x, py: y });
      }
    }
  }

  function anchor(j, t, c) {
    const rx = j.R * (1 - .17 * c), ry = j.R * .8 * (1 + .1 * c);
    const lx = t.u * rx * (t.arm ? 1 : .95);
    const ly = t.arm ? ry * .05 : -ry * .03 * (1 - Math.abs(t.u));
    const cs = Math.cos(j.theta), sn = Math.sin(j.theta);
    return { x: j.x + lx * cs - ly * sn, y: j.y + lx * sn + ly * cs };
  }

  const SLOTS = [[.16, .26, 1], [.76, .62, .85], [.43, .95, .65]];
  // Hue A to hue B per jelly, so the first frame always shows both colours.
  const HUES = [.12, .9, .3, .78, .55, .04];
  function desiredCount() { return W < 600 ? 2 : 3; }

  function seedJellies() {
    jellies = [];
    const n = desiredCount();
    for (let i = 0; i < n; i++) {
      const s = W < 600 ? [[.74, .22, .9], [.6, .68, .75]][i] : SLOTS[i];
      const j = makeJelly(s[0] * W, s[1] * H, s[2]);
      j.portrait = i === 0;
      j.mix = HUES[i];
      jellies.push(j);
    }
    jellies.sort((a, b) => a.z - b.z);
  }

  function respawn(j) {
    j.y = H + j.R * (1.2 + Math.random());
    j.x = W * (.08 + Math.random() * .84);
    j.vx = 0; j.vy = 0; j.theta = (Math.random() - .5) * .5;
    j.mix = Math.random() < .5 ? Math.random() * .35 : .65 + Math.random() * .35;
    resetTentacles(j);
  }

  /* ---- simulation ---- */
  function step(dt) {
    time += dt;

    const tempo = pal.tempo;
    for (const j of jellies) {
      j.R += (j.R0 * pal.size - j.R) * Math.min(1, dt * 1.4);
      j.phase += dt * (1 / 2.6) * j.rate * tempo + (j.rush ? dt * 2.2 : 0);
      if (j.phase >= 1) { j.phase -= 1; j.rush = false; }
      const c = contraction(j.phase), dc = c - j.c;
      j.c = c;
      const hx = Math.sin(j.theta), hy = -Math.cos(j.theta);
      if (dc > 0) {
        const thrust = 62 * (.5 + .5 * j.z) * Math.sqrt(tempo);
        j.vx += hx * dc * thrust; j.vy += hy * dc * thrust;
      }
      const drag = Math.exp(-dt * 1.15);
      j.vx *= drag; j.vy *= drag;
      j.vx += Math.sin(time * .07 + j.wander) * 1.6 * dt;
      // A gentle downward current balances the average pulsing propulsion.
      // Soft restoring forces preserve the composition while allowing drift.
      const current = 62 * (.5 + .5 * j.z) * Math.sqrt(tempo) * j.rate * tempo / 2.6;
      j.vx += (j.homeX - j.x) * .12 * dt;
      j.vy += (current + (j.homeY - j.y) * .12) * dt;
      j.x += j.vx * dt; j.y += j.vy * dt;

      const want = Math.sin(time * .11 + j.wander) * .5;
      const pdx = j.x - pointer.x, pdy = j.y - pointer.y, pd = Math.hypot(pdx, pdy) || 1;
      if (pd < j.R * 2.4) {
        const push = (1 - pd / (j.R * 2.4)) * 42 * dt;
        j.vx += pdx / pd * push; j.vy += pdy / pd * push;
      }
      j.theta += (want - j.theta) * Math.min(1, dt * .32);

      if (j.y < -j.R * 4.4) respawn(j);
      else if (j.x < -j.R * 3.2) shiftJelly(j, W + j.R * 3, 0);
      else if (j.x > W + j.R * 3.2) shiftJelly(j, -W - j.R * 3, 0);
      else if (j.y > H + j.R * 6) shiftJelly(j, 0, -(H + j.R * 9));

      // tentacles: follow-the-leader chains with inertia
      const cs = Math.cos(j.theta), sn = Math.sin(j.theta);
      const trail = .42 + .25 * (1 - c);
      const sway = time * 1.5 * pal.tempo;
      for (const t of j.tents) {
        const p = t.pts, a = anchor(j, t, c), seg = t.seg * j.R;
        p[0].x = a.x; p[0].y = a.y; p[0].px = a.x; p[0].py = a.y;
        const flare = t.arm ? 0 : t.u * c * .7;
        for (let k = 1; k < p.length; k++) {
          const q = p[k], pr = p[k - 1], f = k / p.length;
          const vx = (q.x - q.px) * .88, vy = (q.y - q.py) * .88;
          q.px = q.x; q.py = q.y;
          const s = Math.sin(sway - k * .42 + t.seed) * t.sw * (.25 + f) * .55 + flare * (1 - f);
          q.x += vx - hx * trail + cs * s;
          q.y += vy - hy * trail + sn * s;
          const ex = q.x - pointer.x, ey = q.y - pointer.y, ed = ex * ex + ey * ey;
          if (ed < 12100) { const d = Math.sqrt(ed) || 1, push = (1 - d / 110) * 2.6; q.x += ex / d * push; q.y += ey / d * push; }
          const dx = q.x - pr.x, dy = q.y - pr.y, d = Math.hypot(dx, dy) || 1;
          q.x = pr.x + dx / d * seg; q.y = pr.y + dy / d * seg;
        }
      }
    }

  }

  function shiftJelly(j, dx, dy) {
    j.x += dx; j.y += dy;
    j.homeX += dx; j.homeY += dy;
    for (const t of j.tents) for (const q of t.pts) { q.x += dx; q.px += dx; q.y += dy; q.py += dy; }
  }

  /* ---- drawing (offscreen light field) ---- */
  // Channels: R = hue A weight, B = hue B weight, G = white core. Additive.
  function col(m, k, w) {
    return `rgb(${Math.min(255, (1 - m) * k * 255) | 0},${Math.min(255, w * 255) | 0},${Math.min(255, m * k * 255) | 0})`;
  }

  function drawField() {
    octx.setTransform(1, 0, 0, 1, 0, 0);
    octx.globalCompositeOperation = 'source-over';
    octx.fillStyle = '#000';
    octx.fillRect(0, 0, ow, oh);
    octx.setTransform(SS / cw, 0, 0, SS / ch, 0, 0);
    octx.globalCompositeOperation = 'lighter';
    octx.lineCap = 'round';
    octx.lineJoin = 'round';

    for (const j of jellies) {
      const k = gain * (.54 + .56 * j.z);
      const m = j.mix;

      for (const t of j.tents) {
        const p = t.pts, n = p.length;
        for (let s = 0; s < n - 1; s += 3) {
          const f = s / (n - 1);
          octx.lineWidth = lerp(t.w0, t.w1, f) * j.R;
          octx.strokeStyle = col(m, k * (t.arm ? .5 : .46) * (1 - f * .82), t.arm ? .1 * k : 0);
          octx.beginPath();
          octx.moveTo(p[s].x, p[s].y);
          for (let q = s + 1; q <= Math.min(n - 1, s + 3); q++) octx.lineTo(p[q].x, p[q].y);
          octx.stroke();
        }
      }

      const c = j.c, rx = j.R * (1 - .17 * c), ry = j.R * .8 * (1 + .1 * c);
      octx.save();
      octx.translate(j.x, j.y);
      octx.rotate(j.theta);

      octx.beginPath();
      octx.moveTo(-rx, 0);
      octx.bezierCurveTo(-rx, -ry * .58, -rx * .56, -ry, 0, -ry);
      octx.bezierCurveTo(rx * .56, -ry, rx, -ry * .58, rx, 0);
      octx.quadraticCurveTo(0, -ry * .2, -rx, 0);
      octx.closePath();
      const g = octx.createRadialGradient(0, -ry * .38, rx * .1, 0, -ry * .3, rx * 1.05);
      g.addColorStop(0, col(m, k * .34, .1 * k));
      g.addColorStop(.7, col(m, k * .42, .03 * k));
      g.addColorStop(1, col(m, k * .66, .08 * k));
      octx.fillStyle = g;
      octx.fill();
      octx.lineWidth = Math.max(5, j.R * .085);
      octx.strokeStyle = col(m, k * .55, .2 * k);
      octx.stroke();

      // four gonads: the moon-jelly clover
      octx.lineWidth = Math.max(3, j.R * .05);
      octx.strokeStyle = col(m, k * .14, .52 * k);
      for (let i = 0; i < 4; i++) {
        const ang = Math.PI / 4 + i * Math.PI / 2;
        octx.beginPath();
        octx.ellipse(Math.cos(ang) * rx * .26, -ry * .44 + Math.sin(ang) * ry * .2, rx * .14, ry * .12, ang, 0, Math.PI * 2);
        octx.stroke();
      }
      // marginal bulbs on the rim
      octx.fillStyle = col(m, k * .4, .36 * k);
      for (let i = 0; i <= 8; i++) {
        const u = -.95 + 1.9 * i / 8;
        octx.beginPath();
        octx.arc(u * rx, -ry * .03 * (1 - Math.abs(u)), Math.max(2.5, j.R * .034), 0, Math.PI * 2);
        octx.fill();
      }
      octx.restore();
    }
  }

  /* ---- drawing (glyph grid) ---- */
  function style(tb, lv, wb) {
    const key = (tb * 12 + lv) * 3 + wb;
    let s = styles.get(key);
    if (s) return s;
    const t = tb / 5, L = (lv + .5) / 12, w = [0, .3, .62][wb];
    const base = [0, 1, 2].map(i => lerp(pal.a[i], pal.b[i], t));
    // Pale indigo tiles and darker etched glyphs on the portfolio's light canvas.
    const opacity = Math.min(.72, .25 + L * .38 + w * .12);
    s = {
      tile: `rgba(${base.join(',')},${(.035 + L * .17).toFixed(3)})`,
      glyph: `rgba(${base.map(v => Math.round(v * .66)).join(',')},${opacity.toFixed(3)})`
    };
    styles.set(key, s);
    return s;
  }

  function render() {
    if (!W) return;
    drawField();
    const d = octx.getImageData(0, 0, ow, oh).data;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.font = `500 ${fs}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const ty = ch / 2 + .5, tx = cw / 2;

    const tickRate = 1.4;
    const row = ow * 4;
    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const i = (cy * SS * ow + cx * SS) * 4;
        const a = (d[i] + d[i + 4] + d[i + row] + d[i + row + 4]) / 1020;
        const w = (d[i + 1] + d[i + 5] + d[i + row + 1] + d[i + row + 5]) / 1020;
        const b = (d[i + 2] + d[i + 6] + d[i + row + 2] + d[i + row + 6]) / 1020;
        const L = Math.min(1, a + b + w * .55);
        if (L < .055) continue;
        const tb = Math.round(b / (a + b + 1e-4) * 5);
        const lv = Math.min(11, (L * 12) | 0);
        const wb = w < .12 ? 0 : w < .32 ? 1 : 2;
        const st = style(tb, lv, wb);
        const x = cx * cw, y = cy * ch;
        let dim = 1;
        for (const box of dimBoxes) {
          const distance = Math.hypot(Math.max(box.left - x, 0, x - box.right), Math.max(box.top - y, 0, y - box.bottom));
          dim = Math.min(dim, .08 + .92 * Math.min(1, distance / 36));
        }
        ctx.globalAlpha = dim;
        if (lv >= 1) { ctx.fillStyle = st.tile; ctx.fillRect(x + 1, y + 1, cw - 2, ch - 2); }
        const tick = Math.floor(time * tickRate + ((cx * 7 + cy * 13) & 15) / 16);
        const h = hash(cx, cy, tick);
        ctx.fillStyle = st.glyph;
        ctx.fillText(RAMP[lv][h < .55 ? 0 : 1], x + tx, y + ty);
      }
    }
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (!last) { last = now; return; }
    acc += Math.min((now - last) / 1000, .1);
    last = now;
    // Account for rAF timestamp rounding so 60Hz screens draw every two frames.
    if (acc < 1 / 30 - .0005) return;
    const n = Math.max(1, Math.min(6, Math.round(acc * 60))), h = acc / n;
    for (let i = 0; i < n; i++) step(h);
    acc = 0;
    render();
  }
  function sync() {
    const should = playing && W > 0;
    if (should && !raf) { last = 0; acc = 0; raf = requestAnimationFrame(loop); }
    else if (!should && raf) { cancelAnimationFrame(raf); raf = 0; }
  }
  function resize() {
    const rect = host.getBoundingClientRect();
    const nW = Math.round(rect.width), nH = Math.round(rect.height);
    if (!nW || !nH || (nW === W && nH === H)) return;
    const sx = W ? nW / W : 1, sy = H ? nH / H : 1, first = !W;
    W = nW; H = nH;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cw = W < 600 ? 8 : 10;
    ch = Math.round(cw * 1.4);
    fs = Math.round(ch * .74);
    cols = Math.ceil(W / cw); rows = Math.ceil(H / ch);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ow = cols * SS; oh = rows * SS;
    off.width = ow; off.height = oh;
    if (first) {
      seedJellies();
      for (let i = 0; i < 200; i++) step(1 / 60);
    } else {
      for (const jelly of jellies) shiftJelly(jelly, jelly.x * (sx - 1), jelly.y * (sy - 1));
      const count = desiredCount();
      while (jellies.length > count) jellies.pop();
      while (jellies.length < count) jellies.push(makeJelly(W * .5, H * .8, .65));
    }
    render();
    sync();
  }
  return {
    resize,
    // Keep the principal jelly centered under the actual portrait, with its
    // bell below the top fade instead of deep down in the empty column.
    setPortraitAnchor(x, belowPhoto) {
      const jelly = jellies.find(j => j.portrait);
      if (!jelly) return;
      const y = belowPhoto ? Math.max(H * .12 + jelly.R, jelly.R * 1.65) : H * .22;
      shiftJelly(jelly, x - jelly.homeX, y - jelly.homeY);
    },
    setContentBoxes(boxes) { dimBoxes = boxes; if (!playing) render(); },
    setPointer(x, y) { pointer.x = x; pointer.y = y; },
    setPlaying(value) { playing = value; sync(); },
    destroy() { playing = false; cancelAnimationFrame(raf); raf = 0; }
  };
}
