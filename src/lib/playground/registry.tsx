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

// New Figma widgets (content components — rendered inside WidgetShell by the views).
import { Hero } from "@/components/widgets/Hero";
import { Charts } from "@/components/widgets/Charts";
import { SendMoneyFlow } from "@/components/widgets/SendMoneyFlow";
import { Convert } from "@/components/widgets/Convert";
import { Transactions } from "@/components/widgets/Transactions";
import { SendAgain } from "@/components/widgets/SendAgain";
import { GettingStarted } from "@/components/widgets/GettingStarted";
import { MktCard } from "@/components/widgets/MktCard";
import { Banner } from "@/components/widgets/Banner";
import { InProgress } from "@/components/widgets/InProgress";

/**
 * Playground catalog. The ONLY file to touch to add a widget. Each entry is
 * prop-driven so controls map 1:1 to props; presets mirror Figma variants.
 * Today every entry is a re-tokenized legacy block (source: "legacy-block");
 * Figma widgets get added as they're built (source: "figma-widget").
 */
export const WIDGETS: WidgetEntry[] = [
  // ── Figma widgets (the new set, being migrated from the consumer designs) ──
  {
    id: "hero",
    name: "Hero",
    group: "Hero",
    source: "figma-widget",
    inBento: true,
    bentoCols: [1, 2],
    containers: ["mobile", "desktop"],
    controls: [
      { kind: "select", prop: "variant", label: "Variant", options: ["balance", "all-accounts", "rate", "card", "esim", "send", "send-quick"], default: "balance" },
      { kind: "currency", prop: "flag", label: "Flag", default: "US" },
      { kind: "text", prop: "label", label: "Label", default: "USD Account" },
      { kind: "amount", prop: "amount", label: "Amount", default: "$380.00" },
      { kind: "toggle", prop: "showOverflow", label: "Overflow tile", default: false },
    ],
    presets: [
      { label: "Balance (USD)", props: { variant: "balance", label: "USD Account", amount: "$380.00" } },
      { label: "All accounts", props: { variant: "all-accounts", label: "All accounts", amount: "$500.00", showOverflow: true } },
      { label: "Rate promo", props: { variant: "rate" } },
      { label: "Card promo", props: { variant: "card" } },
      { label: "eSIM promo", props: { variant: "esim" } },
      { label: "Send promo", props: { variant: "send" } },
      { label: "Quick send", props: { variant: "send-quick" } },
    ],
    render: (p) => <Hero {...p} />,
  },
  {
    id: "charts",
    name: "Charts",
    group: "Rates",
    source: "figma-widget",
    inBento: true,
    bentoSpan: 2,
    bentoCols: [1, 2],
    bentoMaxRows: 6,
    containers: ["mobile", "desktop"],
    controls: [
      { kind: "select", prop: "variant", label: "Variant", options: ["selector", "badge"], default: "selector" },
      { kind: "currency", prop: "from", label: "From", default: "CA" },
      { kind: "currency", prop: "to", label: "To", default: "US" },
      { kind: "text", prop: "rate", label: "Rate", default: "0.7249" },
      { kind: "text", prop: "delta", label: "Delta", default: "+0.07%" },
      { kind: "select", prop: "trend", label: "Trend", options: ["up", "down"], default: "up" },
      { kind: "toggle", prop: "showRanges", label: "Range tabs", default: true },
    ],
    presets: [
      { label: "Selector (desktop)", props: { variant: "selector", from: "CA", to: "US", rate: "0.7249", delta: "+0.07%", trend: "up" } },
      { label: "Badge (mobile)", props: { variant: "badge", from: "CA", to: "US", rate: "0.7249", delta: "+0.07%", trend: "up" } },
      { label: "Down trend", props: { variant: "selector", from: "GB", to: "EU", rate: "1.1842", delta: "-0.31%", trend: "down" } },
    ],
    render: (p) => <Charts {...p} />,
  },
  {
    id: "send-money-flow",
    name: "Send Money Flow",
    group: "Send",
    source: "figma-widget",
    inBento: true,
    bentoCols: [1, 2],
    containers: ["mobile", "desktop"],
    controls: [
      { kind: "text", prop: "title", label: "Title", default: "Send internationally" },
      { kind: "text", prop: "subtitle", label: "Subtitle", default: "Live rates, low fees, arrives in seconds" },
      { kind: "text", prop: "rateBadge", label: "Rate badge", default: "1 CAD = 0.72 USD" },
      { kind: "text", prop: "cta", label: "CTA", default: "Send money" },
      { kind: "toggle", prop: "showRate", label: "Rate badge", default: true },
    ],
    presets: [
      { label: "CAD → USD", props: { send: { currency: "CAD", amount: "$50.00" }, receive: { currency: "USD", amount: "$36.17" }, rateBadge: "1 CAD = 0.72 USD", showRate: true } },
      { label: "USD → EUR", props: { send: { currency: "USD", amount: "$1,000.00" }, receive: { currency: "EUR", amount: "€918.40" }, rateBadge: "1 USD = 0.92 EUR", showRate: true } },
      { label: "No rate badge", props: { showRate: false } },
    ],
    render: (p) => <SendMoneyFlow {...p} />,
  },
  {
    id: "convert",
    name: "Convert / Rate",
    group: "Rates",
    source: "figma-widget",
    inBento: true,
    bentoCols: [1],
    containers: ["mobile", "desktop"],
    controls: [
      { kind: "select", prop: "variant", label: "Variant", options: ["First time - Default", "Max items", "First Time - Only Convert"], default: "First time - Default" },
      { kind: "text", prop: "title", label: "Title", default: "Rate watch" },
      { kind: "toggle", prop: "showRefresh", label: "Refresh", default: true },
    ],
    presets: [
      { label: "First time", props: { variant: "First time - Default" } },
      { label: "Max items", props: { variant: "Max items" } },
    ],
    render: (p) => <Convert {...p} />,
  },
  {
    id: "transactions",
    name: "Transactions",
    group: "Activity",
    source: "figma-widget",
    inBento: true,
    bentoSpan: 2,
    bentoCols: [2],
    bentoMaxRows: 6,
    containers: ["mobile", "desktop"],
    controls: [
      { kind: "select", prop: "variant", label: "Variant", options: ["All", "Empty", "Only Balance"], default: "All" },
      { kind: "text", prop: "title", label: "Title", default: "Transactions" },
      { kind: "toggle", prop: "showStatusPill", label: "Status pill", default: false },
    ],
    presets: [
      { label: "All", props: { variant: "All" } },
      { label: "Empty", props: { variant: "Empty" } },
      { label: "Only balance", props: { variant: "Only Balance" } },
    ],
    render: (p) => <Transactions {...p} />,
  },
  {
    id: "in-progress",
    name: "In Progress",
    group: "Activity",
    source: "figma-widget",
    inBento: true,
    bentoCols: [1, 2],
    bentoMaxRows: 3,
    containers: ["mobile", "desktop"],
    controls: [
      { kind: "select", prop: "variant", label: "Variant", options: ["Add funds - Scheduled", "Waiting for funds", "Scheduled", "In progress", "Received money", "Transaction created"], default: "In progress" },
      { kind: "text", prop: "recipient", label: "Recipient", default: "To Matias" },
      { kind: "text", prop: "amount", label: "Amount", default: "100 EUR" },
    ],
    presets: [
      { label: "In progress", props: { variant: "In progress" } },
      { label: "Add funds", props: { variant: "Add funds - Scheduled" } },
      { label: "Waiting for funds", props: { variant: "Waiting for funds" } },
      { label: "Scheduled", props: { variant: "Scheduled" } },
      { label: "Received money", props: { variant: "Received money" } },
      { label: "Transaction created", props: { variant: "Transaction created" } },
    ],
    render: (p) => <InProgress {...p} />,
  },
  {
    id: "send-again",
    name: "Send Again",
    group: "Send",
    source: "figma-widget",
    inBento: true,
    bentoCols: [1, 2],
    bentoMaxRows: 3,
    containers: ["mobile", "desktop"],
    controls: [
      { kind: "select", prop: "rate", label: "Rate", options: ["normal", "higher"], default: "normal" },
      { kind: "text", prop: "recipient", label: "Recipient", default: "To Javo Esquivel" },
      { kind: "amount", prop: "amount", label: "Amount", default: "100" },
      { kind: "currency", prop: "fromCurrency", label: "From", default: "US" },
      { kind: "currency", prop: "toCurrency", label: "To", default: "EU" },
      { kind: "text", prop: "theyGet", label: "They get", default: "€92,00" },
    ],
    presets: [
      { label: "Normal rate", props: { rate: "normal" } },
      { label: "Higher rate", props: { rate: "higher" } },
    ],
    render: (p) => <SendAgain {...p} />,
  },
  {
    id: "getting-started",
    name: "Getting Started",
    group: "Identity",
    source: "figma-widget",
    inBento: true,
    bentoCols: [1, 2],
    bentoMaxRows: 7,
    containers: ["mobile", "desktop"],
    controls: [
      { kind: "select", prop: "variant", label: "Variant", options: ["first-time", "middle", "all-done"], default: "first-time" },
      { kind: "text", prop: "title", label: "Title", default: "Getting started" },
    ],
    presets: [
      { label: "First time", props: { variant: "first-time" } },
      { label: "Middle", props: { variant: "middle" } },
      { label: "All done", props: { variant: "all-done" } },
    ],
    render: (p) => <GettingStarted {...p} />,
  },
  {
    id: "mkt-card",
    name: "MKT Card",
    group: "Promo",
    source: "figma-widget",
    inBento: true,
    bentoSpan: 2,
    bentoCols: [1, 2],
    bentoMaxRows: 3,
    containers: ["mobile", "desktop"],
    controls: [
      { kind: "select", prop: "variant", label: "Variant", options: ["Small", "Large"], default: "Small" },
      { kind: "text", prop: "title", label: "Title", default: "Add a new currency in seconds" },
      { kind: "text", prop: "subtitle", label: "Subtitle", default: "Open a new balance to save, spend and share." },
      { kind: "toggle", prop: "dismissible", label: "Dismissible", default: false },
    ],
    presets: [
      { label: "Small", props: { variant: "Small" } },
      { label: "Large", props: { variant: "Large" } },
    ],
    render: (p) => <MktCard {...p} />,
  },
  {
    id: "banner",
    name: "Banner",
    group: "Promo",
    source: "figma-widget",
    inBento: false,
    bentoSpan: 2,
    bentoCols: [2],
    bentoMaxRows: 2,
    containers: ["mobile", "desktop"],
    controls: [
      { kind: "select", prop: "variant", label: "Variant", options: ["Image", "Gradient", "Light"], default: "Image" },
      { kind: "text", prop: "title", label: "Title", default: "Travel without" },
      { kind: "text", prop: "accent", label: "Accent (serif)", default: "Limits" },
      { kind: "text", prop: "subtitle", label: "Subtitle", default: "Get instant data in 190+\nNo roaming fees" },
      { kind: "text", prop: "cta", label: "CTA", default: "Get it now" },
    ],
    presets: [
      { label: "eSIM · image", props: { variant: "Image", title: "Travel without", accent: "Limits", subtitle: "Get instant data in 190+\nNo roaming fees", cta: "Get it now" } },
      { label: "eSIM · gradient", props: { variant: "Gradient", title: "Travel without", accent: "Limits", subtitle: "Get instant data in 190+\nNo roaming fees", cta: "Get it now" } },
      { label: "Large transfer", props: { variant: "Light", title: "Large transfer?", accent: "Talk to an expert.", subtitle: "24/5 dedicated support for transfers over $50K", cta: "Transfer now" } },
    ],
    render: (p) => <Banner {...p} />,
  },

  // ── Legacy blocks (re-tokenized; kept until we decide what to retire) ──
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
    id: "send-again-block",
    name: "Send Again (legacy)",
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
    // Tabular, high-density content → spans 2 columns in the bento.
    bentoSpan: 2,
    bentoCols: [2],
    bentoMaxRows: 7,
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
    // A horizontal row of actions → reads best spanning 2 columns, short.
    bentoSpan: 2,
    bentoCols: [2],
    bentoMaxRows: 2,
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
