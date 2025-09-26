import { useAuthStore } from '@/shared/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const authStore = useAuthStore();

  // Initialize auth if not already done
  if (!authStore.isAuthenticated) {
    await authStore.initAuth();
  }

  // If user is authenticated, redirect to dashboard
  if (authStore.isAuthenticated) {
    return navigateTo('/');
  }
});