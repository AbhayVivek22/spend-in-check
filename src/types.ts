export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string; // ISO string
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
}

export interface Investment {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: string;
}

export interface Budget {
  month: string;
  amount: number;
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

export const INCOME_SOURCES = [
  "Salary",
  "Freelance",
  "Business",
  "Dividends",
  "Rental Income",
  "Gift",
  "Refund",
  "Other",
];

export const INVESTMENT_TYPES = [
  "Stocks",
  "Mutual Funds",
  "Real Estate",
  "Crypto",
  "Fixed Deposit",
  "Gold",
  "Bonds",
  "PPF / EPF",
  "Other",
];
