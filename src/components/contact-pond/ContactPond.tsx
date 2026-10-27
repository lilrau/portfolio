"use client";

import { useEffect, useRef } from "react";
import { KoiRenderer } from "./renderer";
import { World, type Box } from "./world";

const STEP = 1 / 60;
const CONTROLS = "a, button, input, textarea, select, [role='button']";

export default function ContactPond() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest("section");
    if (!canvas || !section || !canvas.getContext("2d")) return;

    const renderer = new KoiRenderer(canvas);
    const world = new World();
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    let last = 0;
    let accumulator = 0;
    let measuredAt = 0;
    let pointerTime = 0;

    const measureContent = () => {
      const origin = canvas.getBoundingClientRect();
      const boxes: Box[] = Array.from(section.querySelectorAll("[data-pond-content]"), (element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left - origin.left, top: rect.top - origin.top, right: rect.right - origin.left, bottom: rect.bottom - origin.top };
      });
      world.avoid = boxes;
      renderer.setDimBoxes(boxes);
    };

    const draw = (now: number) => {
      const elapsed = Math.min((now - last) / 1000, 0.066);
      last = now;
      accumulator += elapsed;
      let steps = 0;
      while (accumulator >= STEP && steps < 4) {
        world.step(STEP);
        accumulator -= STEP;
        steps++;
      }
      if (now - measuredAt > 500) {
        measureContent();
        measuredAt = now;
      }
      renderer.render(world, elapsed);
      frame = requestAnimationFrame(draw);
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!visible || document.hidden) return;
      measureContent();
      if (motion.matches) {
        renderer.render(world, STEP);
        return;
      }
      last = performance.now();
      accumulator = 0;
      frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.resize(rect.width, rect.height, Math.min(devicePixelRatio || 1, 2));
      world.resize(rect.width, rect.height);
      measureContent();
      // Settle the initial arrangement before the section comes into view.
      if (world.time === 0) for (let i = 0; i < 180; i++) world.step(STEP);
      renderer.render(world, STEP);
      sync();
    };

    const local = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return { x, y, inside: x >= 0 && x <= rect.width && y >= 0 && y <= rect.height };
    };
    const leave = () => { world.pointer.active = false; world.pointer.speed = 0; };
    const move = (event: PointerEvent) => {
      if (!visible || motion.matches || event.pointerType !== "mouse") return;
      const { x, y, inside } = local(event);
      if (!inside) { leave(); return; }
      const elapsed = Math.max(16, event.timeStamp - pointerTime) / 1000;
      world.pointer.speed = world.pointer.active ? Math.min(5000, Math.hypot(x - world.pointer.x, y - world.pointer.y) / elapsed) : 0;
      Object.assign(world.pointer, { x, y, active: true });
      pointerTime = event.timeStamp;
    };
    const feed = (event: MouseEvent) => {
      if (!visible || motion.matches || event.button !== 0 || window.getSelection()?.toString()) return;
      if (event.composedPath().some((element) => element instanceof Element && element.matches(CONTROLS))) return;
      const { x, y, inside } = local(event);
      if (inside) world.feed(x, y);
    };

    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    const resizer = new ResizeObserver(resize);
    observer.observe(canvas);
    resizer.observe(canvas);
    resizer.observe(section);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", leave);
    section.addEventListener("click", feed);
    window.addEventListener("blur", leave);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
      section.removeEventListener("click", feed);
      window.removeEventListener("blur", leave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />;
}
