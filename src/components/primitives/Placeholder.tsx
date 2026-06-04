import Image from "next/image";
import { cn } from "@/lib/cn";
import { illustrationSrc, bannerSrc } from "@/lib/assets";

/** Verify-ID illustration. */
export function IsoIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)} aria-hidden="true">
      <Image src={illustrationSrc} alt="" fill className="object-contain" sizes="200px" />
    </div>
  );
}

/** Travel promo banner image (Big Ben photo — text is overlaid by the card). */
export function PhotoBlock({ className }: { className?: string }) {
  // Caller positions this (e.g. `absolute inset-0`); that element is the
  // positioned ancestor next/image `fill` needs.
  return (
    <div className={cn(className)} aria-hidden="true">
      <Image src={bannerSrc} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 420px" />
    </div>
  );
}
