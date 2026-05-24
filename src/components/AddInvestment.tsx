import React, { useState } from "react";
import { INVESTMENT_TYPES } from "../types";
import type { Investment } from "../types";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

interface AddInvestmentProps {
  onAdd: (investment: Omit<Investment, "id">) => void;
  onCancel?: () => void;
}

export default function AddInvestment({ onAdd, onCancel }: AddInvestmentProps) {
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<string>(INVESTMENT_TYPES[0]);
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || !date) return;

    onAdd({
      amount: Number(amount),
      type,
      description,
      date: new Date(date).toISOString(),
    });

    setAmount("");
    setDescription("");
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
            <h1 className="text-2xl font-light text-white tracking-tight">Add Investment</h1>
            <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold">Log where your money grows</p>
          </div>
        </div>
      </header>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-blue-400 font-medium text-xl">₹</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl pl-8 pr-4 py-3 text-xl font-medium text-blue-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Investment Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-blue-500 transition-colors appearance-none"
            >
              {INVESTMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g. Bought 10 shares of AAPL"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-blue-500 transition-colors"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              type="submit"
              className="w-full py-4 bg-blue-500/20 border border-blue-500/30 text-blue-400 font-black rounded-2xl hover:bg-blue-500/30 active:scale-95 transition-all text-center uppercase tracking-widest text-xs"
            >
              Add Investment
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
