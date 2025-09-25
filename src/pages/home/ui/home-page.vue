<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto py-8">
      <!-- Error State -->
      <div v-if="hasError && !isLoading" class="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <h3 class="text-destructive font-medium mb-2">Ошибка загрузки данных</h3>
        <ul class="text-sm text-destructive/80">
          <li v-for="error in errors" :key="error.message">
            {{ error.message }}
          </li>
        </ul>
      </div>

      <!-- Dashboard Content -->
      <DashboardGrid :metrics="dashboardMetrics" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DashboardGrid } from '@/widgets/dashboard'
import { useDashboardData } from '@/widgets/dashboard/model/useDashboardData'
import { useDashboardStore } from '@/shared/stores/dashboard'

const dashboardStore = useDashboardStore()

const {
  dashboardMetrics,
  isLoading,
  hasError,
  errors,
  refetchAll
} = useDashboardData()
</script>