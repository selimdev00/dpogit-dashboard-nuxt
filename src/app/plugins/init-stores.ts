import { useDashboardStore } from "@/shared/stores/dashboard";
import { useAuthStore } from "@/shared/stores/auth";

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Initialize stores on client side
    const dashboardStore = useDashboardStore();
    const authStore = useAuthStore();

    // Initialize dashboard store from localStorage
    dashboardStore.initFromStorage();

    // Initialize auth store
    authStore.initAuth();
  }
});