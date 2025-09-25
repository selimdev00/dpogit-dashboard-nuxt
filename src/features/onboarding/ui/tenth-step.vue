<template>
  <div>
    <OnboardingHeader
      title="Подлинность вместо масок "
      description="Мы создаем пространство, где не нужно изображать успешность или стараться соответствовать чьим-то ожиданиям. "
    />

    <img
      src="/assets/tenth-step-1.png"
      alt=""
      class="absolute bottom-0 z-0 transform object-fit"
    />

    <img
      src="/shared/assets/star-blurred.png"
      alt=""
      class="absolute top-[189px] right-[30px] z-0 w-[82px] h-[82px]"
    />

    <onboarding-star-text
      class="px-4 z-10 mt-[72px]"
      text="Мы создаем безопасное пространство, где ценим прямоту, открытость и правду, даже если она неудобна с большим уважением и любовью к каждому участнику. Сила рождается там, где нет масок. "
    />
  </div>
</template>
<script setup lang="ts">
import { OnboardingHeader, OnboardingStarText } from "@/widgets/onboarding";
</script>
