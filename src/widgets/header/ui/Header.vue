<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex h-16 items-center justify-between">
      <!-- Logo and DatePicker -->
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <Logo />
        </NuxtLink>

        <!-- DatePicker -->
        <DatePicker
          v-model="dashboardStore.selectedDateRange"
          @update:modelValue="handleDateChange"
        />
      </div>

      <!-- Navigation and User Menu -->
      <div class="flex items-center space-x-4">
        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="transition-colors hover:text-foreground/80 text-foreground/60"
            active-class="text-foreground"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- User Menu -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-muted-foreground">{{ authStore.user?.name }}</span>
          <button
            @click="handleLogout"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { Logo } from "@/shared/ui/logo";
import { DatePicker } from "@/shared/ui/datepicker";
import { useDashboardStore, type DateRange } from "@/shared/stores/dashboard";
import { useAuthStore } from "@/shared/stores/auth";

interface NavItem {
  path: string;
  label: string;
}

const dashboardStore = useDashboardStore();
const authStore = useAuthStore();

const handleDateChange = (value: DateRange) => {
  dashboardStore.setDateRange(value);
  console.log("Date range changed:", value);
};

const handleLogout = () => {
  authStore.logout();
};

const navItems: NavItem[] = [
  {
    path: "/",
    label: "Главная",
  },
  {
    path: "/plans",
    label: "Планы",
  },
];
</script>
