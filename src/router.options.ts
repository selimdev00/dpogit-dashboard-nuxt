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
      name: "onboarding",
      path: "/onboarding",
      component: () =>
        import("@/pages/onboarding").then((r) => r.OnboardingPage),
    },
  ],
} satisfies RouterConfig;
