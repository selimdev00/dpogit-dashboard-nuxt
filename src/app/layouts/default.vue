<template>
  <div class="min-h-screen bg-background">
    <Header />

    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Header } from "@/widgets/header";
</script>
