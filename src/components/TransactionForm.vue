<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type {
  Transaction,
  TransactionType,
  TransactionCategory,
} from "../types/transaction";

interface Props {
  initialData: Transaction | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  save: [data: Omit<Transaction, "id">];
  cancel: [];
}>();

const expenseCategories: TransactionCategory[] = [
  "Food",
  "Transport",
  "Health",
  "Shopping",
  "Travel",
  "Fitness",
  "Bills & Fees",
  "Other Expense",
];

const incomeCategories: TransactionCategory[] = [
  "Salary",
  "Gift",
  "Freelance",
  "Investment",
];

const type = ref<TransactionType>("expense");
const title = ref("");
const amount = ref<number | null>(null);
const category = ref<TransactionCategory>("Food");
const date = ref(new Date().toLocaleDateString("en-CA"));
const note = ref("");

const availableCategories = computed(() =>
  type.value === "expense" ? expenseCategories : incomeCategories,
);

// Change category automatically when transaction type changes
watch(type, (newType) => {
  if (newType === "expense") {
    category.value = "Food";
  } else {
    category.value = "Salary";
  }
});

// Fill the form when editing an existing transaction
watch(
  () => props.initialData,
  (data) => {
    if (data) {
      type.value = data.type;
      title.value = data.title;
      amount.value = data.amount;
      category.value = data.category;
      date.value = data.date;
      note.value = data.note ?? "";
    } else {
      type.value = "expense";
      title.value = "";
      amount.value = null;
      category.value = "Food";
      date.value = new Date().toLocaleDateString("en-CA");
      note.value = "";
    }
  },
  { immediate: true },
);

function handleSubmit() {
  if (!title.value.trim()) {
    alert("Please enter a transaction title.");
    return;
  }

  if (
    amount.value === null ||
    !Number.isFinite(amount.value) ||
    amount.value <= 0
  ) {
    alert("Please enter an amount greater than zero.");
    return;
  }

  emit("save", {
    title: title.value.trim(),
    amount: amount.value,
    type: type.value,
    category: category.value,
    date: date.value,
    note: note.value.trim(),
  });
}
</script>

<template>
  <section class="transaction-form">
    <header class="form-header">
      <div>
        <h2>
          {{ initialData ? "Edit Transaction" : "Add Transaction" }}
        </h2>
        <p>Enter your income or expense details.</p>
      </div>

      <button
        type="button"
        class="close-button"
        aria-label="Close form"
        @click="emit('cancel')"
      >
        ×
      </button>
    </header>

    <form @submit.prevent="handleSubmit">
      <!-- Title -->
      <label class="form-field">
        <span>Title</span>
        <input
          v-model="title"
          type="text"
          placeholder="e.g. Grocery shopping"
          required
        />
      </label>

      <!-- Amount -->
      <label class="form-field">
        <span>Amount (MMK)</span>
        <input
          v-model.number="amount"
          type="number"
          min="0.01"
          step="any"
          placeholder="0.00"
          required
        />
      </label>

      <!-- Type and Category -->
      <div class="form-row">
        <label class="form-field">
          <span>Type</span>
          <select v-model="type">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label class="form-field">
          <span>Category</span>
          <select v-model="category">
            <option
              v-for="item in availableCategories"
              :key="item"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
        </label>
      </div>

      <!-- Date -->
      <label class="form-field">
        <span>Date</span>
        <input v-model="date" type="date" required />
      </label>

      <!-- Optional Note -->
      <label class="form-field">
        <span>Note (optional)</span>
        <textarea
          v-model="note"
          rows="3"
          placeholder="Add a note..."
        ></textarea>
      </label>

      <!-- Buttons -->
      <footer class="form-actions">
        <button type="button" class="cancel-button" @click="emit('cancel')">
          Cancel
        </button>

        <button type="submit" class="submit-button">
          {{ initialData ? "Save Changes" : "Add Transaction" }}
        </button>
      </footer>
    </form>
  </section>
</template>

<style scoped>
.transaction-form {
  width: min(100%, 600px);
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 14px;
  color: #172033;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 28px;
}

.form-header h2 {
  margin: 0 0 8px;
  font-size: 24px;
}

.form-header p {
  margin: 0;
  color: #718096;
  font-size: 15px;
}

.close-button {
  border: none;
  background: transparent;
  font-size: 28px;
  color: #718096;
  cursor: pointer;
}

form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.form-field > span {
  font-size: 14px;
  font-weight: 600;
}

.form-field input,
.form-field select,
.form-field textarea {
  width: 100%;
  min-height: 48px;
  box-sizing: border-box;
  padding: 12px 15px;
  border: 1px solid #d8deea;
  border-radius: 10px;
  background: #ffffff;
  color: #172033;
  font: inherit;
  outline: none;
}

.form-field textarea {
  resize: vertical;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgb(79 70 229 / 10%);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.cancel-button,
.submit-button {
  min-height: 48px;
  padding: 0 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.cancel-button {
  background: #e9edf5;
  color: #334155;
}

.submit-button {
  background: #4f46e5;
  color: #ffffff;
}

.submit-button:hover {
  background: #4338ca;
}

@media (max-width: 480px) {
  .transaction-form {
    padding: 18px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .form-actions button {
    flex: 1;
    padding: 0 10px;
  }
}
</style>
