import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, Zalando_Sans, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { TokenProvider } from "@/components/tokens/TokenProvider";

// Each face exposes its own CSS variable so the token editor can re-assign a
// font *role* (title / body / accent / numeric) to any of them at runtime.
// The role → face wiring lives in globals.css (--xe-font-* → --font-<face>).

// Numerals — IBM Plex Sans, restricted to the digit glyphs (U+0030–0039) via a
// `unicode-range` @font-face descriptor: placed FIRST in every stack the browser
// only reaches for it on 0–9 and falls through to the body face for the rest.
// `adjustFontFallback: false` is required or the Arial fallback (no unicode-range)
// would swallow all text.
const ibmPlexSans = localFont({
  src: "./fonts/IBMPlexSans-Variable.woff2",
  variable: "--font-ibm-plex-sans",
  display: "swap",
  weight: "100 700",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0030-0039" }],
});

const instrumentSans = Instrument_Sans({ variable: "--font-instrument-sans", subsets: ["latin"], display: "swap" });
const zalandoSans = Zalando_Sans({ variable: "--font-zalando", subsets: ["latin"], display: "swap" });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

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
      className={`${instrumentSans.variable} ${zalandoSans.variable} ${instrumentSerif.variable} ${ibmPlexSans.variable} ${inter.variable} h-full antialiased`}
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
