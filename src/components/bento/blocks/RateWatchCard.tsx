import { Card } from "@/components/primitives/Card";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { CurrencyRow } from "@/components/primitives/CurrencyRow";
import { FlagStack } from "@/components/primitives/FlagStack";
import { rateWatch as rows } from "@/lib/fixtures";

function DualFlag({ from, to }: { from: string; to: string }) {
  return <FlagStack flags={[from, to]} size={24} />;
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
