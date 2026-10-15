export type TransactionType = "income" | "expense";

export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Health"
  | "Shopping"
  | "Travel"
  | "Fitness"
  | "Bills & Fees"
  | "Other Expense";

export type IncomeCategory = "Salary" | "Gift" | "Freelance" | "Investment";

export type TransactionCategory = ExpenseCategory | IncomeCategory;

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  note?: string;
}
export interface TransactionForm {
  title: string;
  amount: number | null;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  note: string;
}
