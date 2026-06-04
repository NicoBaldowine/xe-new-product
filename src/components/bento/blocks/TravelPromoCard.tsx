import { Card } from "@/components/primitives/Card";
import { PhotoBlock } from "@/components/primitives/Placeholder";
import { travelPromo as data } from "@/lib/fixtures";

export function TravelPromoCard() {
  return (
    <Card layoutId="travel-promo" flush className="relative overflow-hidden">
      <PhotoBlock className="absolute inset-0" />
      {/* scrim for legible white text over the photo */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/85 via-brand-blue/45 to-transparent" />
      <div className="relative flex flex-col gap-3 p-6 text-white">
        <h3 className="font-display text-2xl font-semibold leading-tight">
          {data.title}
          <br />
          <span className="font-serif text-3xl font-normal italic">{data.titleAccent}</span>
        </h3>
        <p className="whitespace-pre-line text-sm text-white/85">{data.body}</p>
        <button
          type="button"
          className="mt-1 w-fit rounded-xl bg-white/20 px-4 py-2 font-display text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
        >
          {data.cta}
        </button>
      </div>
    </Card>
  );
}
