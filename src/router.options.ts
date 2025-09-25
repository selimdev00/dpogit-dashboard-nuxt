import type { RouterConfig } from "@nuxt/schema";

export default {
  // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
  routes: (_routes) => [
    {
      name: "home",
      path: "/",
      component: () => import("@/pages/home").then((r) => r.HomePage),
    },
    {
      name: "departments",
      path: "/departments",
      component: () =>
        import("@/pages/departments").then((r) => r.DepartmentsPage),
    },
  ],
} satisfies RouterConfig;
