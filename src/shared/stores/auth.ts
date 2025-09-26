import { defineStore } from 'pinia';
import type { User, LoginCredentials, AuthState } from '@/shared/types/auth';

const TEST_USERS: User[] = [
  {
    id: '1',
    email: 'admin@dpogti.ru',
    name: 'Администратор Системы',
    department: 'IT Department',
    departmentIds: ['dept-1', 'dept-2', 'dept-3'],
    canPlan: true,
  },
  {
    id: '2',
    email: 'manager@dpogti.ru',
    name: 'Менеджер Отдела',
    department: 'Sales Department',
    departmentIds: ['dept-2'],
    canPlan: false,
  },
];

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),

  getters: {
    canAccessDepartment: (state) => (departmentId: string) => {
      return state.user?.departmentIds.includes(departmentId) || false;
    },

    canPlan: (state) => state.user?.canPlan || false,

    userDepartments: (state) => state.user?.departmentIds || [],
  },

  actions: {
    async login(credentials: LoginCredentials): Promise<boolean> {
      this.isLoading = true;

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const user = TEST_USERS.find(u => u.email === credentials.email);

        if (user && credentials.password === 'password') {
          this.user = user;
          this.isAuthenticated = true;

          // Store in localStorage for persistence
          localStorage.setItem('auth-user', JSON.stringify(user));
          localStorage.setItem('auth-token', 'fake-jwt-token');

          return true;
        }

        return false;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;

      localStorage.removeItem('auth-user');
      localStorage.removeItem('auth-token');

      navigateTo('/login');
    },

    async checkAuth() {
      const token = localStorage.getItem('auth-token');
      const userStr = localStorage.getItem('auth-user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          this.user = user;
          this.isAuthenticated = true;
        } catch {
          this.logout();
        }
      }
    },

    async initAuth() {
      if (process.client) {
        await this.checkAuth();
      }
    },
  },
});