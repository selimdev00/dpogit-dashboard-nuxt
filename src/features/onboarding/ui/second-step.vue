<template>
  <div>
    <OnboardingHeader
      title="Внутреннее формирует нашу реальность"
      description="Работая над собой, мы расширяем наши возможности вовне."
    />

    <img
      src="/assets/second-step-1.png"
      alt=""
      class="absolute bottom-0 z-0 transform w-full object-fit"
      preload
    />

    <img
      src="/shared/assets/star-blurred.png"
      alt=""
      class="absolute top-[169px] right-[88px] z-0 w-[121px] h-[121px]"
    />

    <onboarding-star-text
      class="mt-[148px] px-4 z-10"
      text="Результаты бизнеса отражаются нашу внутреннюю работу над собой."
    />
  </div>
</template>
<script setup lang="ts">
import { OnboardingHeader, OnboardingStarText } from "@/widgets/onboarding";
</script>
