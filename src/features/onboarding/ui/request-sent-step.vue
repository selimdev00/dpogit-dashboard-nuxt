<template>
  <div>
    <img src="/assets/request-sent-step-1.png" class="mt-[25px]" alt="" />

    <OnboardingHeader
      class="text-center mt-6"
      title="Ваша заявка на вступление отправлена"
      description="После её рассмотрения вам откроется доступ в сообщество."
    />
  </div>
</template>

<script setup lang="ts">
import { OnboardingHeader } from "@/widgets/onboarding";
</script>
