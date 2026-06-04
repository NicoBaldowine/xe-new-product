import { Card } from "@/components/primitives/Card";
import { Icon } from "@/components/primitives/Icon";

export function ActivityEmptyCard() {
  return (
    <Card
      layoutId="activity-empty"
      className="flex flex-1 flex-col items-center justify-center gap-3 text-center"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-1 text-content-secondary">
        <Icon name="clock" size={22} />
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-display text-base font-semibold text-content">No activity yet</p>
        <p className="text-sm text-content-secondary">Your transfers will show up here</p>
      </div>
    </Card>
  );
}
