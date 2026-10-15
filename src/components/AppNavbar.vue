<script setup lang="ts">
import { ref } from "vue";
defineProps<{
  title: string;
}>();
</script>

<template>
  <header class="navbar">
    <div class="page-heading">
      <h1>{{ title }}</h1>
    </div>

    <div class="navbar-actions">
      <div class="navbar-avatar">TW</div>
    </div>
  </header>
</template>
