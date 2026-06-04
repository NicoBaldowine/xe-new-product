import { Card } from "@/components/primitives/Card";
import { Button } from "@/components/primitives/Button";
import { Figure } from "@/components/primitives/Figure";
import { Icon } from "@/components/primitives/Icon";
import { RollingNumber } from "@/components/primitives/RollingNumber";
import { sendInternationally as data } from "@/lib/fixtures";

function AmountBox({ currency, amount }: { currency: string; amount: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-surface-1 px-4 py-6">
      <button type="button" className="flex items-center gap-2">
        <Figure flag={currency} size={24} />
        <span className="font-display text-sm font-medium text-content">{currency}</span>
        <Icon name="chevronDown" size={16} className="text-content-secondary" />
      </button>
      <RollingNumber value={amount} className="font-sans text-xl font-semibold text-content" />
    </div>
  );
}

export function SendInternationallyCard() {
  return (
    <Card layoutId="send-international" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-lg font-semibold text-content">{data.title}</h3>
        <p className="text-sm text-content-secondary">{data.subtitle}</p>
      </div>

      <div className="relative flex flex-col gap-2">
        <AmountBox currency={data.send.currency} amount={data.send.amount} />
        <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#bcd6ff] to-[#c9f3bb] px-3 py-1.5 font-display text-sm font-semibold text-[#0a0a0a]">
          {data.rateBadge}
        </span>
        <AmountBox currency={data.receive.currency} amount={data.receive.amount} />
      </div>

      <Button variant="primary" full>
        {data.cta}
      </Button>
    </Card>
  );
}
