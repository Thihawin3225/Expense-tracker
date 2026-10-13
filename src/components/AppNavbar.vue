<script setup lang="ts">
import { ref } from "vue";

const searchText = ref("");
</script>

<template>
  <header class="navbar">
    <div class="page-heading">
      <h1>Dashboard</h1>
      <p>Welcome back! Here's your financial overview.</p>
    </div>

    <div class="navbar-actions">
      <label class="search-box">
        <span>⌕</span>
        <input
          v-model="searchText"
          type="search"
          placeholder="Search..."
          aria-label="Search"
        />
      </label>

      <button class="notification-btn" aria-label="Notifications">♧</button>

      <div class="navbar-avatar">TW</div>
    </div>
  </header>
</template>
