import React, { useState } from "react";
import { INCOME_SOURCES } from "../types";
import type { Income } from "../types";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

interface AddIncomeProps {
  onAdd: (income: Omit<Income, "id">) => void;
  onCancel?: () => void;
}

export default function AddIncome({ onAdd, onCancel }: AddIncomeProps) {
  const [amount, setAmount] = useState<string>("");
  const [source, setSource] = useState<string>(INCOME_SOURCES[0]);
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || !date) return;

    onAdd({
      amount: Number(amount),
      source,
      date: new Date(date).toISOString(),
    });

    setAmount("");
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto p-4 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="py-6 mb-2">
        <div className="flex items-center gap-3">
          {onCancel && (
            <button onClick={onCancel} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-light text-white tracking-tight">Add Income</h1>
            <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold">Record money received</p>
          </div>
        </div>
      </header>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-emerald-400 font-medium text-xl">₹</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl pl-8 pr-4 py-3 text-xl font-medium text-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              {INCOME_SOURCES.map((src) => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              type="submit"
              className="w-full py-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black rounded-2xl hover:bg-emerald-500/30 active:scale-95 transition-all text-center uppercase tracking-widest text-xs"
            >
              Add Income
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-3 px-4 bg-transparent border border-zinc-700 text-zinc-400 font-medium rounded-2xl hover:bg-zinc-800 hover:text-zinc-300 active:scale-95 transition-all text-center"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
