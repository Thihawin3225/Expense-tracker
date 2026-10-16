```vue
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AppSidebar from "../components/AppSidebar.vue";
import AppNavbar from "../components/AppNavbar.vue";
import TransactionForm from "../components/TransactionForm.vue";
import { useTransactionStore } from "../stores/transactions";
import type { Transaction, TransactionType } from "../types/transaction";

const store = useTransactionStore();

const showForm = ref(false);
const editingTransaction = ref<Transaction | null>(null);
const deleteTarget = ref<Transaction | null>(null);

const searchText = ref("");
const typeFilter = ref<"all" | TransactionType>("all");
const categoryFilter = ref("all");
const fromDate = ref("");
const toDate = ref("");

const selectedIds = ref<string[]>([]);
const currentPage = ref(1);
const pageSize = ref(5);

const availableCategories = computed(() =>
  [...new Set(store.transactions.map((item) => item.category))].sort(),
);

function formatCurrency(amount: number): string {
  return `MMK ${amount.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
}

function formatAmount(item: Transaction): string {
  const sign = item.type === "income" ? "+" : "-";
  return `${sign}${formatCurrency(item.amount)}`;
}

const filteredTransactions = computed(() => {
  const query = searchText.value.trim().toLowerCase();

  return [...store.transactions]
    .filter((item) => {
      const searchableText = [
        item.title,
        item.category,
        item.note ?? "",
        item.date,
        String(item.amount),
        formatCurrency(item.amount),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(query);
      const matchesType =
        typeFilter.value === "all" || item.type === typeFilter.value;
      const matchesCategory =
        categoryFilter.value === "all" ||
        item.category === categoryFilter.value;
      const matchesFromDate = !fromDate.value || item.date >= fromDate.value;
      const matchesToDate = !toDate.value || item.date <= toDate.value;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesFromDate &&
        matchesToDate
      );
    })
    .sort((a, b) => b.date.localeCompare(a.date));
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTransactions.value.length / pageSize.value)),
);

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;

  return filteredTransactions.value.slice(start, start + pageSize.value);
});

const pageStart = computed(() =>
  filteredTransactions.value.length === 0
    ? 0
    : (currentPage.value - 1) * pageSize.value + 1,
);

const pageEnd = computed(() =>
  Math.min(
    currentPage.value * pageSize.value,
    filteredTransactions.value.length,
  ),
);

const totalIncome = computed(() =>
  filteredTransactions.value
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0),
);

const totalExpenses = computed(() =>
  filteredTransactions.value
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0),
);

const balance = computed(() => totalIncome.value - totalExpenses.value);

const selectedCount = computed(() => selectedIds.value.length);

const allPageSelected = computed(
  () =>
    paginatedTransactions.value.length > 0 &&
    paginatedTransactions.value.every((item) =>
      selectedIds.value.includes(item.id),
    ),
);

const somePageSelected = computed(
  () =>
    !allPageSelected.value &&
    paginatedTransactions.value.some((item) =>
      selectedIds.value.includes(item.id),
    ),
);

watch(
  [searchText, typeFilter, categoryFilter, fromDate, toDate, pageSize],
  () => {
    currentPage.value = 1;
    selectedIds.value = [];
  },
);

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages;
  }
});

function openAddForm() {
  editingTransaction.value = null;
  showForm.value = true;
}

function openEditForm(item: Transaction) {
  editingTransaction.value = { ...item };
  showForm.value = true;
}

function saveTransaction(form: Parameters<typeof store.addTransaction>[0]) {
  if (editingTransaction.value) {
    store.updateTransaction(editingTransaction.value.id, form);
  } else {
    store.addTransaction(form);
  }

  showForm.value = false;
  editingTransaction.value = null;
}

function toggleSelection(id: string) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(
      (selectedId) => selectedId !== id,
    );
  } else {
    selectedIds.value = [...selectedIds.value, id];
  }
}

