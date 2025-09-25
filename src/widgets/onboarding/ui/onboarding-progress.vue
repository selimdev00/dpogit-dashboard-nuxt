<script setup lang="ts">
import { computed } from "vue";
import { useOnboardingStore } from "@/widgets/onboarding/model/store";

const onboardingStore = useOnboardingStore();

const totalSteps = computed(() => onboardingStore.totalSteps);

const currentStep = computed(() => onboardingStore.currentStep);
</script>

<template>
  <div class="flex items-center gap-1 px-4">
    <div
      v-for="step in totalSteps"
      :key="step"
      class="w-full h-[2px] transition-colors"
      :class="{
        'bg-[rgba(236,235,236,1)]': step === currentStep,
        'bg-[rgba(255,255,255,0.3)]': step !== currentStep,
      }"
    ></div>
  </div>
</template>
