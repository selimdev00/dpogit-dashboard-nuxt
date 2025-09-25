<script setup lang="ts">
import { navigateTo } from "nuxt/app";
import { computed } from "vue";
import { UiButton } from "@/shared/ui/button";
import { OnboardingArrowRight, OnboardingArrowLeft } from "@/shared/ui/icons";
import { useOnboardingStore } from "@/widgets/onboarding/model/store";

const onboardingStore = useOnboardingStore();

const emit = defineEmits(["previous", "next"]);

const handlePrevious = () => {
  emit("previous");
};

const handleNext = () => {
  emit("next");
};

const isFirstStep = computed(() => onboardingStore.isFirstStep);
const isAgreementStep = computed(() => onboardingStore.isAgreementStep);
const isLastStep = computed(() => onboardingStore.isLastStep);

const buttonText = computed(() => {
  if (isAgreementStep.value) {
    return "Я согласен";
  } else {
    return "Продолжить";
  }
});

const resetOnboarding = () => {
  onboardingStore.reset();
  navigateTo("/");
};
</script>

<template>
  <div class="flex h-[60px] shrink-0 px-4 z-20">
    <ui-button
      v-if="(!isFirstStep && !isLastStep) || isAgreementStep"
      variant="white"
      class="w-[60px] h-[60px] shrink-0"
      @click="handlePrevious"
    >
      <onboarding-arrow-left class="shrink-0" />
    </ui-button>

    <ui-button
      v-if="!isAgreementStep && isLastStep"
      class="h-full"
      @click="resetOnboarding"
    >
      Хорошо
    </ui-button>

    <ui-button v-else class="h-full" @click="handleNext">
      {{ buttonText }}
      <onboarding-arrow-right
        v-if="!isLastStep || isAgreementStep"
        class="shrink-0"
      />
    </ui-button>

    <img
      src="@/widgets/onboarding/assets/shadow.png"
      alt=""
      class="absolute -z-20 -bottom-4 left-0 w-full object-contain select-none pointer-events-none"
    />
  </div>
</template>
