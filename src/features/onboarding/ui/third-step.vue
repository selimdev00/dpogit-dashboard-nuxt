<template>
  <div>
    <OnboardingHeader
      title="Честность и целостность без компромиссов "
      description="Мы действуем из правды: с собой, с близкими,  с партнёрами."
    />

    <img
      src="/assets/third-step-1.png"
      alt=""
      class="absolute bottom-0 z-0 transform object-fit"
    />

    <img
      src="/shared/assets/star-blurred.png"
      alt=""
      class="absolute top-[189px] left-[16px] z-0 w-[121px] h-[121px]"
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
