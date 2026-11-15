"use client";

import { useEffect, useRef } from "react";

/**
 * "404" drawn in square pixels, like the "si" monogram. The pixels assemble
 * once when the page opens, scatter away from the pointer (or a finger) and
 * spring back. One yellow pixel, the logo's signal square, has lost its way
 * and drifts around the digits, avoiding the pointer.
 *
 * Decorative only: the page's heading says the same thing in words.
 * With prefers-reduced-motion, the digits are drawn once, still.
 */
const GLYPHS: Record<string, readonly string[]> = {
  "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  "0": [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
};
const TEXT = "404";
const ROWS = 7;
const COLS = TEXT.length * 5 + (TEXT.length - 1); // one empty column between digits

type Pixel = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Frames to wait before flying home: the digits assemble in a ripple. */
  wait: number;
};

function layoutPixels(): { col: number; row: number }[] {
  const cells: { col: number; row: number }[] = [];
  [...TEXT].forEach((char, index) => {
    const glyph = GLYPHS[char]!;
    glyph.forEach((line, row) => {
      [...line].forEach((mark, col) => {
        if (mark === "#") cells.push({ col: index * 6 + col, row });
      });
    });
  });
  return cells;
}

export function LostSignal({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const styles = getComputedStyle(document.documentElement);
    const ink = styles.getPropertyValue("--color-text").trim() || "#e8e6e0";
    const signal = styles.getPropertyValue("--color-signal").trim() || "#e9b44c";

    const cells = layoutPixels();
    let pixels: Pixel[] = [];
    let cell = 0;
    let gap = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: -1e4, y: -1e4 };
    const lost = { x: 0, y: 0, vx: 0, vy: 0, t: Math.random() * 100 };
    let frame = 0;
    let visible = true;
    let first = true;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);

      cell = Math.floor(Math.min((width * 0.9) / COLS, (height * 0.8) / ROWS));
      gap = Math.max(1, Math.round(cell * 0.12));
      const ox = Math.round((width - cell * COLS) / 2);
      const oy = Math.round((height - cell * ROWS) / 2);

      pixels = cells.map(({ col, row }, index) => {
        const hx = ox + col * cell;
        const hy = oy + row * cell;
        const previous = pixels[index];
        if (previous && !first) return { ...previous, hx, hy };
        // First layout: start scattered, so the digits assemble once.
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.max(width, height) * (0.35 + Math.random() * 0.4);
        return reduced
          ? { hx, hy, x: hx, y: hy, vx: 0, vy: 0, wait: 0 }
          : {
              hx,
              hy,
              x: width / 2 + Math.cos(angle) * distance,
              y: height / 2 + Math.sin(angle) * distance,
              vx: 0,
              vy: 0,
              wait: Math.round(col * 2.2 + Math.random() * 14),
            };
      });
      if (first) {
        lost.x = ox + cell * (COLS + 0.5);
        lost.y = oy - cell * 0.5;
      }
      first = false;
      if (reduced) draw();
    }

    function draw() {
      context!.clearRect(0, 0, width, height);
      context!.fillStyle = ink;
      const size = cell - gap;
      for (const p of pixels) context!.fillRect(p.x, p.y, size, size);
      context!.fillStyle = signal;
      const lx = reduced ? pixels[0]!.hx + cell * (COLS + 0.4) - cell : lost.x;
      const ly = reduced ? pixels[0]!.hy - cell * 3.6 : lost.y;
      context!.fillRect(lx, ly, size, size);
    }

    function step() {
      const radius = cell * 3;
      for (const p of pixels) {
        if (p.wait > 0) {
          p.wait--;
          continue;
        }
        const dx = p.x + cell / 2 - pointer.x;
        const dy = p.y + cell / 2 - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < radius && distance > 0.01) {
          const push = ((radius - distance) / radius) * 2.4;
          p.vx += (dx / distance) * push;
          p.vy += (dy / distance) * push;
        }
        p.vx = (p.vx + (p.hx - p.x) * 0.06) * 0.84;
        p.vy = (p.vy + (p.hy - p.y) * 0.06) * 0.84;
        p.x += p.vx;
        p.y += p.vy;
      }

      // The lost pixel wanders on a slow, never-repeating loop around the digits.
      lost.t += 0.006;
      const cx = width / 2 + Math.sin(lost.t * 1.3) * cell * COLS * 0.55;
      const cy = height / 2 + Math.sin(lost.t * 2.1 + 1) * cell * ROWS * 0.62;
      lost.vx += (cx - lost.x) * 0.004;
      lost.vy += (cy - lost.y) * 0.004;
      const fx = lost.x - pointer.x;
      const fy = lost.y - pointer.y;
      const near = Math.hypot(fx, fy);
      if (near < cell * 5 && near > 0.01) {
        lost.vx += (fx / near) * 1.2;
        lost.vy += (fy / near) * 1.2;
      }
      lost.vx *= 0.92;
      lost.vy *= 0.92;
      lost.x += lost.vx;
      lost.y += lost.vy;
      // Never leave the canvas: on narrow screens the loop is wider than the room.
      const edge = cell - gap;
      if (lost.x < 0 || lost.x > width - edge) {
        lost.x = Math.min(Math.max(lost.x, 0), width - edge);
        lost.vx *= -0.5;
      }
      if (lost.y < 0 || lost.y > height - edge) {
        lost.y = Math.min(Math.max(lost.y, 0), height - edge);
        lost.vy *= -0.5;
      }
    }

    function loop() {
      step();
      draw();
      frame = visible ? requestAnimationFrame(loop) : 0;
    }

    function onPointer(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }
    function onLeave() {
      pointer.x = -1e4;
      pointer.y = -1e4;
    }

    resize();
    const resizer = new ResizeObserver(resize);
    resizer.observe(canvas);
    if (reduced) return () => resizer.disconnect();

    // Stop drawing while the canvas is off screen or the tab is hidden.
    const watcher = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting) && !document.hidden;
      if (visible && !frame) frame = requestAnimationFrame(loop);
    });
    watcher.observe(canvas);
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible && !frame) frame = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    // A finger lifted leaves no pointer behind; a mouse stays where it is.
    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") onLeave();
    };
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      watcher.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`block ${className}`} />;
}
