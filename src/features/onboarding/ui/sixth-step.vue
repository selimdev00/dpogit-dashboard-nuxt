<template>
  <div>
    <OnboardingHeader
      title="Целостность, как основа"
      description="Мы не живём в разрыве между ролями. Мы выстраиваем центр, из которого интегрируется всё: здоровье, отношения, бизнес и духовность."
    />

    <img
      src="/assets/sixth-step-1.png"
      alt=""
      class="absolute bottom-0 z-0 transform object-fit"
    />

    <img
      src="/shared/assets/star-group.png"
      alt=""
      class="absolute top-[219px] z-0 w-[80%]"
    />
  </div>
</template>
<script setup lang="ts">
import { OnboardingHeader, OnboardingStarText } from "@/widgets/onboarding";
</script>
