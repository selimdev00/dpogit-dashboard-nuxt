import { defineStore } from "pinia";
import type { User, LoginCredentials, AuthState } from "@/shared/types/auth";

const TEST_USERS: User[] = [
  {
    id: "1",
    email: "admin@dpogti.ru",
    name: "Администратор Системы",
    department: "IT Department",
    departmentIds: true,
    canPlan: true,
  },
  {
    id: "2",
    email: "manager@dpogti.ru",
    name: "Менеджер Отдела",
    department: "Sales Department",
    departmentIds: [1, 2, 3],
    canPlan: false,
  },
];

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),

  getters: {
    canAccessDepartment: (state) => (departmentId: number) => {
      if (!state.user) return false;

      const { departmentIds } = state.user;

      // If departmentIds is true, user has access to all departments
      if (departmentIds === true) return true;

      // If departmentIds is false or empty array, user has no access
      if (
        departmentIds === false ||
        (Array.isArray(departmentIds) && departmentIds.length === 0)
      ) {
        return false;
      }

      // If departmentIds is an array, check if it includes the departmentId
      if (Array.isArray(departmentIds)) {
        return departmentIds.includes(departmentId);
      }

      return false;
    },

    canPlan: (state) => state.user?.canPlan || false,

    userDepartments: (state) => {
      if (!state.user) return [];

      const { departmentIds } = state.user;

      // If departmentIds is true, return empty array (means all departments, but we can't list them here)
      if (departmentIds === true) return [];

      // If departmentIds is false, return empty array (no access)
      if (departmentIds === false) return [];

      // If departmentIds is an array, return it
      if (Array.isArray(departmentIds)) return departmentIds;

      return [];
    },
  },

  actions: {
    async login(credentials: LoginCredentials): Promise<boolean> {
      this.isLoading = true;

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const user = TEST_USERS.find((u) => u.email === credentials.email);

        if (user && credentials.password === "password") {
          this.user = user;
          this.isAuthenticated = true;

          // Store in localStorage for persistence
          localStorage.setItem("auth-user", JSON.stringify(user));
          localStorage.setItem("auth-token", "fake-jwt-token");

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

      localStorage.removeItem("auth-user");
      localStorage.removeItem("auth-token");

      navigateTo("/login");
    },

    async checkAuth() {
      const token = localStorage.getItem("auth-token");
      const userStr = localStorage.getItem("auth-user");

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
