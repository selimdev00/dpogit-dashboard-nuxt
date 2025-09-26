import type { RouterConfig } from "@nuxt/schema";

export default {
  // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
  routes: (_routes) => [
    {
      name: "login",
      path: "/login",
      component: () => import("@/pages/login").then((r) => r.LoginPage),
      meta: {
        layout: "guest",
      },
    },
    {
      name: "home",
      path: "/",
      component: () => import("@/pages/home").then((r) => r.HomePage),
      meta: {
        layout: "default",
      },
    },
    {
      name: "plans",
      path: "/plans",
      component: () => import("@/pages/plans").then((r) => r.PlansPage),
      meta: {
        layout: "default",
      },
    },
    {
      name: "department",
      path: "/department/:id",
      component: () => import("@/pages/department/[id].vue"),
      meta: {
        layout: "default",
      },
    },
  ],
} satisfies RouterConfig;
