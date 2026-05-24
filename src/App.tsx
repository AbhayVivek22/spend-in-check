import React, { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Expense, Income, Investment, Budget } from "./types";
import Dashboard from "./components/Dashboard";
import AddExpense from "./components/AddExpense";
import AddIncome from "./components/AddIncome";
import AddInvestment from "./components/AddInvestment";
import AddTransactionChooser from "./components/AddTransactionChooser";
import History from "./components/History";
import Settings from "./components/Settings";
import BottomNav from "./components/BottomNav";

type Tab = "dashboard" | "add" | "history" | "settings";
type AddSheet = null | "chooser" | "expense" | "income" | "investment";

export default function App() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("spendtrace_expenses", []);
  const [incomes, setIncomes] = useLocalStorage<Income[]>("spendtrace_incomes", []);
  const [investments, setInvestments] = useLocalStorage<Investment[]>("spendtrace_investments", []);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>("spendtrace_budgets", []);
  const [apiKey, setApiKey] = useLocalStorage<string>("spendtrace_api_key", "");

  const [currentTab, setCurrentTab] = useState<Tab>("dashboard");
  const [addSheet, setAddSheet] = useState<AddSheet>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleAddExpense = (expenseData: Omit<Expense, "id">) => {
    const newExpense: Expense = { ...expenseData, id: crypto.randomUUID() };
    setExpenses([...expenses, newExpense]);
    setAddSheet(null);
    setEditingExpense(null);
    setCurrentTab("dashboard");
  };

  const handleEditExpense = (id: string, expenseData: Omit<Expense, "id">) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...expenseData, id } : e)));
    setAddSheet(null);
    setEditingExpense(null);
    setCurrentTab("dashboard");
  };

  const handleStartEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setCurrentTab("add");
    setAddSheet("expense");
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleAddIncome = (incomeData: Omit<Income, "id">) => {
    const newIncome: Income = { ...incomeData, id: crypto.randomUUID() };
    setIncomes([...incomes, newIncome]);
    setAddSheet(null);
    setCurrentTab("dashboard");
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes(incomes.filter((i) => i.id !== id));
  };

  const handleAddInvestment = (investmentData: Omit<Investment, "id">) => {
    const newInvestment: Investment = { ...investmentData, id: crypto.randomUUID() };
    setInvestments([...investments, newInvestment]);
    setAddSheet(null);
    setCurrentTab("dashboard");
  };

  const handleDeleteInvestment = (id: string) => {
    setInvestments(investments.filter((i) => i.id !== id));
  };

  const handleImport = (importedExpenses: Expense[]) => {
    const currentIds = new Set(expenses.map((e) => e.id));
    const toAdd = importedExpenses.filter((e) => !currentIds.has(e.id));
    setExpenses([...expenses, ...toAdd]);
  };

  const handleSetBudget = (month: string, amount: number) => {
    if (amount <= 0) {
      setBudgets(budgets.filter((b) => b.month !== month));
      return;
    }
    const existing = budgets.findIndex((b) => b.month === month);
    if (existing >= 0) {
      setBudgets(budgets.map((b) => (b.month === month ? { month, amount } : b)));
    } else {
      setBudgets([...budgets, { month, amount }]);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
    if (tab === "add") {
      setAddSheet("chooser");
      setEditingExpense(null);
    } else {
      setAddSheet(null);
      setEditingExpense(null);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <Dashboard expenses={expenses} incomes={incomes} budgets={budgets} />;

      case "add":
        switch (addSheet) {
          case "chooser":
            return (
              <AddTransactionChooser
                onSelect={(type) => setAddSheet(type)}
                onCancel={() => handleTabChange("dashboard")}
              />
            );
          case "expense":
            return (
              <div key={editingExpense?.id ?? "new-expense"}>
                <AddExpense
                  onAdd={handleAddExpense}
                  onEdit={editingExpense ? handleEditExpense : undefined}
                  expenseToEdit={editingExpense ?? undefined}
                  onCancel={() => handleTabChange("dashboard")}
                />
              </div>
            );
          case "income":
            return <AddIncome onAdd={handleAddIncome} onCancel={() => handleTabChange("dashboard")} />;
          case "investment":
            return (
              <AddInvestment onAdd={handleAddInvestment} onCancel={() => handleTabChange("dashboard")} />
            );
          default:
            return null;
        }

      case "history":
        return (
          <History
            expenses={expenses}
            incomes={incomes}
            investments={investments}
            onDeleteExpense={handleDeleteExpense}
            onDeleteIncome={handleDeleteIncome}
            onDeleteInvestment={handleDeleteInvestment}
            onEditExpense={handleStartEdit}
          />
        );

      case "settings":
        return (
          <Settings
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            expenses={expenses}
            onImport={handleImport}
            budgets={budgets}
            onSetBudget={handleSetBudget}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-[100dvh] flex flex-col font-sans antialiased text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      <main className="flex-1 w-full flex flex-col overflow-x-hidden">{renderContent()}</main>
      <BottomNav currentTab={currentTab} onChangeTab={handleTabChange} />
    </div>
  );
}
