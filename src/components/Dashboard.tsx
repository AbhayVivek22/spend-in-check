import React from "react";
import { formatCurrency, formatDate } from "../lib/utils";
import type { Expense } from "../types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface DashboardProps {
  expenses: Expense[];
}

const COLORS = ['#10b981', '#a1a1aa', '#6366f1', '#f43f5e', '#8b5cf6', '#0ea5e9', '#eab308', '#ec4899', '#14b8a6'];

export default function Dashboard({ expenses }: DashboardProps) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryData = expenses.reduce((acc, curr) => {
    const existing = acc.find((item) => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]).sort((a, b) => b.value - a.value);

  const recentExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="flex-1 w-full max-w-lg mx-auto p-4 pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-black font-bold text-xs italic">W</span>
            Wallet<span className="font-bold text-emerald-500">AI</span>
          </h1>
          <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold">Overview</p>
        </div>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500 opacity-[0.03] rounded-full blur-2xl"></div>
        <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Total Spent</h2>
        <p className="text-4xl font-light text-white tracking-tight">{formatCurrency(totalSpent)}</p>
      </div>

      {expenses.length > 0 ? (
        <>
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
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

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
                      <p className="text-[10px] tracking-wider uppercase font-medium text-zinc-500 mt-1">{formatDate(expense.date)} • {expense.category}</p>
                    </div>
                  </div>
                  <p className="font-mono text-zinc-100 text-sm">-{formatCurrency(expense.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed mt-2">
          <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 border border-zinc-700/50">
            <svg className="w-8 h-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-zinc-100 font-bold text-sm">No expenses yet</h3>
          <p className="text-zinc-500 text-xs mt-1">Add your first expense to see your dashboard.</p>
        </div>
      )}
    </div>
  );
}
