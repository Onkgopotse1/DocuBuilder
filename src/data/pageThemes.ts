
export const pageThemes = {
  invoice: {
    light: 'bg-blue-50',
    dark: 'bg-blue-950',
  },
  quote: {
    light: 'bg-violet-50',
    dark: 'bg-violet-950',
  },
  receipt: {
    light: 'bg-gradient-to-br from-emerald-50/50 via-slate-50 to-teal-50/50',
    dark: 'bg-emerald-950',
  },
  contract: {
    light: 'bg-amber-50',
    dark: 'bg-amber-950',
  },
  Delivery_Note: {
    light: 'bg-slate-50',
    dark: 'bg-cyan-950',
  },
  Expense: {
    light: 'bg-slate-50',
    dark: 'bg-orange-950',
  },
  PurchaseOrderBuilder: {
    light: 'bg-[#f0f4ff]',
    dark: 'bg-indigo-950',
  },
  Report: {
    light: 'bg-[#f8fafc]',
    dark: 'bg-slate-900',
  },
  Timesheet: {
    light: 'bg-[#fdf8f0]',
    dark: 'bg-yellow-950',
  },
  CreditNote: {
    light: 'bg-[#fef2f2]',
    dark: 'bg-indigo-950',
  },
} as const;

export type PageKey = keyof typeof pageThemes;

export const homePageTheme = {
  light: 'bg-slate-100',
  dark: 'bg-indigo-950',
} as const;

export type HomePageTheme = keyof typeof homePageTheme;