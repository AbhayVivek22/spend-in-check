export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string; // ISO string
}

export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Groceries",
  "Health & Fitness",
  "Travel",
  "Other",
];
