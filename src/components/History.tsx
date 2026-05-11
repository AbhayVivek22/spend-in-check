import React, { useState } from "react";
import { formatCurrency, formatDate } from "../lib/utils";
import type { Expense } from "../types";
import { Search, Trash2 } from "lucide-react";

interface HistoryProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export default function History({ expenses, onDelete }: HistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredExpenses = expenses
    .filter((e) => {
      const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase()) || e.category.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      
      const expenseDate = new Date(e.date).getTime();
      if (fromDate && expenseDate < new Date(fromDate).getTime()) return false;
      if (toDate && expenseDate > new Date(toDate).getTime() + 86400000) return false; // add one day to include the end date fully
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group by month
  const groupedExpenses = filteredExpenses.reduce((groups, expense) => {
    const date = new Date(expense.date);
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  return (
    <div className="flex-1 w-full max-w-lg mx-auto p-4 pb-24 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="py-6 shrink-0">
        <h1 className="text-2xl font-light tracking-tight text-white">History</h1>
        <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold">All your transactions</p>
      </header>

      <div className="relative mb-4 shrink-0">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-500" />
        </div>
        <input
          type="text"
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      <div className="flex gap-3 mb-6 shrink-0">
        <div className="flex-1 space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest pl-1">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors dark-color-scheme-override"
            style={{ colorScheme: 'dark' }}
          />
        </div>
        <div className="flex-1 space-y-1">
           <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest pl-1">To</label>
           <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors dark-color-scheme-override"
            style={{ colorScheme: 'dark' }}
          />
        </div>
        {(fromDate || toDate) && (
           <div className="flex flex-col justify-end pb-0.5">
             <button 
                onClick={() => { setFromDate(""); setToDate(""); }}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
                title="Clear Dates"
             >
               <Trash2 className="w-4 h-4" />
             </button>
           </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto w-full pb-4">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 text-sm">
            No expenses found.
          </div>
        ) : (
          Object.entries(groupedExpenses).map(([month, monthExpenses]) => (
            <div key={month} className="mb-8">
              <h3 className="text-[10px] font-bold text-zinc-500 mb-3 uppercase tracking-widest sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-sm py-2 z-10">{month}</h3>
              <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800 divide-y divide-zinc-800/50 overflow-hidden">
                {monthExpenses.map((expense) => (
                  <div key={expense.id} className="p-4 py-5 flex justify-between items-center group hover:bg-zinc-800/20 transition-colors">
                    <div className="flex items-center gap-4 overflow-hidden">
                       <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[10px] border border-zinc-700 shrink-0">
                        {expense.category.substring(0, 3).toUpperCase()}
                      </span>
                      <div className="min-w-0 pr-2">
                        <p className="text-sm font-medium text-white truncate">{expense.description}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest truncate mt-1">{formatDate(expense.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <p className="font-mono text-zinc-100 text-sm border-r border-transparent group-hover:border-zinc-800 pr-3 transition-colors">
                        -{formatCurrency(expense.amount)}
                      </p>
                      <button 
                        onClick={() => onDelete(expense.id)}
                        className="p-2 text-zinc-600 hover:text-red-400 bg-transparent hover:bg-red-900/20 rounded-lg transition-colors md:opacity-0 md:group-hover:opacity-100 active:scale-95"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
