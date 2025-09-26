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
      name: "plans",
      path: "/plans",
      component: () =>
        import("@/pages/plans").then((r) => r.PlansPage),
    },
    {
      name: "department",
      path: "/department/:id",
      component: () => import("@/pages/department/[id].vue"),
    },
  ],
} satisfies RouterConfig;