import { Card } from "@/components/primitives/Card";
import { PhotoBlock } from "@/components/primitives/Placeholder";
import { travelPromo as data } from "@/lib/fixtures";

export function TravelPromoCard() {
  return (
    <Card layoutId="travel-promo" flush className="relative overflow-hidden">
      <PhotoBlock className="absolute inset-0" />
      {/* scrim for legible white text over the photo */}
      <div className="absolute inset-0 bg-gradient-to-br from-action-bold/85 via-action-bold/45 to-transparent" />
      <div className="relative flex flex-col gap-3 p-6 text-content-white">
        <h3 className="font-display text-h3 leading-tight">
          {data.title}
          <br />
          <span className="font-serif text-h2 font-normal italic">{data.titleAccent}</span>
        </h3>
        <p className="whitespace-pre-line text-body-sm text-content-white">{data.body}</p>
        <button
          type="button"
          className="mt-1 w-fit rounded-button bg-glass-white px-4 py-2 font-display text-body-sm font-medium text-content-white backdrop-blur-md transition-[filter] hover:brightness-110"
        >
          {data.cta}
        </button>
      </div>
    </Card>
  );
}
