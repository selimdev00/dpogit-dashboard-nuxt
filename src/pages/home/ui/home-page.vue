<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto py-8">
      <div class="mb-8 flex items-center justify-between">
        <!-- Only render refresh button on client -->
        <ClientOnly>
          <template #fallback>
            <div class="px-4 py-2 bg-primary/50 text-primary-foreground rounded-md flex items-center space-x-2">
              <div class="h-4 w-4 bg-primary-foreground/50 rounded"></div>
              <span>Загрузка...</span>
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Client-only dashboard content -->
      <ClientOnly>
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

        <template #fallback>
          <!-- Server-side fallback - skeleton loading -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            <div
              v-for="i in 6"
              :key="i"
              class="h-32 bg-card rounded-lg animate-pulse"
            ></div>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DashboardGrid } from '@/widgets/dashboard'
import { useDashboardData } from '@/widgets/dashboard/model/useDashboardData'

const {
  dashboardMetrics,
  isLoading,
  hasError,
  errors,
  refetchAll
} = useDashboardData()
</script>