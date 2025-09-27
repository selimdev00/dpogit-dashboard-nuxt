<template>
  <div class="bg-background flex flex-col">
    <!-- Sticky Header -->
    <div
      class="sticky top-16 z-10 bg-background border-b backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div class="container mx-auto py-4">
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 class="text-2xl font-bold text-foreground">Планы</h1>
            <p class="text-sm text-muted-foreground">
              Текущий месяц: {{ currentMonth }}
              <span v-if="plansLoading" class="ml-2 text-blue-500"
                >(загрузка...)</span
              >
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <!-- Save Success Message -->
            <div
              v-if="
                savePlansMutation.isSuccess.value &&
                !savePlansMutation.isPending.value
              "
              class="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded text-sm"
            >
              <span class="text-green-800 font-medium">✓ Планы успешно сохранены</span>
            </div>

            <Button
              @click="savePlans"
              :disabled="
                !hasChanges ||
                savePlansMutation.isPending.value ||
                !authStore.canPlan
              "
            >
              {{
                savePlansMutation.isPending.value
                  ? "Сохранение..."
                  : "Сохранить"
              }}
            </Button>

            <Select v-model="selectedDepartmentId" @change="onDepartmentChange">
              <SelectTrigger>
                <SelectValue placeholder="Выберите отдел" />
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
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 h-screen">
      <div class="h-full">
        <div class="container mx-auto p-4">
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


          <!-- Save Error Message -->
          <div
            v-if="savePlansMutation.isError.value"
            class="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <h3 class="text-destructive font-medium mb-2">Ошибка сохранения</h3>
            <p class="text-sm text-destructive/80">
              {{
                savePlansMutation.error.value?.message || "Неизвестная ошибка"
              }}
            </p>
          </div>

          <!-- Plans Error Message -->
          <div
            v-if="plansError && !plansLoading"
            class="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <h3 class="text-destructive font-medium mb-2">
              Ошибка загрузки планов
            </h3>
            <p class="text-sm text-destructive/80">
              {{ plansError.message || "Не удалось загрузить данные планов" }}
            </p>
          </div>

          <!-- No Permission Warning -->
          <div
            v-if="!authStore.canPlan"
            class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <h3 class="text-yellow-800 font-medium mb-2">
              Ограниченный доступ
            </h3>
            <p class="text-sm text-yellow-700">
              У вас нет прав для редактирования планов. Вы можете только
              просматривать данные.
            </p>
          </div>

          <!-- Department Content -->
          <div
            v-else-if="selectedDepartment"
            class="h-full rounded-lg border bg-card text-card-foreground shadow-sm relative flex flex-col"
          >
            <!-- Plans Loading Overlay -->
            <div
              v-if="plansLoading"
              class="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-r-transparent"
                ></div>
                <span class="text-muted-foreground"
                  >Загрузка данных плана...</span
                >
              </div>
            </div>
            <!-- Table Header -->
            <div
              class="grid grid-cols-4 gap-4 border-b p-4 text-sm font-medium text-muted-foreground flex-shrink-0 sticky top-36 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10"
            >
              <div class="col-span-2">Сотрудник</div>
              <div class="text-center">Исходящие звонки</div>
              <div class="text-center">Сумма оплаченных счетов</div>
            </div>

            <!-- Scrollable Employee Rows -->
            <div class="flex-1 overflow-y-auto">
              <div class="divide-y">
                <div
                  v-for="employee in selectedDepartment.employees"
                  :key="employee.id"
                  class="grid grid-cols-4 gap-4 p-4 transition-colors hover:bg-muted/10"
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
                  <div class="flex items-center justify-center">
                    <input
                      :value="getEmployeePlan(employee.id, 'calls')"
                      type="number"
                      min="0"
                      :disabled="!authStore.canPlan"
                      class="w-20 rounded-md border bg-background px-2 py-1 text-center text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                      @input="updateEmployeePlan(employee.id, 'calls', $event)"
                    />
                  </div>
                  <div class="flex items-center justify-center">
                    <input
                      :value="getEmployeePlan(employee.id, 'invoices')"
                      type="number"
                      min="0"
                      :disabled="!authStore.canPlan"
                      class="w-20 rounded-md border bg-background px-2 py-1 text-center text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                      @input="
                        updateEmployeePlan(employee.id, 'invoices', $event)
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Sticky Totals Row -->
            <div
              class="flex-shrink-0 border-t-2 bg-background shadow-lg sticky bottom-0 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
              <div class="grid grid-cols-4 gap-4 p-4">
                <!-- Total Label -->
                <div class="col-span-2 flex items-center">
                  <div class="font-medium text-foreground">
                    Итого по отделу:
                  </div>
                </div>

                <!-- Total Calls Input -->
                <div class="flex items-center justify-center">
                  <input
                    :value="totalCalls"
                    type="number"
                    min="0"
                    :disabled="!authStore.canPlan"
                    class="w-20 rounded-md border bg-background px-2 py-1 text-center text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    @input="updateTotalCalls"
                  />
                </div>

                <!-- Total Invoices Input -->
                <div class="flex items-center justify-center">
                  <input
                    :value="totalInvoices"
                    type="number"
                    min="0"
                    :disabled="!authStore.canPlan"
                    class="w-20 rounded-md border bg-background px-2 py-1 text-center text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    @input="updateTotalInvoices"
                  />
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
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useDepartmentsQuery,
  usePlansQuery,
  useSavePlansMutation,
} from "@/shared/api";
import type { Department, PlanData } from "@/shared/api/types";
import { useDashboardStore } from "@/shared/stores/dashboard";
import { useAuthStore } from "@/shared/stores/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";

