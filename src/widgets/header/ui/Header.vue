<template>
  <header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-16 items-center justify-between">
      <!-- Logo and DatePicker -->
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <Logo />
        </NuxtLink>

        <!-- DatePicker -->
        <DatePicker v-model="selectedDateRange" @update:modelValue="handleDateChange" />
      </div>

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

    </div>
  </header>
</template>

<script lang="ts" setup>
import { Logo } from '@/shared/ui/logo'
import { DatePicker } from '@/shared/ui/datepicker'

interface NavItem {
  path: string
  label: string
}

interface DateRange {
  period: string
  year: number
  month?: number
  quarter?: number
}

const selectedDateRange = ref<DateRange>({
  period: 'month',
  year: 2025,
  month: 9
})

const handleDateChange = (value: DateRange) => {
  selectedDateRange.value = value
  // TODO: Emit or handle date change to update dashboard data
  console.log('Date range changed:', value)
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Главная'
  },
  {
    path: '/departments',
    label: 'Отделы'
  }
]
</script>