import React, { useState } from "react";
import { CATEGORIES } from "../types";
import type { Expense } from "../types";
import { format } from "date-fns";

interface AddExpenseProps {
  onAdd: (expense: Omit<Expense, "id">) => void;
  onCancel?: () => void;
}

export default function AddExpense({ onAdd, onCancel }: AddExpenseProps) {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || !description || !date) return;

    onAdd({
      amount: Number(amount),
      description,
      category,
      date: new Date(date).toISOString(),
    });
    
    // Reset form
    setAmount("");
    setDescription("");
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto p-4 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="py-6 mb-2">
        <h1 className="text-2xl font-light text-white tracking-tight">Add Expense</h1>
        <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold">Record a transaction</p>
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
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g. Dinner at Nobu..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
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
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors dark-color-scheme-override"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              type="submit"
              className="w-full py-4 bg-zinc-100 text-black font-black rounded-2xl hover:bg-white active:scale-95 transition-all text-center"
            >
              ADD TRANSACTION
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
