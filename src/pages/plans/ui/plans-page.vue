<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto py-8">
      <div
        class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <h1 class="text-2xl font-bold text-foreground">Отделы</h1>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button> Выставить план </Button>

          <Select v-model="selectedDepartmentId" @change="onDepartmentChange">
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="department in data"
                :key="department.id"
                :value="department.id"
              >
                {{ department.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div
          class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-r-transparent"
        ></div>
        <span class="ml-3 text-muted-foreground">Загрузка...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center"
      >
        <h3 class="mb-2 font-medium text-destructive">Ошибка загрузки</h3>
        <p class="text-sm text-destructive/80">{{ error.message }}</p>
      </div>

      <!-- Department Content -->
      <div
        v-else-if="selectedDepartment"
        class="rounded-lg border bg-card text-card-foreground shadow-sm"
      >
        <!-- Table Header -->
        <div
          class="grid grid-cols-7 gap-4 border-b p-4 text-sm font-medium text-muted-foreground"
        >
          <div class="col-span-2">Сотрудник</div>
          <div class="text-center">Лиды, шт</div>
          <div class="text-center">Продажи, шт</div>
          <div class="text-center">Сумма договоров, руб</div>
          <div class="text-center">Маржа, руб</div>
          <div class="text-center">КЗВ, шт</div>
        </div>

        <!-- Employee Rows -->
        <div class="divide-y">
          <div
            v-for="employee in selectedDepartment.employees"
            :key="employee.id"
            class="grid grid-cols-7 gap-4 p-4 transition-colors hover:bg-muted/10"
          >
            <!-- Employee Info -->
            <div class="col-span-2 flex items-center gap-3">
              <div class="relative h-10 w-10 flex-shrink-0">
                <img
                  v-if="employee.photo"
                  :src="employee.photo"
                  :alt="employee.name"
                  class="h-full w-full rounded-full object-cover"
                />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
                >
                  {{ getInitials(employee.name) }}
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-foreground">
                  {{ employee.name }}
                </p>
                <p
                  v-if="employee.position"
                  class="truncate text-xs text-muted-foreground"
                >
                  {{ employee.position }}
                </p>
              </div>
            </div>

            <!-- Metrics -->
            <div
              class="flex items-center justify-center text-sm text-muted-foreground"
            >
              0
            </div>
            <div
              class="flex items-center justify-center text-sm text-muted-foreground"
            >
              0
            </div>
            <div
              class="flex items-center justify-center text-sm text-muted-foreground"
            >
              0
            </div>
            <div
              class="flex items-center justify-center text-sm text-muted-foreground"
            >
              0
            </div>
            <div
              class="flex items-center justify-center text-sm text-muted-foreground"
            >
              0
            </div>
          </div>
        </div>
      </div>

      <!-- No Selection State -->
      <div v-else class="flex items-center justify-center py-12">
        <div class="text-center">
          <h3 class="mb-2 text-lg font-medium text-foreground">
            Выберите отдел
          </h3>
          <p class="text-muted-foreground">
            Выберите отдел из списка для просмотра сотрудников
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDepartmentsQuery } from "@/shared/api";
import type { Department } from "@/shared/api/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/ui/select";
import { Button } from "~/shared/ui/button";

definePageMeta({
  layout: "default",
});

const selectedDepartmentId = ref<number | "">("");

const { data, isLoading, error } = useDepartmentsQuery();

const selectedDepartment = computed<Department | null>(() => {
  if (!data.value || !selectedDepartmentId.value) return null;
  return (
    data.value.find((dept) => dept.id === selectedDepartmentId.value) || null
  );
});

const getInitials = (name: string): string => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

const onDepartmentChange = () => {
  // Additional logic if needed when department changes
};

// Set first department as default when data loads
watch(
  data,
  (newData) => {
    if (newData && newData.length > 0 && !selectedDepartmentId.value) {
      selectedDepartmentId.value = newData[0].id;
    }
  },
  { immediate: true },
);
</script>
