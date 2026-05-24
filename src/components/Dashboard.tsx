import React, { useState } from "react";
import { formatCurrency, formatDate } from "../lib/utils";
import type { Expense, Income, Budget } from "../types";
import { format } from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface DashboardProps {
  expenses: Expense[];
  incomes: Income[];
  budgets: Budget[];
}

const COLORS = [
  "#10b981", "#a1a1aa", "#6366f1", "#f43f5e", "#8b5cf6",
  "#0ea5e9", "#eab308", "#ec4899", "#14b8a6",
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getMonthsInRange(from: string, to: string): string[] {
  if (from > to) [from, to] = [to, from];
  const months: string[] = [];
  let [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  while (fy < ty || (fy === ty && fm <= tm)) {
    months.push(`${fy}-${String(fm).padStart(2, "0")}`);
    fm++;
    if (fm > 12) { fm = 1; fy++; }
  }
  return months;
}

function getDaysInRange(from: string, to: string): Date[] {
  if (from > to) [from, to] = [to, from];
  const days: Date[] = [];
  const start = new Date(from + "-01");
  const end = new Date(to + "-01");
  end.setMonth(end.getMonth() + 1);
  end.setDate(0);
  const cur = new Date(start);
  while (cur <= end) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

export default function Dashboard({ expenses, incomes, budgets }: DashboardProps) {
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const defaultFrom = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const defaultFromStr = `${defaultFrom.getFullYear()}-${String(defaultFrom.getMonth() + 1).padStart(2, "0")}`;

  const [chartMode, setChartMode] = useState<"overall" | "daily">("overall");
  const [chartFrom, setChartFrom] = useState(defaultFromStr);
  const [chartTo, setChartTo] = useState(currentMonthKey);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const thisMonthExpenses = expenses.filter((e) => e.date.startsWith(currentMonthKey));
  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const thisMonthIncomes = incomes.filter((i) => i.date.startsWith(currentMonthKey));
  const thisMonthIncomeTotal = thisMonthIncomes.reduce((sum, i) => sum + i.amount, 0);

  const currentBudget = budgets.find((b) => b.month === currentMonthKey && b.amount > 0);
  const budgetProgress = currentBudget ? (thisMonthTotal / currentBudget.amount) * 100 : null;

  const categoryData = expenses
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[])
    .sort((a, b) => b.value - a.value);

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const chartData = (() => {
    if (chartMode === "overall") {
      return getMonthsInRange(chartFrom, chartTo).map((m) => {
        const total = expenses
          .filter((e) => e.date.startsWith(m))
          .reduce((sum, e) => sum + e.amount, 0);
        const d = new Date(m + "-01");
        return { name: d.toLocaleString("default", { month: "short", year: "2-digit" }), amount: total };
      });
    }
    return getDaysInRange(chartFrom, chartTo).map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const total = expenses
        .filter((e) => e.date.startsWith(dateStr))
        .reduce((sum, e) => sum + e.amount, 0);
      return { name: format(date, "d MMM"), amount: total };
    });
  })();

  const hasChartData = chartData.some((d) => d.amount > 0);

  const years = Array.from({ length: now.getFullYear() - 2019 + 2 }, (_, i) => 2020 + i);

  return (
    <div className="flex-1 w-full max-w-lg mx-auto p-4 pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-black font-bold text-xs italic">
              W
            </span>
            Wallet<span className="font-bold text-emerald-500">AI</span>
          </h1>
          <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold">Overview</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Spent</p>
          <p className="text-lg font-semibold text-red-400 truncate">
            -{formatCurrency(thisMonthTotal)}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Income</p>
          <p className="text-lg font-semibold text-emerald-400 truncate">
            +{formatCurrency(thisMonthIncomeTotal)}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">
            {currentBudget
              ? budgetProgress !== null && budgetProgress > 100
                ? "Over"
                : "Left"
              : "Net"}
          </p>
          <p
            className={`text-lg font-semibold truncate ${
              currentBudget
                ? budgetProgress !== null && budgetProgress > 100
                  ? "text-red-400"
                  : budgetProgress !== null && budgetProgress > 70
                    ? "text-yellow-400"
                    : "text-emerald-400"
                : thisMonthIncomeTotal - thisMonthTotal >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
            }`}
          >
            {currentBudget
              ? formatCurrency(currentBudget.amount - thisMonthTotal)
              : formatCurrency(thisMonthIncomeTotal - thisMonthTotal)}
          </p>
        </div>
      </div>

      {/* Budget Progress Bar */}
      {currentBudget && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Monthly Budget</p>
            <p className="text-xs text-zinc-400">
              {formatCurrency(thisMonthTotal)} / {formatCurrency(currentBudget.amount)}
            </p>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetProgress !== null && budgetProgress > 90
                  ? "bg-red-500"
                  : budgetProgress !== null && budgetProgress > 70
                    ? "bg-yellow-500"
                    : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(budgetProgress ?? 0, 100)}%` }}
            />
          </div>
          {budgetProgress !== null && budgetProgress > 100 && (
            <p className="text-[10px] text-red-400 mt-1 font-medium">
              {Math.round(budgetProgress - 100)}% over budget
            </p>
          )}
        </div>
      )}

      {/* Total Spent Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500 opacity-[0.03] rounded-full blur-2xl" />
        <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Total Spent (All Time)</h2>
        <p className="text-4xl font-light text-white tracking-tight">{formatCurrency(totalSpent)}</p>
      </div>

      {expenses.length > 0 ? (
        <>
          {/* Line Chart */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-100">Spending Trend</h3>
              <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                <button
                  onClick={() => setChartMode("overall")}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    chartMode === "overall" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Overall
                </button>
                <button
                  onClick={() => setChartMode("daily")}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    chartMode === "daily" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Daily
                </button>
              </div>
            </div>

            {/* Month Range Selectors — single line */}
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider shrink-0">From</span>
              <select
                value={chartFrom.split("-")[1]}
                onChange={(e) => {
                  const y = chartFrom.split("-")[0];
                  setChartFrom(`${y}-${e.target.value}`);
                }}
                className="flex-1 min-w-0 bg-black border border-zinc-800 rounded-lg px-2 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
              >
                {MONTH_NAMES.map((name, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{name.substring(0, 3)}</option>
                ))}
              </select>
              <select
                value={chartFrom.split("-")[0]}
                onChange={(e) => {
                  const m = chartFrom.split("-")[1];
                  setChartFrom(`${e.target.value}-${m}`);
                }}
                className="w-[72px] bg-black border border-zinc-800 rounded-lg px-2 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
              >
                {years.map((y) => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider shrink-0 ml-1">To</span>
              <select
                value={chartTo.split("-")[1]}
                onChange={(e) => {
                  const y = chartTo.split("-")[0];
                  setChartTo(`${y}-${e.target.value}`);
                }}
                className="flex-1 min-w-0 bg-black border border-zinc-800 rounded-lg px-2 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
              >
                {MONTH_NAMES.map((name, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{name.substring(0, 3)}</option>
                ))}
              </select>
              <select
                value={chartTo.split("-")[0]}
                onChange={(e) => {
                  const m = chartTo.split("-")[1];
                  setChartTo(`${e.target.value}-${m}`);
                }}
                className="w-[72px] bg-black border border-zinc-800 rounded-lg px-2 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
              >
                {years.map((y) => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>
            </div>

            <div className="h-48 w-full">
              {hasChartData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#a1a1aa", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      interval={chartMode === "daily" ? Math.max(1, Math.floor(chartData.length / 8)) : undefined}
                    />
                    <YAxis
                      tick={{ fill: "#a1a1aa", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #27272a",
                        background: "#18181b",
                        color: "#e4e4e7",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#spendGradient)"
                      dot={chartMode === "overall" ? { fill: "#10b981", r: 3 } : false}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                  No spending data in this range
                </div>
              )}
            </div>
          </div>

          {/* Category Pie Chart */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 shadow-sm mt-2">
            <h3 className="text-sm font-bold text-zinc-100 mb-4">Spending by Category</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-zinc-100">Recent Transactions</h3>
            </div>
            <div className="space-y-5">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-medium text-sm">
                      {expense.category.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{expense.description}</p>
                      <p className="text-[10px] tracking-wider uppercase font-medium text-zinc-500 mt-1">
                        {formatDate(expense.date)} &bull; {expense.category}
                      </p>
                    </div>
                  </div>
                  <p className="font-mono text-zinc-100 text-sm">
                    -{formatCurrency(expense.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed mt-2">
          <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 border border-zinc-700/50">
            <svg className="w-8 h-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="text-zinc-100 font-bold text-sm">No expenses yet</h3>
          <p className="text-zinc-500 text-xs mt-1">
            Add your first expense to see your dashboard.
          </p>
        </div>
      )}
    </div>
  );
}
