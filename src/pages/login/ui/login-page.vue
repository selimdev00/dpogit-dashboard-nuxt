<script setup lang="ts">
import { LoginForm, TestUsersInfo } from "@/features/auth";

definePageMeta({
  layout: 'guest',
  middleware: 'guest',
});
</script>

<template>
  <div class="space-y-6 max-w-[400px] mx-auto">
    <!-- Header -->
    <div class="text-center space-y-2">
      <h1 class="text-2xl font-bold">Вход в систему</h1>
      <p class="text-muted-foreground">
        Введите данные для входа в DPOGTI Dashboard
      </p>
    </div>

    <!-- Login Form -->
    <LoginForm />

    <!-- Test Users Info -->
    <TestUsersInfo />
  </div>
</template>