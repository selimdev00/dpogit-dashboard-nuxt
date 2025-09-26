import { useAuthStore } from '@/shared/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const authStore = useAuthStore();

  // Initialize auth on first load
  if (!authStore.isAuthenticated) {
    await authStore.initAuth();
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(to.path);

  // If user is not authenticated and trying to access protected route
  if (!authStore.isAuthenticated && !isPublicRoute) {
    return navigateTo('/login');
  }

  // If user is authenticated and trying to access login page
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/');
  }
});