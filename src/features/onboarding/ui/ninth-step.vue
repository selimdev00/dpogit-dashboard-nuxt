<template>
  <div>
    <OnboardingHeader
      title="Глубина важнее широты"
      description="Мы не живем на волнах вдохновения. Мы строим внутренний фундамент, который не рушится  в кризисах. Это и есть настоящая устойчивость. "
    />

    <img
      src="/assets/ninth-step-1.png"
      alt=""
      class="absolute bottom-0 z-0 transform object-fit"
    />

    <img
      src="/shared/assets/star-blurred.png"
      alt=""
      class="absolute top-[208px] right-[119px] z-0 w-[98px] h-[98px]"
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
