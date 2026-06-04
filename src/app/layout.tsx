import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, Zalando_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { TokenProvider } from "@/components/tokens/TokenProvider";

// Numerals — Roboto Mono (variable wght). Restricted to the digit glyphs
// (U+0030–0039) via a `unicode-range` @font-face descriptor, so when this
// family is placed FIRST in the font stack the browser only reaches for it on
// 0–9 and falls through to the body face (Zalando Sans) for everything else.
// This makes all numbers render in Roboto Mono automatically, no per-element
// markup. `adjustFontFallback: false` is required: the generated Arial fallback
// face carries no unicode-range and would otherwise swallow all text.
const robotoMonoNumeric = localFont({
  src: "./fonts/RobotoMono-Variable.woff2",
  variable: "--font-numeric",
  display: "swap",
  weight: "100 700",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0030-0039" }],
});

// Titles / headings — Instrument Sans (variable wght). Drives --font-display.
const instrumentSans = Instrument_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// UI / body — Zalando Sans (variable). Drives --font-sans (the default body).
const zalandoSans = Zalando_Sans({
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
      className={`${instrumentSans.variable} ${zalandoSans.variable} ${instrumentSerif.variable} ${robotoMonoNumeric.variable} h-full antialiased`}
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
      <body className="min-h-full flex flex-col bg-surface text-content">
        <TokenProvider>{children}</TokenProvider>
      </body>
    </html>
  );
}
