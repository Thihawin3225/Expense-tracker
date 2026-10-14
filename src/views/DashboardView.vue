<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

import AppSidebar from "../components/AppSidebar.vue";
import AppNavbar from "../components/AppNavbar.vue";
import RecentTransactions from "../components/RecentTransactions.vue";

import { useTransactionStore } from "../stores/transactions";
import type { Transaction, TransactionCategory } from "../types/transaction";

const store = useTransactionStore();
const router = useRouter();

const categories: TransactionCategory[] = [
  "Salary",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Education",
  "Entertainment",
  "Other",
];

function formatCurrency(amount: number): string {
  return `MMK ${Math.abs(amount).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
}

const recentTransactions = computed(() =>
  [...store.transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5),
);

const usedCategories = computed(
  () => new Set(store.transactions.map((item) => item.category)).size,
);

const expenseByCategory = computed(() => {
  const totals = new Map<string, number>();

  store.transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount);
    });

  return [...totals.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      percentage:
        store.totalExpenses > 0 ? (amount / store.totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
});

const incomeByCategory = computed(() => {
  const totals = new Map<string, number>();

  store.transactions
    .filter((item) => item.type === "income")
    .forEach((item) => {
      totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount);
    });

  return [...totals.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      percentage:
        store.totalIncome > 0 ? (amount / store.totalIncome) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
});

const topExpense = computed(() => expenseByCategory.value[0]);

function goToTransactions() {
  router.push("/transactions");
}

function goToReports() {
  router.push("/reports");
}

// Keep the shared Transaction type available for this view's data.
const _transactionTypeCheck = (item: Transaction) => item.id;
void _transactionTypeCheck;
</script>

<template>
  <div class="app-layout">
    <AppSidebar />

    <main class="main-content">
      <AppNavbar />

      <div class="dashboard-content new-dashboard">
        <!-- Header -->
        <header class="dashboard-page-header">
          <div>
            <h1>Dashboard</h1>
            <p>{{ store.transactions.length }} transactions tracked</p>
          </div>

          <button class="primary-btn" @click="goToTransactions">
            <span class="add-symbol">＋</span>
            Add transaction
          </button>
        </header>

        <!-- Summary cards -->
        <section class="dashboard-stats">
          <article class="dashboard-stat-card">
            <div class="stat-icon stat-icon-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="6" width="18" height="14" rx="2" />
                <path d="M3 9h18M16 14h2" />
                <path d="M6 6V4h13" />
              </svg>
            </div>

            <div class="stat-details">
              <span class="stat-label">BALANCE</span>
              <strong>{{ formatCurrency(store.totalBalance) }}</strong>
              <p>Income minus expenses</p>
            </div>
          </article>

          <article class="dashboard-stat-card">
            <div class="stat-icon stat-icon-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m3 17 6-6 4 4 8-9" />
                <path d="M15 6h6v6" />
              </svg>
            </div>

            <div class="stat-details">
              <span class="stat-label">TOTAL INCOME</span>
              <strong>{{ formatCurrency(store.totalIncome) }}</strong>
              <p>All recorded earnings</p>
            </div>
          </article>

          <article class="dashboard-stat-card">
            <div class="stat-icon stat-icon-red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m3 7 6 6 4-4 8 9" />
                <path d="M15 18h6v-6" />
              </svg>
            </div>

            <div class="stat-details">
              <span class="stat-label">TOTAL EXPENSE</span>
              <strong>{{ formatCurrency(store.totalExpenses) }}</strong>
              <p>All recorded spending</p>
            </div>
          </article>

          <article class="dashboard-stat-card">
            <div class="stat-icon stat-icon-orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2v10h10A10 10 0 1 1 12 2Z" />
                <path d="M16 2.7A10 10 0 0 1 21.3 8H16Z" />
              </svg>
            </div>

            <div class="stat-details">
              <span class="stat-label">CATEGORIES USED</span>
              <strong>{{ usedCategories }} of {{ categories.length }}</strong>
              <p>
                Top spend:
                {{
                  formatCurrency(topExpense?.amount ?? 0).replace("MMK ", "")
                }}
              </p>
            </div>
          </article>
        </section>

        <!-- Category summaries -->
        <section class="category-overview">
          <!-- Expense by category -->
          <article class="category-panel">
            <header class="category-panel-header">
              <div>
                <h2>Expense by category</h2>
                <p>{{ formatCurrency(store.totalExpenses) }} spent in total</p>
              </div>

              <span class="category-count expense-count">
                ◷ {{ expenseByCategory.length }} categories
              </span>
            </header>

            <div v-if="expenseByCategory.length" class="category-list">
              <div
                v-for="item in expenseByCategory"
                :key="item.category"
                class="category-row"
              >
                <div class="category-row-info">
                  <span>{{ item.category }}</span>
                  <strong>{{ formatCurrency(item.amount) }}</strong>
                  <small>{{ Math.round(item.percentage) }}%</small>
                </div>

                <div class="category-progress expense-progress">
                  <div
                    class="category-progress-fill"
                    :style="{ width: `${item.percentage}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <div v-else class="category-empty">
              No expense transactions yet.
            </div>
          </article>

          <!-- Income by category -->
          <article class="category-panel">
            <header class="category-panel-header">
              <div>
                <h2>Income by category</h2>
                <p>{{ formatCurrency(store.totalIncome) }} earned in total</p>
              </div>

              <span class="category-count income-count">
                ↗ {{ incomeByCategory.length }} categories
              </span>
            </header>

            <div v-if="incomeByCategory.length" class="category-list">
              <div
                v-for="item in incomeByCategory"
                :key="item.category"
                class="category-row"
              >
                <div class="category-row-info">
                  <span>{{ item.category }}</span>
                  <strong>{{ formatCurrency(item.amount) }}</strong>
                  <small>{{ Math.round(item.percentage) }}%</small>
                </div>

                <div class="category-progress income-progress">
                  <div
                    class="category-progress-fill"
                    :style="{ width: `${item.percentage}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <div v-else class="category-empty">No income transactions yet.</div>
          </article>
        </section>

        <!-- Recent transactions -->
        <section class="recent-transactions-panel">
          <header class="recent-panel-header">
            <div>
              <h2>Recent transactions</h2>
              <p>Last {{ recentTransactions.length }} entries</p>
            </div>

            <button class="view-all-link" @click="goToTransactions">All</button>
          </header>

          <RecentTransactions :transactions="recentTransactions" />
        </section>
      </div>
    </main>
  </div>
</template>
