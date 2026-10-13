<script setup lang="ts">
interface Props {
  title: string;
  amount: string;
  icon: string;
  color: string;
  change: string;
}

defineProps<Props>();
</script>

<template>
  <article class="summary-card">
    <div class="card-top">
      <span class="card-title">{{ title }}</span>

      <span class="card-icon" :style="{ backgroundColor: color }">
        {{ icon }}
      </span>
    </div>

    <h2 class="card-amount">{{ amount }}</h2>

    <p class="card-change">{{ change }}</p>
  </article>
</template>
