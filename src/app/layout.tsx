import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Numerals — IBM Plex Sans (variable wght). Restricted to the digit glyphs
// (U+0030–0039) via a `unicode-range` @font-face descriptor, so when this
// family is placed FIRST in the font stack the browser only reaches for it on
// 0–9 and falls through to Instrument Sans for everything else. This makes all
// numbers render in IBM Plex Sans automatically, with no per-element markup.
// `adjustFontFallback: false` is required: the generated Arial fallback face
// carries no unicode-range and would otherwise swallow all text.
const ibmPlexNumeric = localFont({
  src: "./fonts/IBMPlexSans-Variable.woff2",
  variable: "--font-numeric",
  display: "swap",
  weight: "100 700",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0030-0039" }],
});

// UI / body / headings — variable font (wght 400–700).
// Per the XE brand spec, headings are also Instrument Sans, so this one face
// drives both --font-sans and --font-display.
const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Editorial accent (e.g. the italic "Limits") — single weight, normal + italic
const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "XE — Brand Bento",
  description: "A showcase of the new XE design system: one block library, three products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${ibmPlexNumeric.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Set the theme class before paint to avoid a flash of the wrong theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('xe-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-content">{children}</body>
    </html>
  );
}