definePageMeta({
  layout: "default",
  middleware: "can-plan",
});

const selectedDepartmentId = ref<number | "">("");

// Get dashboard store for date management
const dashboardStore = useDashboardStore();
const authStore = useAuthStore();

// Create a reactive reference to the current month
const currentMonth = computed(() => dashboardStore.getCurrentMonth);

const { data: allDepartments, isLoading, error } = useDepartmentsQuery();
const {
  data: plansData,
  isLoading: plansLoading,
  error: plansError,
} = usePlansQuery(currentMonth);
const savePlansMutation = useSavePlansMutation();

// Filter departments based on user's departmentIds access
const data = computed(() => {
  if (!allDepartments.value) return null;

  return allDepartments.value.filter((department) =>
    authStore.canAccessDepartment(department.id),
  );
});

// Store for tracking changes - structure: { employeeId: { metric: value } }
const changedPlans = ref<Record<number, Record<string, number>>>({});

// Store for employee plans - structure: { employeeId: { metric: value } }
const employeePlans = ref<Record<number, Record<string, number>>>({});

// Store for department totals
const departmentTotals = ref<{ calls: number; invoices: number }>({
  calls: 0,
  invoices: 0,
});

// Store for tracking department total changes
const changedDepartmentTotals = ref<{ calls?: number; invoices?: number }>({});

const selectedDepartment = computed<Department | null>(() => {
  if (!data.value || !selectedDepartmentId.value) return null;
  return (
    data.value.find((dept) => dept.id === selectedDepartmentId.value) || null
  );
});

const getInitials = (name: string): string => {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
  }
  return parts[0]?.[0]?.toUpperCase() || "";
};

// Get employee plan value from local store (synced from API)
const getEmployeePlan = (employeeId: number, metric: string): number => {
  return employeePlans.value[employeeId]?.[metric] || 0;
};

// Update employee plan value
const updateEmployeePlan = (
  employeeId: number,
  metric: string,
  event: Event,
) => {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value) || 0;

  // Update local store for display
  if (!employeePlans.value[employeeId]) {
    employeePlans.value[employeeId] = {};
  }
  employeePlans.value[employeeId][metric] = value;

  // Track changes for saving
  if (!changedPlans.value[employeeId]) {
    changedPlans.value[employeeId] = {};
  }
  changedPlans.value[employeeId][metric] = value;
};

// Computed totals - use department totals if available, otherwise sum employee plans
const totalCalls = computed(() => {
  // If department totals are set (from API or manual input), use them
  if (departmentTotals.value.calls > 0) {
    return departmentTotals.value.calls;
  }

  // Otherwise, calculate from employee plans
  if (!selectedDepartment.value) return 0;
  let total = 0;
  selectedDepartment.value.employees.forEach((employee) => {
    total += getEmployeePlan(employee.id, "calls");
  });
  return total;
});

