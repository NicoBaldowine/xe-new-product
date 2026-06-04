import { Card } from "@/components/primitives/Card";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { CurrencyRow } from "@/components/primitives/CurrencyRow";
import { accounts as rows } from "@/lib/fixtures";

export function AccountsListCard() {
  return (
    <Card layoutId="accounts" className="flex flex-col gap-4">
      <Eyebrow chevron>Accounts</Eyebrow>
      <div className="flex flex-col gap-4">
        {rows.map((a) => (
          <CurrencyRow key={a.name} flag={a.flag} name={a.name} sub={a.code} amount={a.amount} />
        ))}
      </div>
    </Card>
  );
}
