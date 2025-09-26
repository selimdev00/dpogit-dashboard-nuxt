import { useAuthStore } from '@/shared/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return;

  const authStore = useAuthStore();

  // Check if user has planning permissions
  if (!authStore.canPlan) {
    // Redirect to home page with error
    throw createError({
      statusCode: 403,
      statusMessage: 'Доступ запрещен: у вас нет прав для управления планами',
    });
  }
});