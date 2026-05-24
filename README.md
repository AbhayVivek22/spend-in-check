# SpendTrace (WalletAI)

A mobile-first personal finance tracker that works entirely in your browser. No backend, no signup, no data leaving your device unless you want it to.

Originally built from Google AI Studio, now extended with income tracking, investments, budgets, and a whole lot more.

## What it does

- **Track expenses** across 9 categories (Food, Transport, Shopping, etc.)
- **Log income** from various sources (Salary, Freelance, Dividends, etc.)
- **Record investments** (Stocks, Mutual Funds, Real Estate, Crypto, etc.)
- **Edit or delete** any transaction anytime
- **See where your money goes** — dashboard with a donut chart by category, a monthly line chart, and a daily breakdown view
- **Set monthly budgets** and track your progress with a visual bar
- **Search & filter** your history by month, date range, or keyword
- **Get AI insights** — uses Gemini to analyze your spending patterns (bring your own API key)
- **Export/import your data** as JSON — you own your data

Everything is stored in your browser's localStorage. Close the tab and it's still there when you come back.

## Tech stack

- React 19 + TypeScript
- Vite 6 for dev and building
- Tailwind CSS v4 for styling
- Recharts for charts (donut, area/line)
- Lucide for icons
- Google Gemini AI for spending insights
- PWA-ready (installable on mobile home screen)

## Getting started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app runs at `http://localhost:3000`. It works best on a phone-sized viewport but scales to desktop too.

### Optional: AI insights

If you want the AI insight feature to work, paste your Gemini API key in the Settings tab. It's stored locally and never sent anywhere except to Google's API when you hit "Generate Insights".

## Project structure

```
src/
├── App.tsx              # Root component, routing, all state
├── types.ts             # Data types (Expense, Income, Investment, Budget)
├── components/
│   ├── Dashboard.tsx    # Summary cards, charts, recent transactions
│   ├── History.tsx      # Full transaction list with filters
│   ├── AddExpense.tsx   # Add/edit expense form
│   ├── AddIncome.tsx    # Add income form
│   ├── AddInvestment.tsx# Add investment form
│   ├── AddTransactionChooser.tsx  # Pick transaction type
│   ├── Settings.tsx     # Budget, AI, API key, import/export
│   └── BottomNav.tsx    # Tab navigation
├── hooks/
│   └── useLocalStorage.ts  # Persist state to localStorage
├── lib/
│   └── utils.ts         # Currency formatting, class merging
└── services/
    └── ai.ts            # Gemini API integration
```

## What's stored in localStorage

| Key | What |
|---|---|
| `spendtrace_expenses` | All your expenses |
| `spendtrace_incomes` | All your income entries |
| `spendtrace_investments` | All your investments |
| `spendtrace_budgets` | Monthly budget limits |
| `spendtrace_api_key` | Your Gemini API key |

## Scripts

- `npm run dev` — Start dev server on port 3000
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview the production build
- `npm run lint` — TypeScript type checking
