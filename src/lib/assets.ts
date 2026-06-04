/**
 * Single swap point for visual assets. Real assets now live in /public/assets.
 * Flags resolve to PNGs; unknown codes fall back to an emoji.
 */

/** Currency/country code → flag file (in /public/assets). */
const FLAG_FILE: Record<string, string> = {
  US: "us",
  USD: "us",
  CA: "canada",
  CAD: "canada",
  EU: "euro",
  EUR: "euro",
  GB: "uk",
  GBP: "uk",
  AE: "aed",
  AED: "aed",
  MX: "mexico",
  MXN: "mexico",
  CN: "china",
};

/** Resolve a flag image src, or null if we don't have one (caller falls back). */
export function flagSrc(code: string): string | null {
  const f = FLAG_FILE[code.toUpperCase()];
  return f ? `/assets/${f}.png` : null;
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
// XE wordmark — theme-specific. light = blue logo (light bg), dark = white logo (dark bg).
export const logoLightSrc = "/assets/xelogo_light.svg";
export const logoDarkSrc = "/assets/xelogo_dark.svg";

export const REAL_ASSETS_READY = true;
