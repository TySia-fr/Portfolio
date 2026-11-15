"use client";

import { useEffect } from "react";

/**
 * One pointer listener for the whole site. Elements opt in with data-fx:
 *
 *   spot    light follows the pointer (--mx, --my in px)
 *   card    light + a slight 3D tilt of its .card-media (--mx, --my, --rx, --ry)
 *   magnet  leans a few pixels towards the pointer (--tx, --ty)
 *
 * Only CSS custom properties on the element under the pointer change, once
 * per animation frame; CSS does the rest with transforms and gradients.
 * Nothing runs with prefers-reduced-motion. Touch works the same while a
 * finger moves.
 */
const PROPS = ["--mx", "--my", "--rx", "--ry", "--tx", "--ty"];

export function PointerFx() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let event: PointerEvent | null = null;
    const active = new Set<HTMLElement>();

    function apply() {
      frame = 0;
      if (!event) return;
      const target = event.target instanceof Element ? event.target : null;
      const hits = new Set<HTMLElement>();
      for (let el = target?.closest<HTMLElement>("[data-fx]"); el;) {
        hits.add(el);
        el = el.parentElement?.closest<HTMLElement>("[data-fx]") ?? null;
      }
      for (const el of active) {
        if (!hits.has(el)) {
          PROPS.forEach((prop) => el.style.removeProperty(prop));
          el.removeAttribute("data-fx-on");
          active.delete(el);
        }
      }
      for (const el of hits) {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const fx = el.dataset.fx;
        el.style.setProperty("--mx", `${x.toFixed(1)}px`);
        el.style.setProperty("--my", `${y.toFixed(1)}px`);
        // -1 … 1 from the element's centre.
        const nx = (x / rect.width) * 2 - 1;
        const ny = (y / rect.height) * 2 - 1;
        if (fx === "card") {
          el.style.setProperty("--rx", `${(nx * 3).toFixed(2)}deg`);
          el.style.setProperty("--ry", `${(-ny * 3).toFixed(2)}deg`);
        } else if (fx === "magnet") {
          el.style.setProperty("--tx", `${(nx * 4).toFixed(1)}px`);
          el.style.setProperty("--ty", `${(ny * 3).toFixed(1)}px`);
        }
        el.setAttribute("data-fx-on", "");
        active.add(el);
      }
    }

    function onMove(next: PointerEvent) {
      event = next;
      if (!frame) frame = requestAnimationFrame(apply);
    }
    function onLeave() {
      event = null;
      for (const el of active) {
        PROPS.forEach((prop) => el.style.removeProperty(prop));
        el.removeAttribute("data-fx-on");
      }
      active.clear();
    }
    const onUp = (up: PointerEvent) => {
      if (up.pointerType !== "mouse") onLeave();
    };

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, []);

  return null;
}
