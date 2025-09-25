<template>
  <div>
    <OnboardingHeader
      title="Окружение, как двигатель и усилитель "
      description="Один человек может многое, но в сильном окружении мы умножаем возможности, скорость и глубину роста. "
    />

    <img
      src="/assets/eighth-step-1.png"
      alt=""
      class="absolute bottom-0 z-0 transform object-fit"
    />

    <img
      src="/shared/assets/star-blurred.png"
      alt=""
      class="absolute top-[245px] left-[50px] z-0 w-[82px] h-[82px]"
    />

    <onboarding-star-text
      class="px-4 z-10 mt-[158px]"
      text="Здесь каждый растёт быстрее за счёт энергии и правды сообщества."
    />
  </div>
</template>
<script setup lang="ts">
import { OnboardingHeader, OnboardingStarText } from "@/widgets/onboarding";
</script>
