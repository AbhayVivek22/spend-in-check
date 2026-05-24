import React from "react";
import { Wallet, TrendingUp, ArrowLeft } from "lucide-react";

interface AddTransactionChooserProps {
  onSelect: (type: "expense" | "income" | "investment") => void;
  onCancel: () => void;
}

export default function AddTransactionChooser({ onSelect, onCancel }: AddTransactionChooserProps) {
  return (
    <div className="flex-1 w-full max-w-lg mx-auto p-4 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="py-6 mb-2">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <div>
            <h1 className="text-2xl font-light text-white tracking-tight">Add Transaction</h1>
            <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold">Choose transaction type</p>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        <button
          onClick={() => onSelect("expense")}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-800/50 active:scale-[0.98] transition-all text-left group"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <Wallet className="w-7 h-7 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium text-white">Add Expense</p>
              <p className="text-sm text-zinc-500 mt-1">Record money you've spent</p>
            </div>
            <span className="text-3xl text-zinc-700 group-hover:text-zinc-500 transition-colors">→</span>
          </div>
        </button>

        <button
          onClick={() => onSelect("income")}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-800/50 active:scale-[0.98] transition-all text-left group"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium text-white">Add Income</p>
              <p className="text-sm text-zinc-500 mt-1">Track money you've earned or received</p>
            </div>
            <span className="text-3xl text-zinc-700 group-hover:text-zinc-500 transition-colors">→</span>
          </div>
        </button>

        <button
          onClick={() => onSelect("investment")}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-800/50 active:scale-[0.98] transition-all text-left group"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium text-white">Add Investment</p>
              <p className="text-sm text-zinc-500 mt-1">Log where you've put your money to grow</p>
            </div>
            <span className="text-3xl text-zinc-700 group-hover:text-zinc-500 transition-colors">→</span>
          </div>
        </button>
      </div>
    </div>
  );
}
