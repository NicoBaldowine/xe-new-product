import { Card } from "@/components/primitives/Card";
import { Figure } from "@/components/primitives/Figure";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { CurrencyRow } from "@/components/primitives/CurrencyRow";
import { rateWatch as rows } from "@/lib/fixtures";

function DualFlag({ from, to }: { from: string; to: string }) {
  return (
    <span className="flex shrink-0 items-center">
      <Figure flag={from} size={24} ring />
      <Figure flag={to} size={24} ring className="-ml-2" />
    </span>
  );
}

export function RateWatchCard() {
  return (
    <Card layoutId="rate-watch" className="flex flex-col gap-4">
      <Eyebrow>Rate watch</Eyebrow>
      <div className="flex flex-col gap-4">
        {rows.map((r) => (
          <CurrencyRow
            key={r.pair}
            name={r.pair}
            amount={r.value}
            emblem={<DualFlag from={r.from} to={r.to} />}
          />
        ))}
      </div>
    </Card>
  );
}
