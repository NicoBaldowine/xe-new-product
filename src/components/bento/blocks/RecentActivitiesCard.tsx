import { Card } from "@/components/primitives/Card";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { CurrencyRow } from "@/components/primitives/CurrencyRow";
import { Figure } from "@/components/primitives/Figure";
import { Icon } from "@/components/primitives/Icon";
import { recentActivities as rows } from "@/lib/fixtures";

export function RecentActivitiesCard() {
  return (
    <Card layoutId="recent-activities" className="flex flex-col gap-4">
      <Eyebrow chevron>Recent activities</Eyebrow>
      <div className="flex flex-col gap-4">
        {rows.map((a) => (
          <CurrencyRow
            key={a.name}
            name={a.name}
            sub={a.sub}
            amount={a.amount}
            emblem={
              a.kind === "card" ? (
                <Figure size={36} className="bg-utility-04-muted text-utility-04">
                  <Icon name="bag" size={18} />
                </Figure>
              ) : (
                <Figure size={36} initials={a.initials} />
              )
            }
          />
        ))}
      </div>
    </Card>
  );
}
