<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Дашборд</h1>
        <p class="text-muted-foreground mt-2">
          Обзор основных метрик и показателей эффективности
        </p>
      </div>

      <DashboardGrid :metrics="dashboardMetrics" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DashboardGrid } from '@/widgets/dashboard'
import { mockDashboardMetrics } from '@/shared/lib/dashboard'

const dashboardMetrics = mockDashboardMetrics
</script>