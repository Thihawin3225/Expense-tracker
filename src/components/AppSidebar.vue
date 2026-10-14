<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const menuItems = [
  { name: "Dashboard", icon: "▦", path: "/dashboard" },
  { name: "Transactions", icon: "↔", path: "/transactions" },
  // { name: "Reports", icon: "▥", path: "/reports" },
  // { name: "Settings", icon: "⚙", path: "/settings" },
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
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="menu-item"
        :class="{ active: route.path === item.path }"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span>{{ item.name }}</span>
      </RouterLink>
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
