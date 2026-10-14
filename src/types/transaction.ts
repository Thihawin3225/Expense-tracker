export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "Salary"
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Health"
  | "Education"
  | "Entertainment"
  | "Other";

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