function toggleSelectAll() {
  const pageIds = paginatedTransactions.value.map((item) => item.id);

  if (allPageSelected.value) {
    selectedIds.value = selectedIds.value.filter((id) => !pageIds.includes(id));
  } else {
    selectedIds.value = [...new Set([...selectedIds.value, ...pageIds])];
  }
}

function clearSelection() {
  selectedIds.value = [];
}

function deleteSelected() {
  if (selectedIds.value.length === 0) return;

  const confirmed = window.confirm(
    `Delete ${selectedIds.value.length} selected transaction(s)? This action cannot be undone.`,
  );

  if (!confirmed) return;

  [...selectedIds.value].forEach((id) => store.deleteTransaction(id));

  selectedIds.value = [];
}

function confirmDelete() {
  if (!deleteTarget.value) return;

  store.deleteTransaction(deleteTarget.value.id);
  selectedIds.value = selectedIds.value.filter(
    (id) => id !== deleteTarget.value?.id,
  );
  deleteTarget.value = null;
}

function clearFilters() {
  searchText.value = "";
  typeFilter.value = "all";
  categoryFilter.value = "all";
  fromDate.value = "";
  toDate.value = "";
  selectedIds.value = [];
}

function previousPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
</script>

<template>
  <div class="app-layout">
    <AppSidebar />

    <main class="main-content">
      <AppNavbar title="Transaction" />

      <div class="dashboard-content transactions-page">
        <!-- 1. Page header -->
        <header class="transactions-header">
          <div>
            <h1>Transactions</h1>
            <p>
              {{ filteredTransactions.length }} of
              {{ store.transactions.length }} entries
            </p>
          </div>

          <button class="primary-btn" @click="openAddForm">
            <span>＋</span> Add transaction
          </button>
        </header>

        <!-- 2. Search and filters -->
        <section class="filter-panel">
          <div class="filter-grid">
            <label class="filter-field search-field">
              <span>Search</span>
              <div class="search-input-wrap">
                <span class="search-icon">⌕</span>
                <input
                  v-model="searchText"
                  type="search"
                  placeholder="Search notes, categories, amounts or dates"
                />
              </div>
            </label>

            <label class="filter-field">
              <span>Type</span>
              <select v-model="typeFilter">
                <option value="all">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>

            <label class="filter-field">
              <span>Category</span>
              <select v-model="categoryFilter">
                <option value="all">All categories</option>
                <option
                  v-for="category in availableCategories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
            </label>

            <div class="aaa">
              <label class="filter-field">
                <span>From</span>
                <input
                  v-model="fromDate"
                  type="date"
                  :max="toDate || undefined"
                />
              </label>

              <label class="filter-field">
                <span>To</span>
                <input
                  v-model="toDate"
                  type="date"
                  :min="fromDate || undefined"
                />
              </label>
            </div>
          </div>

          <div class="filter-summary">
            <span
              >Income
              <strong class="income">{{
                formatCurrency(totalIncome)
              }}</strong></span
            >
            <span
              >Expenses
              <strong class="expense">{{
                formatCurrency(totalExpenses)
              }}</strong></span
            >
            <span
              >Balance <strong>{{ formatCurrency(balance) }}</strong></span
            >

            <button
              v-if="
                searchText ||
                typeFilter !== 'all' ||
                categoryFilter !== 'all' ||
                fromDate ||
                toDate
              "
              class="clear-filters-btn"
              @click="clearFilters"
            >
              <i class="fa-solid fa-broom"></i>
              Clear filters
            </button>
          </div>
        </section>

        <!-- 3. Bulk selection -->
        <section class="bulk-toolbar">
          <label class="select-all-label">
            <input
              type="checkbox"
              :checked="allPageSelected"
              :indeterminate="somePageSelected"
              :disabled="paginatedTransactions.length === 0"
              @change="toggleSelectAll"
            />
            <span>Select page ({{ paginatedTransactions.length }})</span>
          </label>

          <div v-if="selectedCount > 0" class="bulk-actions">
            <span>{{ selectedCount }} selected</span>
            <button class="secondary-btn" @click="clearSelection">Clear</button>
            <button class="danger-btn" @click="deleteSelected">
              <span>▤</span> Delete selected
            </button>
          </div>
        </section>

        <!-- 4. Transactions table -->
        <section class="transactions-table-panel">
          <div class="table-wrapper">
            <table class="transactions-table screenshot-table">
              <thead>
                <tr>
                  <th class="checkbox-column"></th>
                  <th>Transaction</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Note</th>
                  <th class="amount-column">Amount</th>
                  <th class="actions-column">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in paginatedTransactions"
                  :key="item.id"
                  :class="{ 'selected-row': selectedIds.includes(item.id) }"
                >
                  <td class="checkbox-column">
                    <input
                      type="checkbox"
                      :checked="selectedIds.includes(item.id)"
                      :aria-label="`Select ${item.title}`"
                      @change="toggleSelection(item.id)"
                    />
                  </td>

                  <td>
                    <span class="transaction-type-text" :class="item.type">
                      {{ item.type === "income" ? "Income" : "Expense" }}
                    </span>
                    <p class="table-transaction-title">{{ item.title }}</p>
                  </td>

                  <td>{{ item.category }}</td>
                  <td>{{ item.date }}</td>
                  <td>{{ item.note || "-" }}</td>

                  <td class="amount-column" :class="item.type">
                    {{ formatAmount(item) }}
                  </td>

                  <td class="actions-column">
                    <div class="table-actions">
                      <button
                        class="icon-action edit-icon"
                        title="Edit transaction"
                        aria-label="Edit transaction"
                        @click="openEditForm(item)"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>

                      <button
                        class="icon-action delete-icon"
                        title="Delete transaction"
                        aria-label="Delete transaction"
                        @click="deleteTarget = item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 32 32"
                        >
                          <path d="M12 12h2v12h-2z" fill="currentColor"></path>
                          <path d="M18 12h2v12h-2z" fill="currentColor"></path>
                          <path
                            d="M4 6v2h2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h2V6zm4 22V8h16v20z"
                            fill="currentColor"
                          ></path>
                          <path d="M12 2h8v2h-8z" fill="currentColor"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="paginatedTransactions.length === 0">
                  <td colspan="7" class="empty-state">
                    No transactions found. Try changing your filters.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 5. Pagination -->
        <footer class="pagination-panel">
          <p>
            Showing {{ pageStart }} – {{ pageEnd }} of
            {{ filteredTransactions.length }}
          </p>

          <div class="pagination-controls">
            <select v-model.number="pageSize" aria-label="Rows per page">
              <option :value="5">5 per page</option>
              <option :value="10">10 per page</option>
              <option :value="20">20 per page</option>
            </select>

            <button
              class="pagination-btn"
              :disabled="currentPage <= 1"
              @click="previousPage"
            >
              Prev
            </button>

            <span class="page-number"
              >{{ currentPage }} / {{ totalPages }}</span
            >

            <button
              class="pagination-btn"
              :disabled="currentPage >= totalPages"
              @click="nextPage"
            >
              Next
            </button>
          </div>
        </footer>
      </div>
    </main>

    <!-- Add/Edit modal -->
    <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
      <TransactionForm
        :initial-data="editingTransaction"
        @save="saveTransaction"
        @cancel="showForm = false"
      />
    </div>

    <!-- Single-delete confirmation modal -->
    <div
      v-if="deleteTarget"
      class="modal-backdrop"
      @click.self="deleteTarget = null"
    >
      <section class="confirm-dialog">
        <header class="confirm-dialog-header">
          <h2>Delete transaction</h2>
          <button
            class="modal-close"
            aria-label="Close"
            @click="deleteTarget = null"
          >
            ×
          </button>
        </header>

        <p>
          Delete
          <strong>{{ deleteTarget.title }}</strong
          >? This action cannot be undone.
        </p>

        <footer class="confirm-dialog-actions">
          <button class="secondary-btn" @click="deleteTarget = null">
            Cancel
          </button>
          <button class="danger-btn" @click="confirmDelete">Delete</button>
        </footer>
      </section>
    </div>
  </div>
</template>
```
