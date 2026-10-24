import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/content/site";

/**
 * Preview image shown when the site is shared (LinkedIn, Slack, iMessage…).
 * Generated once at build time. ImageResponse cannot read woff2, so it uses a
 * vendored TTF (Geist Mono, SIL OFL).
 */
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const geistMono = await readFile(
  join(process.cwd(), "src/fonts/og/GeistMono-Medium.ttf"),
);

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#111416",
        color: "#e8e6e0",
        fontFamily: "Geist Mono",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 28, height: 28, background: "#e9b44c" }} />
        <div style={{ fontSize: 28, color: "#9aa0a4" }}>siavashizadi.com</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 84, letterSpacing: -2 }}>{site.name}</div>
        <div style={{ fontSize: 36, color: "#9aa0a4" }}>{site.role}</div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Geist Mono", data: geistMono, style: "normal", weight: 500 }],
    },
  );
}
