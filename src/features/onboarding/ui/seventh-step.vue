<template>
  <div>
    <OnboardingHeader
      title="Предпринимательство, как служение"
      description="Бизнес для нас не гонка за прибылью,  а инструмент создания ценности и влияния."
    />

    <img
      src="/assets/seventh-step-1.png"
      alt=""
      class="absolute bottom-0 z-0 transform object-fit"
    />

    <img
      src="/shared/assets/star-blurred.png"
      alt=""
      class="absolute top-[211px] right-[88px] z-0 w-[121px] h-[121px]"
    />

    <onboarding-star-text
      class="px-4 z-10 mt-[158px]"
      text="Деньги - это лишь следствие того, что мы даём миру."
    />
  </div>
</template>
<script setup lang="ts">
import { OnboardingHeader, OnboardingStarText } from "@/widgets/onboarding";
</script>
