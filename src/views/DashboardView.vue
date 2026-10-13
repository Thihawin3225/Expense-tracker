<script setup lang="ts">
import AppSidebar from "../components/AppSidebar.vue";
import AppNavbar from "../components/AppNavbar.vue";
import SummaryCard from "../components/SummaryCard.vue";
import RecentTransactions from "../components/RecentTransactions.vue";

interface Transaction {
  id: number;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
}

const transactions: Transaction[] = [
  {
    id: 1,
    title: "Monthly Salary",
    category: "Salary",
    date: "Oct 12, 2026",
    amount: 3500,
    type: "income",
  },
  {
    id: 2,
    title: "Grocery Shopping",
    category: "Food",
    date: "Oct 11, 2026",
    amount: 85.5,
    type: "expense",
  },
  {
    id: 3,
    title: "Internet Bill",
    category: "Utilities",
    date: "Oct 10, 2026",
    amount: 35,
    type: "expense",
  },
  {
    id: 4,
    title: "Freelance Project",
    category: "Other Income",
    date: "Oct 09, 2026",
    amount: 450,
    type: "income",
  },
  {
    id: 5,
    title: "Transportation",
    category: "Transport",
    date: "Oct 08, 2026",
    amount: 25,
    type: "expense",
  },
];

const totalIncome = transactions
  .filter((item) => item.type === "income")
  .reduce((sum, item) => sum + item.amount, 0);

const totalExpenses = transactions
  .filter((item) => item.type === "expense")
  .reduce((sum, item) => sum + item.amount, 0);

const totalBalance = totalIncome - totalExpenses;

const savingsRate =
  totalIncome > 0 ? ((totalBalance / totalIncome) * 100).toFixed(1) : "0.0";

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
</script>

<template>
  <div class="app-layout">
    <AppSidebar />

    <main class="main-content">
      <AppNavbar />

      <div class="dashboard-content">
        <div class="welcome-section">
          <div>
            <h2>Financial Overview</h2>
            <p>Track your money and manage your expenses.</p>
          </div>

          <button class="primary-btn">+ Add Transaction</button>
        </div>

        <section class="summary-grid">
          <SummaryCard
            title="Total Balance"
            :amount="formatCurrency(totalBalance)"
            icon="$"
            color="#dbeafe"
            change="Your current net balance"
          />

          <SummaryCard
            title="Total Income"
            :amount="formatCurrency(totalIncome)"
            icon="↙"
            color="#dcfce7"
            change="All recorded income"
          />

          <SummaryCard
            title="Total Expenses"
            :amount="formatCurrency(totalExpenses)"
            icon="↗"
            color="#fee2e2"
            change="All recorded expenses"
          />

          <SummaryCard
            title="Savings Rate"
            :amount="`${savingsRate}%`"
            icon="%"
            color="#f3e8ff"
            change="Balance ÷ income"
          />
        </section>

        <section class="overview-grid">
          <div class="chart-placeholder">
            <div class="section-heading">
              <div>
                <h2>Expense Overview</h2>
                <p>Your spending at a glance</p>
              </div>
              <span class="period-label">This month</span>
            </div>

            <div class="chart-message">
              <span class="chart-symbol">▥</span>
              <strong>Expense analytics</strong>
              <p>We'll add interactive charts in Lesson 5.</p>
            </div>
          </div>

          <div class="budget-card">
            <h2>Quick Summary</h2>
            <p>Income minus expenses</p>

            <div class="budget-row">
              <span>Total Income</span>
              <strong class="income">{{ formatCurrency(totalIncome) }}</strong>
            </div>

            <div class="budget-row">
              <span>Total Expenses</span>
              <strong class="expense">{{
                formatCurrency(totalExpenses)
              }}</strong>
            </div>

            <div class="budget-divider"></div>

            <div class="budget-row balance-row">
              <span>Remaining</span>
              <strong>{{ formatCurrency(totalBalance) }}</strong>
            </div>
          </div>
        </section>

        <RecentTransactions :transactions="transactions" />
      </div>
    </main>
  </div>
</template>
