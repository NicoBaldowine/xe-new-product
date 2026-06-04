import type { WidgetEntry, WidgetGroup } from "./types";
import { CURRENCIES } from "./types";

import { TotalBalanceCard } from "@/components/bento/blocks/TotalBalanceCard";
import { AccountBalanceCard } from "@/components/bento/blocks/AccountBalanceCard";
import { RateChartCard } from "@/components/bento/blocks/RateChartCard";
import { SendAgainCard } from "@/components/bento/blocks/SendAgainCard";
import { SendInternationallyCard } from "@/components/bento/blocks/SendInternationallyCard";
import { RateWatchCard } from "@/components/bento/blocks/RateWatchCard";
import { AccountsListCard } from "@/components/bento/blocks/AccountsListCard";
import { RecentActivitiesCard } from "@/components/bento/blocks/RecentActivitiesCard";
import { TransactionsTableCard } from "@/components/bento/blocks/TransactionsTableCard";
import { TravelPromoCard } from "@/components/bento/blocks/TravelPromoCard";
import { VerifyIdCard } from "@/components/bento/blocks/VerifyIdCard";
import { ActivityEmptyCard } from "@/components/bento/blocks/ActivityEmptyCard";
import { ActionBar } from "@/components/bento/blocks/ActionBar";

/**
 * Playground catalog. The ONLY file to touch to add a widget. Each entry is
 * prop-driven so controls map 1:1 to props; presets mirror Figma variants.
 * Today every entry is a re-tokenized legacy block (source: "legacy-block");
 * Figma widgets get added as they're built (source: "figma-widget").
 */
export const WIDGETS: WidgetEntry[] = [
  {
    id: "total-balance",
    name: "Total Balance",
    group: "Hero",
    source: "legacy-block",
    containers: ["mobile", "desktop"],
    controls: [
      { kind: "amount", prop: "amount", label: "Amount", default: "88.56" },
      { kind: "select", prop: "align", label: "Align", options: ["center", "left"], default: "center" },
      { kind: "toggle", prop: "showActions", label: "Show actions", default: true },
    ],
    presets: [
      { label: "Hero (centered)", props: { amount: "88.56", align: "center", showActions: true } },
      { label: "Consumer row", props: { amount: "$380.00", align: "left", showActions: false } },
      { label: "Large balance", props: { amount: "128,540.00", align: "center", showActions: true } },
    ],
    render: (p) => <TotalBalanceCard {...p} />,
  },
  {
    id: "account-balance",
    name: "Account Balance",
    group: "Balance",
    source: "legacy-block",
    containers: ["mobile", "desktop"],
    controls: [
      { kind: "currency", prop: "flag", label: "Currency", default: "US" },
      { kind: "text", prop: "label", label: "Label", default: "US Account" },
      { kind: "amount", prop: "amount", label: "Amount", default: "100.00" },
      { kind: "select", prop: "align", label: "Align", options: ["center", "left"], default: "center" },
    ],
    presets: [
      { label: "US account", props: { flag: "US", label: "US Account", amount: "180.00", align: "left" } },
      { label: "Euro account", props: { flag: "EU", label: "EUR Account", amount: "€50.00", align: "left" } },
      { label: "CAD account", props: { flag: "CA", label: "CA Account", amount: "157.50", align: "left" } },
    ],
    render: (p) => <AccountBalanceCard {...p} />,
  },
  {
    id: "rate-chart",
    name: "Rate Chart",
    group: "Rates",
    source: "legacy-block",
    containers: ["mobile", "desktop"],
    controls: [{ kind: "toggle", prop: "fillHeight", label: "Fill height", default: false }],
    render: (p) => <RateChartCard {...p} />,
  },
  {
    id: "send-again",
    name: "Send Again",
    group: "Send",
    source: "legacy-block",
    containers: ["mobile", "desktop"],
    controls: [{ kind: "number", prop: "count", label: "Recipients", min: 1, max: 4, default: 4 }],
    presets: [
      { label: "Two", props: { count: 2 } },
      { label: "All four", props: { count: 4 } },
    ],
    render: (p) => <SendAgainCard {...p} />,
  },
  {
    id: "send-internationally",
    name: "Send Internationally",
    group: "Send",
    source: "legacy-block",
    containers: ["mobile", "desktop"],
    controls: [],
    render: () => <SendInternationallyCard />,
  },
  {
    id: "rate-watch",
    name: "Rate Watch",
    group: "Rates",
    source: "legacy-block",
    containers: ["mobile", "desktop"],
    controls: [],
    render: () => <RateWatchCard />,
  },
  {
    id: "accounts-list",
    name: "Accounts List",
    group: "Balance",
    source: "legacy-block",
    containers: ["mobile", "desktop"],
    controls: [],
    render: () => <AccountsListCard />,
  },
  {
    id: "recent-activities",
    name: "Recent Activities",
    group: "Activity",
    source: "legacy-block",
    containers: ["mobile", "desktop"],
    controls: [],
    render: () => <RecentActivitiesCard />,
  },
  {
    id: "transactions-table",
    name: "Transactions Table",
    group: "Activity",
    source: "legacy-block",
    containers: ["desktop"],
    controls: [],
    render: () => <TransactionsTableCard />,
  },
  {
    id: "travel-promo",
    name: "Travel Promo",
    group: "Promo",
    source: "legacy-block",
    containers: ["mobile", "desktop"],
    controls: [],
    render: () => <TravelPromoCard />,
  },
  {
    id: "verify-id",
    name: "Verify ID",
    group: "Identity",
    source: "legacy-block",
    containers: ["mobile", "desktop"],
    controls: [],
    render: () => <VerifyIdCard />,
  },
  {
    id: "activity-empty",
    name: "Activity (empty)",
    group: "Activity",
    source: "legacy-block",
    containers: ["mobile", "desktop"],
    controls: [],
    render: () => <ActivityEmptyCard />,
  },
  {
    id: "action-bar",
    name: "Action Bar",
    group: "Send",
    source: "legacy-block",
    containers: ["mobile", "desktop"],
    controls: [],
    render: () => <ActionBar />,
  },
];

export const WIDGET_GROUPS: WidgetGroup[] = [
  "Hero",
  "Balance",
  "Send",
  "Rates",
  "Activity",
  "Promo",
  "Identity",
];

export const WIDGETS_BY_GROUP: Record<string, WidgetEntry[]> = WIDGETS.reduce(
  (acc, w) => {
    (acc[w.group] ??= []).push(w);
    return acc;
  },
  {} as Record<string, WidgetEntry[]>,
);

export { CURRENCIES };
