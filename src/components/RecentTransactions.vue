<script setup lang="ts">
import type { Transaction } from "../types/transaction";

defineProps<{
  transactions: Transaction[];
}>();

function formatAmount(transaction: Transaction): string {
  const prefix = transaction.type === "income" ? "+" : "-";

  return `${prefix}$${transaction.amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
</script>

<template>
  <section class="transactions-panel">
    <div class="section-heading">
      <div>
        <h2>Recent Transactions</h2>
        <p>Your latest financial activity</p>
      </div>

      <button class="view-all-btn">View all →</button>
    </div>

    <div class="table-wrapper">
      <table class="transactions-table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Category</th>
            <th>Date</th>
            <th class="amount-column">Amount</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in transactions" :key="item.id">
            <td>
              <div class="transaction-name">
                <span class="transaction-indicator" :class="item.type">
                  {{ item.type === "income" ? "↙" : "↗" }}
                </span>
                <strong>{{ item.title }}</strong>
              </div>
            </td>

            <td>
              <span class="category-label">{{ item.category }}</span>
            </td>

            <td>{{ item.date }}</td>

            <td class="amount-column" :class="item.type">
              {{ formatAmount(item) }}
            </td>
          </tr>

          <tr v-if="transactions.length === 0">
            <td colspan="4" class="empty-state">No transactions yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
