import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
    },
    {
      path: "/transactions",
      name: "transactions",
      component: () => import("../views/TransactionsView.vue"),
    },
    // {
    //   path: "/reports",
    //   name: "reports",
    //   component: () => import("../views/ReportsView.vue"),
    // },
    // {
    //   path: "/settings",
    //   name: "settings",
    //   component: () => import("../views/SettingsView.vue"),
    // },
  ],
});

export default router;
