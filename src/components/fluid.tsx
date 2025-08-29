"use client";
import { useEffect } from "react";

export default function FluidBackground() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/fluid.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <canvas
      id="fluid-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
      }}
    />
  );
}