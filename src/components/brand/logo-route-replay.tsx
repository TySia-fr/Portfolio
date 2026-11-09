"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

const ATTRIBUTE = "data-logo-route";

/**
 * Replays the short logo trace (<LogoRouteIntro />) on every page change.
 *
 * The root layout is not remounted when navigating, so this watches the path
 * and restarts the CSS animation by toggling an attribute on <html>: the layer
 * goes display:none, which resets its animations, then shows again. It runs in
 * a layout effect, after React has put the new page in the DOM but before the
 * browser paints it, so the new page never flashes before the trace covers it.
 * Hard page loads are handled by LogoSessionGate before hydration.
 */
export function LogoRouteReplay() {
  const pathname = usePathname();
  const previous = useRef(pathname);

  useLayoutEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.setAttribute("data-logo-played", "");
    root.removeAttribute(ATTRIBUTE);
    void root.offsetWidth; // apply the reset before showing it again
    root.setAttribute(ATTRIBUTE, "");
  }, [pathname]);

  // Any interaction skips it at once.
  useEffect(() => {
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    const options = { capture: true, passive: true };
    const skip = () => document.documentElement.removeAttribute(ATTRIBUTE);
    events.forEach((event) => addEventListener(event, skip, options));
    return () => events.forEach((event) => removeEventListener(event, skip, options));
  }, []);

  return null;
}
