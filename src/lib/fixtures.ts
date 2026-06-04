/** Static demo data driving the bento blocks. Mirrors frame 236-8092. */

export const totalBalance = {
  label: "Total Balance",
  amount: "88.56",
  flags: ["US", "EU", "CA"],
};

export const usAccount = {
  label: "US Account",
  amount: "100.00",
  flag: "EU",
};

export const sendAgain = [
  { initials: "JE", name: "Javo Esquivel", sub: "Xe account", flag: "MX" },
  { initials: "ZH", name: "Ziai Huang", sub: "Xe account", flag: "CN" },
  { initials: "AK", name: "Anaya Khan", sub: "Xe account", flag: "GB" },
  { initials: "SP", name: "Sumesh Patel", sub: "Xe account", flag: "US" },
];

export const rateChart = {
  from: "CAD",
  to: "USD",
  rate: "0.7249",
  delta: "+0.07%",
  timestamp: "May 29, 5:57:00 PM UTC",
  ranges: ["1D", "1W", "3M", "6M", "1Y", "5Y"],
  activeRange: "1D",
  // Normalized 0..1 sample points — a realistic random-walk. Movement has
  // momentum (runs of 2–5 ticks in one direction, not strict alternation),
  // variable swing sizes, flat plateaus, a sustained pullback mid-series
  // (~the 6M mark), a sharp recovery, and a spike into the close.
  points: [
    0.2, 0.215, 0.205, 0.24, 0.25, 0.235, 0.27, 0.285, 0.275, 0.3, 0.295, 0.32,
    0.335, 0.355, 0.37, 0.36, 0.4, 0.43, 0.45, 0.44, 0.48, 0.52, 0.55, 0.545,
    0.55, 0.535, 0.54, 0.51, 0.48, 0.46, 0.42, 0.4, 0.415, 0.45, 0.49, 0.52,
    0.5, 0.55, 0.59, 0.62, 0.66, 0.68, 0.66, 0.63, 0.61, 0.64, 0.67, 0.7, 0.69,
    0.72, 0.74, 0.73, 0.79, 0.86, 0.84, 0.91, 0.95,
  ],
};

export const rateWatch = [
  { pair: "CAD", from: "US", to: "CA", value: "733.27" },
  { pair: "MXN", from: "US", to: "MX", value: "1,733.27" },
  { pair: "EUR", from: "US", to: "EU", value: "873.27" },
];

export const sendInternationally = {
  title: "Send internationally",
  subtitle: "Live rates, low fees, arrives in seconds",
  send: { currency: "CAD", amount: "50.00" },
  receive: { currency: "USD", amount: "36.17" },
  rateBadge: "1 CAD = 0.72 USD",
  cta: "Send money",
};

export const accounts = [
  { name: "Canadian Dollar", code: "CAD", amount: "2,274.45", flag: "CA" },
  { name: "United Arab Emirates…", code: "AED", amount: "1,000.00", flag: "AE" },
  { name: "US Dollar", code: "USD", amount: "2,000.00", flag: "US" },
  { name: "British Pound", code: "GBP", amount: "150.00", flag: "GB" },
  { name: "Euro", code: "EUR", amount: "1,680.30", flag: "EU" },
];

export const recentActivities = [
  { initials: "MS", name: "To Matias", sub: "In progress · May 13", amount: "100", kind: "transfer" as const },
  { name: "China Cafe", sub: "Card · May 06", amount: "76.50", kind: "card" as const },
];

export type TxStatus = "action" | "completed";
export const transactions: Array<{
  initials: string;
  name: string;
  date: string;
  status: TxStatus;
  statusLabel: string;
  /** What the recipient receives (the source amount). */
  recipientGets: number;
  recipientCurrency: string;
  /** Currency you pay in — the amount is derived via the FX rate. */
  youSellCurrency: string;
}> = [
  {
    initials: "MS",
    name: "Multiple Recipients",
    date: "May 21 Value date May 21",
    status: "action",
    statusLabel: "Action required",
    recipientGets: 401,
    recipientCurrency: "USD",
    youSellCurrency: "CAD",
  },
  {
    initials: "AR",
    name: "American recipient",
    date: "May 21 Value date May 21",
    status: "completed",
    statusLabel: "Completed",
    recipientGets: 1200,
    recipientCurrency: "USD",
    youSellCurrency: "CAD",
  },
  {
    initials: "AR",
    name: "American recipient",
    date: "May 21 Value date May 21",
    status: "completed",
    statusLabel: "Completed",
    recipientGets: 320,
    recipientCurrency: "USD",
    youSellCurrency: "CAD",
  },
];

export const actions = [
  { label: "Send", icon: "send", primary: true },
  { label: "Convert", icon: "convert" },
  { label: "Deposit", icon: "deposit" },
  { label: "Schedule a payment", icon: "calendar" },
  { label: "Forwards", icon: "clock" },
];

export const travelPromo = {
  title: "Travel without",
  titleAccent: "Limits",
  body: "Get instant data in 190+\nNo roaming fees",
  cta: "Get it now",
};

export const verifyId = {
  title: "Let’s verify your ID",
};
