/**
 * Single swap point for visual assets. Real assets live in /public/assets.
 * Flags are circle-flags SVGs (crisp at any size); unknown codes fall back to an emoji.
 */

/**
 * Currency OR country code → 2-letter country code, which maps 1:1 to a
 * circle-flags SVG at /assets/flags/<cc>.svg. One scheme for every flag (no
 * parallel PNG set), so quality is resolution-independent on mobile and desktop.
 */
const FLAG_COUNTRY: Record<string, string> = {
  US: "us", USD: "us",
  CA: "ca", CAD: "ca",
  EU: "eu", EUR: "eu",
  GB: "gb", GBP: "gb",
  AE: "ae", AED: "ae",
  MX: "mx", MXN: "mx",
  CN: "cn", CNY: "cn",
  JP: "jp", JPY: "jp",
  IN: "in", INR: "in",
  BR: "br", BRL: "br",
  AU: "au", AUD: "au",
  DE: "de",
  FR: "fr",
  ES: "es",
  IT: "it",
  KR: "kr", KRW: "kr",
  SG: "sg", SGD: "sg",
  NG: "ng", NGN: "ng",
  PH: "ph", PHP: "ph",
  AR: "ar",
  CH: "ch", CHF: "ch",
  NL: "nl",
  CL: "cl", CLP: "cl",
  HK: "hk", HKD: "hk",
};

/** Resolve a flag image src, or null if we don't have one (caller falls back). */
export function flagSrc(code: string): string | null {
  const cc = FLAG_COUNTRY[code.toUpperCase()];
  return cc ? `/assets/flags/${cc}.svg` : null;
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
/** Marketing promo cover (currency pills banner) — rendered object-cover/center. */
export const mktCoverSrc = "/assets/marketing/currencies.png";
/** Hero promo illustrations (exported from Figma as transparent SVGs). */
export const heroIllustration: Record<string, string> = {
  rate: "/assets/hero/rate.svg",
  card: "/assets/hero/card.svg",
  esim: "/assets/hero/esim.svg",
  send: "/assets/hero/send-money.svg",
  "send-quick": "/assets/hero/default.svg",
};
// XE wordmark — theme-specific. light = blue logo (light bg), dark = white logo (dark bg).
export const logoLightSrc = "/assets/xelogo_light.svg";
export const logoDarkSrc = "/assets/xelogo_dark.svg";

export const REAL_ASSETS_READY = true;