const totalInvoices = computed(() => {
  // If department totals are set (from API or manual input), use them
  if (departmentTotals.value.invoices > 0) {
    return departmentTotals.value.invoices;
  }

  // Otherwise, calculate from employee plans
  if (!selectedDepartment.value) return 0;
  let total = 0;
  selectedDepartment.value.employees.forEach((employee) => {
    total += getEmployeePlan(employee.id, "invoices");
  });
  return total;
});

// Update total calls (optional - for manual override)
const updateTotalCalls = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value) || 0;
  departmentTotals.value.calls = value;
  changedDepartmentTotals.value.calls = value;
};

// Update total invoices (optional - for manual override)
const updateTotalInvoices = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value) || 0;
  departmentTotals.value.invoices = value;
  changedDepartmentTotals.value.invoices = value;
};

// Check if there are any changes to save
const hasChanges = computed(() => {
  return Object.keys(changedPlans.value).length > 0 || Object.keys(changedDepartmentTotals.value).length > 0;
});

// Save plans function
const savePlans = async () => {
  if (!hasChanges.value && Object.keys(changedDepartmentTotals.value).length === 0) return;

  const monthToSave = currentMonth.value; // Use reactive current month
  const plansToSave: Partial<PlanData>[] = [];

  // Convert changed plans to the API format - group by employee
  Object.entries(changedPlans.value).forEach(([employeeIdStr, metrics]) => {
    const employeeId = parseInt(employeeIdStr);

    // Create one plan entry per employee with all their changed metrics
    const planEntry: Partial<PlanData> = {
      month: monthToSave,
      employee_id: employeeId,
      department_id: selectedDepartmentId.value as number,
    };

    // Add all changed metrics to the same plan entry
    Object.entries(metrics).forEach(([metric, value]) => {
      switch (metric) {
        case "calls":
          planEntry.calls = value;
          break;
        case "invoices":
          planEntry.invoices = value;
          break;
        case "sold_tickets":
          planEntry.sold_tickets = value;
          break;
      }
    });

    plansToSave.push(planEntry);
  });

  // Handle department total changes (send only department_id with values)
  if (Object.keys(changedDepartmentTotals.value).length > 0) {
    const departmentTotalEntry: Partial<PlanData> = {
      month: monthToSave,
      department_id: selectedDepartmentId.value as number,
      employee_id: null, // Null for department totals
    };

    if (changedDepartmentTotals.value.calls !== undefined) {
      departmentTotalEntry.calls = changedDepartmentTotals.value.calls;
    }
    if (changedDepartmentTotals.value.invoices !== undefined) {
      departmentTotalEntry.invoices = changedDepartmentTotals.value.invoices;
    }

    plansToSave.push(departmentTotalEntry);
  }

  try {
    await savePlansMutation.mutateAsync(plansToSave as PlanData[]);
    // Clear changes after successful save
    changedPlans.value = {};
    changedDepartmentTotals.value = {};
  } catch (error) {
    console.error("Failed to save plans:", error);
  }
};

const onDepartmentChange = () => {
  // Additional logic if needed when department changes
};

// Sync API data to local stores when plans data changes
watch(
  [plansData, selectedDepartmentId],
  ([newPlansData, selectedDeptId]) => {
    if (!newPlansData || !selectedDeptId) return;

    // Clear local stores
    employeePlans.value = {};
    departmentTotals.value = { calls: 0, invoices: 0 };

    newPlansData.forEach((plan) => {
      // Check if this plan is for the selected department
      if (plan.department_id === selectedDeptId) {
        if (plan.employee_id === null) {
          // This is a department total (no employee_id)
          departmentTotals.value.calls = plan.calls || 0;
          departmentTotals.value.invoices = plan.invoices || 0;
        } else {
          // This is an employee plan (has employee_id)
          if (!employeePlans.value[plan.employee_id]) {
            employeePlans.value[plan.employee_id] = {};
          }
          employeePlans.value[plan.employee_id].calls = plan.calls || 0;
          employeePlans.value[plan.employee_id].invoices = plan.invoices || 0;
          employeePlans.value[plan.employee_id].sold_tickets = plan.sold_tickets || 0;
        }
      }
    });
  },
  { immediate: true, deep: true },
);

// Set first department as default when data loads
watch(
  data,
  (newData) => {
    if (newData && newData.length > 0 && !selectedDepartmentId.value) {
      selectedDepartmentId.value = newData[0]?.id || "";
    }
  },
  { immediate: true },
);
</script>
