<template>
  <header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-16 items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <Logo />
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
        <NuxtLink
          to="/"
          class="transition-colors hover:text-foreground/80 text-foreground/60"
          active-class="text-foreground"
        >
          Главная
        </NuxtLink>
      </nav>

    </div>
  </header>
</template>

<script lang="ts" setup>
import { Logo } from '@/shared/ui/logo'
</script>
