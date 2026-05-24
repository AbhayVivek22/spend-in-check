import React, { useState } from "react";
import { formatCurrency, formatDate } from "../lib/utils";
import type { Expense, Income, Investment } from "../types";
import { Search, Trash2, TrendingUp, BarChart3 } from "lucide-react";

type HistoryFilter = "expenses" | "income" | "investments" | "all";

interface HistoryProps {
  expenses: Expense[];
  incomes: Income[];
  investments: Investment[];
  onDeleteExpense: (id: string) => void;
  onDeleteIncome: (id: string) => void;
  onDeleteInvestment: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
}

export default function History({
  expenses,
  incomes,
  investments,
  onDeleteExpense,
  onDeleteIncome,
  onDeleteInvestment,
  onEditExpense,
}: HistoryProps) {
  const [filter, setFilter] = useState<HistoryFilter>("expenses");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const selectedMonth = filterMonth && filterYear ? `${filterYear}-${filterMonth}` : "";

  const matchesDate = (dateStr: string) => {
    const expenseDate = new Date(dateStr).getTime();
    if (selectedMonth) {
      if (!dateStr.startsWith(selectedMonth)) return false;
    }
    if (fromDate && expenseDate < new Date(fromDate).getTime()) return false;
    if (toDate && expenseDate > new Date(toDate).getTime() + 86400000) return false;
    return true;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 + 2 }, (_, i) => 2020 + i);

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const filteredExpenses = expenses
    .filter((e) => {
      const matchesSearch =
        e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch && matchesDate(e.date);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredIncomes = incomes
    .filter((i) => {
      const matchesSearch = i.source.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch && matchesDate(i.date);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredInvestments = investments
    .filter((i) => {
      const matchesSearch =
        i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.type.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch && matchesDate(i.date);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  type TransactionItem =
    | { kind: "expense"; data: Expense }
    | { kind: "income"; data: Income }
    | { kind: "investment"; data: Investment };

  let items: TransactionItem[] = [];

  if (filter === "expenses") {
    items = filteredExpenses.map((e) => ({ kind: "expense" as const, data: e }));
  } else if (filter === "income") {
    items = filteredIncomes.map((i) => ({ kind: "income" as const, data: i }));
  } else if (filter === "investments") {
    items = filteredInvestments.map((i) => ({ kind: "investment" as const, data: i }));
  } else {
    items = [
      ...filteredExpenses.map((e) => ({ kind: "expense" as const, data: e })),
      ...filteredIncomes.map((i) => ({ kind: "income" as const, data: i })),
      ...filteredInvestments.map((i) => ({ kind: "investment" as const, data: i })),
    ];
  }

  items.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  const groupedItems = items.reduce((groups, item) => {
    const date = new Date(item.data.date);
    const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
    if (!groups[monthYear]) groups[monthYear] = [];
    groups[monthYear].push(item);
    return groups;
  }, {} as Record<string, TransactionItem[]>);

  const filterTabs: { id: HistoryFilter; label: string }[] = [
    { id: "expenses", label: "Expenses" },
    { id: "income", label: "Income" },
    { id: "investments", label: "Invest" },
    { id: "all", label: "All" },
  ];

  const renderItem = (item: TransactionItem) => {
    if (item.kind === "expense") {
      const e = item.data as Expense;
      return (
        <div
          key={e.id}
          onClick={() => onEditExpense(e)}
          className="p-4 py-5 flex justify-between items-center group hover:bg-zinc-800/20 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4 overflow-hidden">
            <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[10px] border border-zinc-700 shrink-0">
              {e.category.substring(0, 3).toUpperCase()}
            </span>
            <div className="min-w-0 pr-2">
              <p className="text-sm font-medium text-white truncate">{e.description}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest truncate mt-1">
                {formatDate(e.date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <p className="font-mono text-zinc-100 text-sm pr-2 transition-colors">
              -{formatCurrency(e.amount)}
            </p>
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                onDeleteExpense(e.id);
              }}
              className="p-2 text-zinc-600 hover:text-red-400 bg-transparent hover:bg-red-900/20 rounded-lg transition-colors active:scale-95"
              title="Delete expense"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    if (item.kind === "income") {
      const i = item.data as Income;
      return (
        <div
          key={`income-${i.id}`}
          className="p-4 py-5 flex justify-between items-center group hover:bg-zinc-800/20 transition-colors"
        >
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0 pr-2">
              <p className="text-sm font-medium text-white truncate">{i.source}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest truncate mt-1">
                {formatDate(i.date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <p className="font-mono text-emerald-400 text-sm border-r border-transparent pr-3 transition-colors">
              +{formatCurrency(i.amount)}
            </p>
            <button
              onClick={() => onDeleteIncome(i.id)}
              className="p-2 text-zinc-600 hover:text-red-400 bg-transparent hover:bg-red-900/20 rounded-lg transition-colors md:opacity-0 md:group-hover:opacity-100 active:scale-95"
              title="Delete income"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }

    if (item.kind === "investment") {
      const inv = item.data as Investment;
      return (
        <div
          key={`investment-${inv.id}`}
          className="p-4 py-5 flex justify-between items-center group hover:bg-zinc-800/20 transition-colors"
        >
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="min-w-0 pr-2">
              <p className="text-sm font-medium text-white truncate">
                {inv.description || inv.type}
              </p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest truncate mt-1">
                {formatDate(inv.date)} &bull; {inv.type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <p className="font-mono text-blue-400 text-sm border-r border-transparent pr-3 transition-colors">
              {formatCurrency(inv.amount)}
            </p>
            <button
              onClick={() => onDeleteInvestment(inv.id)}
              className="p-2 text-zinc-600 hover:text-red-400 bg-transparent hover:bg-red-900/20 rounded-lg transition-colors md:opacity-0 md:group-hover:opacity-100 active:scale-95"
              title="Delete investment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto p-4 pb-24 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="py-6 shrink-0">
        <h1 className="text-2xl font-light tracking-tight text-white">History</h1>
        <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold">
          All your transactions
        </p>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-zinc-900/50 border border-zinc-800 rounded-xl p-1 mb-4 shrink-0">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              filter === tab.id
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 shrink-0">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-500" />
        </div>
        <input
          type="text"
          placeholder={
            filter === "expenses"
              ? "Search expenses..."
              : filter === "income"
                ? "Search income..."
                : filter === "investments"
                  ? "Search investments..."
                  : "Search all transactions..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Month Filter */}
      <div className="mb-4 shrink-0">
        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest pl-1 block mb-1">
          Filter by Month
        </label>
        <div className="flex gap-2">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
          >
            <option value="">Month</option>
            {MONTH_NAMES.map((name, i) => (
              <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{name}</option>
            ))}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="w-28 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>
        </div>
        {selectedMonth && (
          <button
            onClick={() => { setFilterMonth(""); setFilterYear(""); }}
            className="text-[10px] text-emerald-500 hover:text-emerald-400 mt-1 font-medium uppercase tracking-wider"
          >
            Clear month filter
          </button>
        )}
      </div>

      {/* Date Range */}
      <div className="flex gap-3 mb-6 shrink-0">
        <div className="flex-1 space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest pl-1">
            From
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors"
            style={{ colorScheme: "dark" }}
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest pl-1">
            To
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors"
            style={{ colorScheme: "dark" }}
          />
        </div>
        {(fromDate || toDate) && (
          <div className="flex flex-col justify-end pb-0.5">
            <button
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
              title="Clear Dates"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto w-full pb-4">
        {items.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 text-sm">
            {filter === "expenses"
              ? "No expenses found."
              : filter === "income"
                ? "No income found."
                : filter === "investments"
                  ? "No investments found."
                  : "No transactions found."}
          </div>
        ) : (
          Object.entries(groupedItems).map(([month, monthItems]) => (
            <div key={month} className="mb-8">
              <h3 className="text-[10px] font-bold text-zinc-500 mb-3 uppercase tracking-widest sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-sm py-2 z-10">
                {month}
              </h3>
              <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800 divide-y divide-zinc-800/50 overflow-hidden">
                {monthItems.map((item) => renderItem(item))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
