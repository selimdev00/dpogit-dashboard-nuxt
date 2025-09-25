<template>
  <div>
    <OnboardingHeader
      title="Личность важнее оборотов"
      description="Мы против ярлыков, поэтому нас не интересует оборот и доход участников. "
    />

    <img
      src="/assets/eleventh-step-1.png"
      alt=""
      class="absolute bottom-0 z-0 transform object-fit"
    />

    <img
      src="/shared/assets/star-blurred.png"
      alt=""
      class="absolute top-[189px] right-[50px] z-0 w-[98px] h-[98px]"
    />

    <onboarding-star-text
      class="px-4 z-10 mt-[128px]"
      text="Нас интересует личность, её зрелость  и глубина. Потому что именно человек, а не цифра, создаёт реальную ценность и будущее.
"
    />
  </div>
</template>
<script setup lang="ts">
import { OnboardingHeader, OnboardingStarText } from "@/widgets/onboarding";
</script>
