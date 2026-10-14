import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import type { Transaction, TransactionForm } from "../types/transaction";

const STORAGE_KEY = "expense-tracker-transactions";

const sampleTransactions: Transaction[] = [
  {
    id: "sample-1",
    title: "Monthly Salary",
    amount: 3500,
    type: "income",
    category: "Salary",
    date: "2026-10-12",
  },
  {
    id: "sample-2",
    title: "Grocery Shopping",
    amount: 85.5,
    type: "expense",
    category: "Food",
    date: "2026-10-11",
  },
  {
    id: "sample-3",
    title: "Internet Bill",
    amount: 35,
    type: "expense",
    category: "Bills",
    date: "2026-10-10",
  },
  {
    id: "sample-4",
    title: "Freelance Project",
    amount: 450,
    type: "income",
    category: "Other",
    date: "2026-10-09",
  },
];

function loadTransactions(): Transaction[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      return sampleTransactions;
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as Transaction[];
  } catch {
    return [];
  }
}

export const useTransactionStore = defineStore("transactions", () => {
  const transactions = ref<Transaction[]>(loadTransactions());

  watch(
    transactions,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    },
    { deep: true },
  );

  const totalIncome = computed(() =>
    transactions.value
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0),
  );

  const totalExpenses = computed(() =>
    transactions.value
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0),
  );

  const totalBalance = computed(() => totalIncome.value - totalExpenses.value);

  function addTransaction(form: TransactionForm) {
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      amount: form.amount!,
      type: form.type,
      category: form.category,
      date: form.date,
      note: form.note.trim() || undefined,
    };

    transactions.value.unshift(transaction);
  }

  function updateTransaction(id: string, form: TransactionForm) {
    const index = transactions.value.findIndex((item) => item.id === id);

    if (index === -1) return;

    transactions.value[index] = {
      id,
      title: form.title.trim(),
      amount: form.amount!,
      type: form.type,
      category: form.category,
      date: form.date,
      note: form.note.trim() || undefined,
    };
  }

  function deleteTransaction(id: string) {
    transactions.value = transactions.value.filter((item) => item.id !== id);
  }

  return {
    transactions,
    totalIncome,
    totalExpenses,
    totalBalance,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
});
