"use client";

import { useEffect, useRef } from "react";
import { createJellyfishOcean } from "./ocean";

export default function AboutJellies() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const region = host?.parentElement;
    if (!host || !canvas || !region) return;
    const ocean = createJellyfishOcean(host, canvas);
    if (!ocean) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    const sync = () => ocean.setPlaying(visible && !document.hidden && !reduce.matches);
    const measure = () => {
      const origin = region.getBoundingClientRect();
      const photo = region.querySelector("[data-about-portrait]")?.getBoundingClientRect();
      const stack = region.querySelector("[data-about-stack]")?.getBoundingClientRect();
      const top = innerWidth >= 1024 && photo ? photo.bottom - origin.top + 16 : stack ? stack.top - origin.top - 140 : 0;
      host.style.top = `${Math.max(0, top)}px`;
      ocean.resize();
      const bounds = host.getBoundingClientRect();
      const belowPhoto = innerWidth >= 1024 && !!photo;
      const anchorX = belowPhoto ? photo.left + photo.width / 2 - bounds.left : bounds.width * .74;
      ocean.setPortraitAnchor(anchorX, belowPhoto);
      const boxes = Array.from(region.querySelectorAll("[data-jelly-content]"), (element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left - bounds.left, top: rect.top - bounds.top, right: rect.right - bounds.left, bottom: rect.bottom - bounds.top };
      });
      ocean.setContentBoxes(boxes);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduce.matches) return;
      const rect = host.getBoundingClientRect();
      ocean.setPointer(event.clientX - rect.left, event.clientY - rect.top);
    };
    const leave = () => ocean.setPointer(-100000, -100000);
    const resize = new ResizeObserver(measure);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    resize.observe(region);
    resize.observe(host);
    const portrait = region.querySelector("[data-about-portrait]");
    if (portrait) resize.observe(portrait);
    intersection.observe(host);
    reduce.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    region.addEventListener("pointermove", move, { passive: true });
    region.addEventListener("pointerleave", leave);
    window.addEventListener("resize", measure);
    measure();

    return () => {
      ocean.destroy();
      resize.disconnect();
      intersection.disconnect();
      reduce.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      region.removeEventListener("pointermove", move);
      region.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
}
