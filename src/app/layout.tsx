import type { Metadata } from "next";
// Fonts ship inside the `geist` npm package (next/font/local under the hood):
// builds never depend on reaching Google Fonts, and visitors never contact Google.
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Siavash Izadi — Développeur Full-Stack",
  description:
    "Portfolio de Siavash Izadi, développeur full-stack JavaScript basé en France.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
