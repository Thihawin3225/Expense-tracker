```vue
<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

interface MenuItem {
  name: string;
  icon: string;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    icon: "fa-solid fa-wallet",
    path: "/dashboard",
  },
  {
    name: "Transactions",
    icon: "fa-solid fa-money-bill-transfer",
    path: "/transactions",
  },
  // {
  //   name: "Reports",
  //   icon: "fa-solid fa-chart-pie",
  //   path: "/reports",
  // },
  // {
  //   name: "Settings",
  //   icon: "fa-solid fa-gear",
  //   path: "/settings",
  // },
];
</script>

<template>
  <aside class="sidebar">
    <!-- Brand -->
    <div class="brand">
      <span class="brand-icon">E</span>

      <span> Expense<span class="brand-light">Flow</span> </span>
    </div>

    <!-- Menu Label -->
    <p class="menu-label">MENU</p>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="menu-item"
        :class="{ active: route.path === item.path }"
      >
        <span class="menu-icon">
          <i :class="item.icon"></i>
        </span>

        <span class="menu-name">{{ item.name }}</span>
      </RouterLink>
    </nav>

    <!-- User Profile -->
    <div class="sidebar-bottom">
      <div class="user-avatar">TW</div>

      <div class="user-info">
        <strong>Thiha Win</strong>
        <span>Personal Account</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  box-sizing: border-box;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
  padding: 0 8px;
  font-size: 21px;
  font-weight: 700;
  color: #111827;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: #4f46e5;
  color: #ffffff;
  font-size: 20px;
}

.brand-light {
  color: #6366f1;
}

/* Menu Label */
.menu-label {
  margin: 0 0 12px 10px;
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 1.2px;
}

/* Navigation */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.menu-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  flex-shrink: 0;
}

.menu-icon i {
  font-size: 17px;
}

.menu-item:hover {
  background-color: #f3f4f6;
  color: #4f46e5;
}

/* Active Route */
.menu-item.active {
  background-color: #eef2ff;
  color: #4f46e5;
  font-weight: 600;
}

/* User Profile */
.sidebar-bottom {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding: 20px 8px 0;
  border-top: 1px solid #e5e7eb;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #e0e7ff;
  color: #4338ca;
  font-size: 13px;
  font-weight: 700;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.user-info strong {
  font-size: 13px;
  color: #111827;
}

.user-info span {
  font-size: 11px;
  color: #9ca3af;
}

/* Small Screens */
@media (max-width: 768px) {
  .sidebar {
    width: 210px;
    padding: 20px 12px;
  }

  .brand {
    font-size: 18px;
  }
}
</style>
```
