/**
 * Single swap point for visual assets. Real assets now live in /public/assets.
 * Flags resolve to PNGs; unknown codes fall back to an emoji.
 */

/**
 * Currency/country code → flag file (in /public/assets). The original 7 are
 * custom circular PNGs; the rest are circle-flags SVGs under /assets/flags/
 * (added so the desktop Hero blur background has variety).
 */
const FLAG_FILE: Record<string, string> = {
  US: "us.png",
  USD: "us.png",
  CA: "canada.png",
  CAD: "canada.png",
  EU: "euro.png",
  EUR: "euro.png",
  GB: "uk.png",
  GBP: "uk.png",
  AE: "aed.png",
  AED: "aed.png",
  MX: "mexico.png",
  MXN: "mexico.png",
  CN: "china.png",
  // circle-flags SVGs
  JP: "flags/jp.svg",
  JPY: "flags/jp.svg",
  IN: "flags/in.svg",
  INR: "flags/in.svg",
  BR: "flags/br.svg",
  BRL: "flags/br.svg",
  AU: "flags/au.svg",
  AUD: "flags/au.svg",
  DE: "flags/de.svg",
  FR: "flags/fr.svg",
  ES: "flags/es.svg",
  IT: "flags/it.svg",
  KR: "flags/kr.svg",
  KRW: "flags/kr.svg",
  SG: "flags/sg.svg",
  SGD: "flags/sg.svg",
  NG: "flags/ng.svg",
  NGN: "flags/ng.svg",
  PH: "flags/ph.svg",
  PHP: "flags/ph.svg",
  AR: "flags/ar.svg",
  CH: "flags/ch.svg",
  CHF: "flags/ch.svg",
  NL: "flags/nl.svg",
  CL: "flags/cl.svg",
  CLP: "flags/cl.svg",
};

/** Resolve a flag image src, or null if we don't have one (caller falls back). */
export function flagSrc(code: string): string | null {
  const f = FLAG_FILE[code.toUpperCase()];
  return f ? `/assets/${f}` : null;
}

const FLAG_EMOJI: Record<string, string> = {
  US: "🇺🇸",
  USD: "🇺🇸",
  CA: "🇨🇦",
  CAD: "🇨🇦",
  EU: "🇪🇺",
  EUR: "🇪🇺",
  GB: "🇬🇧",
  GBP: "🇬🇧",
  AE: "🇦🇪",
  AED: "🇦🇪",
  MX: "🇲🇽",
  MXN: "🇲🇽",
  CN: "🇨🇳",
};

export function flagEmoji(code: string): string {
  return FLAG_EMOJI[code.toUpperCase()] ?? "🏳️";
}

/** Larger illustrations / media. */
export const illustrationSrc = "/assets/Illustration.png";
export const bannerSrc = "/assets/Banner.png";
/** Hero promo illustrations (exported from Figma). */
export const heroCardSrc = "/assets/hero-card.png";
export const heroEsimSrc = "/assets/hero-esim.png";
// XE wordmark — theme-specific. light = blue logo (light bg), dark = white logo (dark bg).
export const logoLightSrc = "/assets/xelogo_light.svg";
export const logoDarkSrc = "/assets/xelogo_dark.svg";

export const REAL_ASSETS_READY = true;
