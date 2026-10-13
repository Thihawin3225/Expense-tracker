<script setup lang="ts">
import { ref } from "vue";

const activeMenu = ref("Dashboard");

const menuItems = [
  { name: "Dashboard", icon: "▦" },
  { name: "Transactions", icon: "↔" },
  { name: "Reports", icon: "▥" },
  { name: "Settings", icon: "⚙" },
];
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <span class="brand-icon">E</span>
      <span>Expense<span class="brand-light">Flow</span></span>
    </div>

    <p class="menu-label">MENU</p>

    <nav class="sidebar-nav">
      <button
        v-for="item in menuItems"
        :key="item.name"
        class="menu-item"
        :class="{ active: activeMenu === item.name }"
        @click="activeMenu = item.name"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span>{{ item.name }}</span>
      </button>
    </nav>

    <div class="sidebar-bottom">
      <div class="user-avatar">TW</div>
      <div class="user-info">
        <strong>Thiha Win</strong>
        <span>Personal Account</span>
      </div>
    </div>
  </aside>
</template>
