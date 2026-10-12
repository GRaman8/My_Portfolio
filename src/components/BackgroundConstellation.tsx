"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function BackgroundConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const context = cv.getContext("2d");
    if (!context) return;
    // Non-null bindings (TS drops narrowing inside the closures below).
    const canvas: HTMLCanvasElement = cv;
    const ctx: CanvasRenderingContext2D = context;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999 };
    let points: Point[] = [];
    let rafId = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initPoints() {
      const count = Math.min(60, Math.floor(window.innerWidth / 24));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
    }

    // Red, theme-aware: brighter red on dark bg, deeper red on light bg
    function redRgb() {
      return document.documentElement.classList.contains("dark")
        ? "248, 80, 80"
        : "220, 38, 38";
    }

    function draw() {
      const c = redRgb();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of points) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c}, 0.7)`;
        ctx.fill();
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = `rgba(${c}, ${0.18 * (1 - d / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        const mdx = points[i].x - mouse.x;
        const mdy = points[i].y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 160) {
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${c}, ${0.35 * (1 - md / 160)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // When reduced motion is requested, render a single static frame.
      if (!reduce) rafId = requestAnimationFrame(draw);
    }

    function handleMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function handleResize() {
      resize();
      initPoints();
    }

    resize();
    initPoints();
    draw();
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
