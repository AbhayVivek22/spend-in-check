import React, { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Expense } from "./types";
import Dashboard from "./components/Dashboard";
import AddExpense from "./components/AddExpense";
import History from "./components/History";
import Settings from "./components/Settings";
import BottomNav from "./components/BottomNav";

export default function App() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("spendtrace_expenses", []);
  const [apiKey, setApiKey] = useLocalStorage<string>("spendtrace_api_key", "");
  const [currentTab, setCurrentTab] = useState<"dashboard" | "add" | "history" | "settings">("dashboard");

  const handleAddExpense = (expenseData: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
    };
    setExpenses([...expenses, newExpense]);
    setCurrentTab("dashboard");
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleImport = (importedExpenses: Expense[]) => {
    // Basic merge preventing exact id duplicates
    const currentIds = new Set(expenses.map(e => e.id));
    const toAdd = importedExpenses.filter(e => !currentIds.has(e.id));
    setExpenses([...expenses, ...toAdd]);
  };

  return (
    <div className="bg-[#0A0A0A] min-h-[100dvh] flex flex-col font-sans antialiased text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      <main className="flex-1 w-full flex flex-col overflow-x-hidden">
        {currentTab === "dashboard" && <Dashboard expenses={expenses} />}
        {currentTab === "add" && <AddExpense onAdd={handleAddExpense} onCancel={() => setCurrentTab("dashboard")} />}
        {currentTab === "history" && <History expenses={expenses} onDelete={handleDeleteExpense} />}
        {currentTab === "settings" && (
          <Settings 
            apiKey={apiKey} 
            onApiKeyChange={setApiKey} 
            expenses={expenses} 
            onImport={handleImport} 
          />
        )}
      </main>

      <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />
    </div>
  );
}
