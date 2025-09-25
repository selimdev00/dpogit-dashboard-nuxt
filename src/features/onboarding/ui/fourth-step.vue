<template>
  <div>
    <OnboardingHeader
      title="Настоящая сила —  в честности."
      description="Развитие, как образ жизни. Мы не ищем быстрых побед и мотивации. Мы выстраиваем путь постоянной эволюции: личной, духовной, профессиональной. Каждый день — шаг в глубину."
    />

    <img
      src="/assets/fourth-step-1.png"
      alt=""
      class="absolute bottom-0 z-0 transform object-fit"
    />

    <img
      src="/shared/assets/star-blurred.png"
      alt=""
      class="absolute top-[270px] left-[127px] z-0 w-[121px] h-[121px]"
    />

    <onboarding-star-text
      class="mt-[148px] px-4 z-10"
      text="Мы не идём на компромиссы, которые ломают нас изнутри. "
    />
  </div>
</template>
<script setup lang="ts">
import { OnboardingHeader, OnboardingStarText } from "@/widgets/onboarding";
</script>
