<template>
  <div>
    <OnboardingHeader
      title="Семья, как источник силы"
      description="Бизнес, который разрушает семью — это поражение. "
    />

    <img
      src="/assets/fifth-step-1.png"
      alt=""
      class="absolute bottom-0 z-0 transform object-fit"
    />

    <onboarding-star-text
      class="px-4 z-10 mt-5"
      text="Мы строим дела так, чтобы они усиливали близкие отношения и позволяли быть настоящей опорой для тех, кто нам дорог."
    />
  </div>
</template>
<script setup lang="ts">
import { OnboardingHeader, OnboardingStarText } from "@/widgets/onboarding";
</script>
