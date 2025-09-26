import { useAuthStore } from '@/shared/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return;

  const authStore = useAuthStore();

  // Extract department ID from route params
  const departmentId = parseInt(to.params.id as string);

  // Check if department ID is valid
  if (isNaN(departmentId)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Отдел не найден',
    });
  }

  // Check if user has access to this department
  if (!authStore.canAccessDepartment(departmentId)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Доступ запрещен: у вас нет прав для просмотра этого отдела',
    });
  }
});