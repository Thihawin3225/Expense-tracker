<script setup lang="ts">
import { reactive, watch } from "vue";
import type {
  Transaction,
  TransactionForm as FormData,
  TransactionType,
  TransactionCategory,
} from "../types/transaction";

const props = defineProps<{
  initialData?: Transaction | null;
}>();

const emit = defineEmits<{
  save: [form: FormData];
  cancel: [];
}>();

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

function today(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function emptyForm(): FormData {
  return {
    title: "",
    amount: null,
    type: "expense",
    category: "Food",
    date: today(),
    note: "",
  };
}

const form = reactive<FormData>(emptyForm());
const errorMessage = reactive({ text: "" });

watch(
  () => props.initialData,
  (item) => {
    Object.assign(
      form,
      item
        ? {
            title: item.title,
            amount: item.amount,
            type: item.type,
            category: item.category,
            date: item.date,
            note: item.note ?? "",
          }
        : emptyForm(),
    );

    errorMessage.text = "";
  },
  { immediate: true },
);

function submitForm() {
  errorMessage.text = "";

  if (!form.title.trim()) {
    errorMessage.text = "Please enter a transaction title.";
    return;
  }

  if (
    form.amount === null ||
    !Number.isFinite(form.amount) ||
    form.amount <= 0
  ) {
    errorMessage.text = "Amount must be greater than zero.";
    return;
  }

  if (!form.date || form.date > today()) {
    errorMessage.text = "Please select a valid date.";
    return;
  }

  emit("save", {
    title: form.title.trim(),
    amount: form.amount,
    type: form.type as TransactionType,
    category: form.category,
    date: form.date,
    note: form.note.trim(),
  });
}
</script>

<template>
  <form class="transaction-form" @submit.prevent="submitForm">
    <div class="form-heading">
      <h2>{{ initialData ? "Edit Transaction" : "Add Transaction" }}</h2>
      <p>Enter your income or expense details.</p>
    </div>

    <div class="form-field">
      <label for="transaction-title">Title</label>
      <input
        id="transaction-title"
        v-model="form.title"
        type="text"
        maxlength="100"
        placeholder="e.g. Grocery shopping"
        required
      />
    </div>

    <div class="form-field">
      <label for="transaction-amount">Amount ($)</label>
      <input
        id="transaction-amount"
        v-model.number="form.amount"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="0.00"
        required
      />
    </div>

    <div class="form-row">
      <div class="form-field">
        <label for="transaction-type">Type</label>
        <select id="transaction-type" v-model="form.type">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div class="form-field">
        <label for="transaction-category">Category</label>
        <select id="transaction-category" v-model="form.category">
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <div class="form-field">
      <label for="transaction-date">Date</label>
      <input
        id="transaction-date"
        v-model="form.date"
        type="date"
        :max="today()"
        required
      />
    </div>

    <div class="form-field">
      <label for="transaction-note">Note (optional)</label>
      <textarea
        id="transaction-note"
        v-model="form.note"
        maxlength="500"
        rows="3"
        placeholder="Add a note..."
      />
    </div>

    <p v-if="errorMessage.text" class="form-error" role="alert">
      {{ errorMessage.text }}
    </p>

    <div class="form-actions">
      <button type="button" class="secondary-btn" @click="emit('cancel')">
        Cancel
      </button>

      <button type="submit" class="primary-btn">
        {{ initialData ? "Save Changes" : "Add Transaction" }}
      </button>
    </div>
  </form>
</template>
