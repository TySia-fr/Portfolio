"use client";

import { useEffect, useRef } from "react";

/**
 * A command typed in a terminal, then its result. The full text is in the
 * HTML from the start (search engines, no-JS, screen readers read it as is);
 * the typing only reveals it with clip-path, so nothing reflows. Starts when
 * the line scrolls into view, once. Still with prefers-reduced-motion.
 */
export function TerminalLine({ command, result }: { command: string; result: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const line = ref.current;
    const typed = line?.querySelector<HTMLElement>("[data-typed]");
    if (!line || !typed) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      line.setAttribute("data-done", "");
      return;
    }
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const length = command.length;
      let shown = 0;
      timer = window.setInterval(() => {
        shown += 1;
        typed.style.clipPath = `inset(0 ${(100 * (1 - shown / length)).toFixed(2)}% 0 0)`;
        if (shown >= length) {
          clearInterval(timer);
          window.setTimeout(() => line.setAttribute("data-done", ""), 250);
        }
      }, 55);
    });
    observer.observe(line);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [command]);

  return (
    <p ref={ref} className="terminal-line font-mono text-[0.8125rem] leading-6">
      <span aria-hidden="true" className="text-signal">
        ${" "}
      </span>
      <span data-typed className="text-text">
        {command}
      </span>
      <span aria-hidden="true" className="terminal-caret" />
      <br />
      <span className="terminal-result text-live">{result}</span>
    </p>
  );
}
