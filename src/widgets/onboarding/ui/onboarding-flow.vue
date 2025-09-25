<script setup lang="ts">
import { computed, reactive, markRaw, ref } from "vue";
import type { Component } from "vue";
import gsap from "gsap";
import {
  WelcomeStep,
  SecondStep,
  ThirdStep,
  FourthStep,
  FifthStep,
  SixthStep,
  SeventhStep,
  EighthStep,
  NinthStep,
  TenthStep,
  EleventhStep,
  TwelfthStep,
  FinalStep,
  NameStep,
  AboutStep,
  RequestStep,
  RequestSentStep,
  UpdateInfoStep,
} from "@/features/onboarding";
import { OnboardingNavigation, OnboardingProgress } from "@/widgets/onboarding";
import { useOnboardingStore } from "@/widgets/onboarding/model/store";

const onboardingStore = useOnboardingStore();

const steps = reactive([
  markRaw(WelcomeStep),
  markRaw(SecondStep),
  markRaw(ThirdStep),
  markRaw(FourthStep),
  markRaw(FifthStep),
  markRaw(SixthStep),
  markRaw(SeventhStep),
  markRaw(EighthStep),
  markRaw(NinthStep),
  markRaw(TenthStep),
  markRaw(EleventhStep),
  markRaw(TwelfthStep),
  markRaw(FinalStep),
]);

onboardingStore.setTotalSteps(steps.length);

const addFormSteps = () => {
  [
    false ? markRaw(NameStep) : markRaw(UpdateInfoStep),
    markRaw(AboutStep),
    markRaw(RequestStep),
    markRaw(RequestSentStep),
  ].map((c) => {
    steps.push(c);
  });

  onboardingStore.setTotalSteps(steps.length);
  onboardingStore.setIsAgreed(true);
};

const addStepsIfAfterAgree = () => {
  if (onboardingStore.isAgreementStep) {
    addFormSteps();
  }
};

const currentStep = computed(() => onboardingStore.currentStep);

const currentStepComponent = computed(() => steps[currentStep.value - 1]);

const handlePrevious = () => {
  onboardingStore.previousStep();
};

const currentOnboardingStep = ref<
  | (Component & {
      validate: () => Promise<{
        valid: boolean;
        values: Record<string, string>;
      }>;
    })
  | null
>(null);

const handleNext = async () => {
  let isValid = true;

  if (currentOnboardingStep.value?.validate) {
    const { valid, values } = await currentOnboardingStep.value.validate();
    await onboardingStore.setStepData(currentStep.value, values);
    isValid = valid;
  }

  if (isValid) {
    addStepsIfAfterAgree();
    onboardingStore.nextStep();
  }
};

const beforeEnter = (el: Element) => {
  const htmlEl = el as HTMLElement;
  gsap.set(htmlEl, {
    opacity: 0,
  });
};

const enter = (el: Element, done: () => void) => {
  const htmlEl = el as HTMLElement;
  gsap.to(htmlEl, {
    opacity: 1,
    duration: 0.1,
    onComplete: done,
  });
};

const leave = (el: Element, done: () => void) => {
  const htmlEl = el as HTMLElement;
  gsap.to(htmlEl, {
    opacity: 0,
    duration: 0.1,
    onComplete: done,
  });
};

const isBgBlack = computed(() => {
  if (currentStep.value === steps.length) return false;

  if (currentStep.value >= 14) {
    return currentStep.value % 2 === 1;
  } else {
    return currentStep.value % 2 === 0;
  }
});

await onboardingStore.initIsAgreed();
if (onboardingStore.isAgreed) {
  addFormSteps();
}

await onboardingStore.initCurrentStep();

await onboardingStore.initStepsData();
</script>

<template>
  <div
    class="h-screen w-full transition-colors"
    :class="{
      'bg-black': isBgBlack,
    }"
  >
    <div
      class="relative w-full h-full pt-5 space-y-5 mx-auto flex flex-col max-w-tg"
    >
      <onboarding-progress />

      <Transition
        :css="false"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
        mode="out-in"
      >
        <component
          ref="currentOnboardingStep"
          :is="currentStepComponent"
          :initialValues="onboardingStore.getStepData(currentStep)"
          class="z-20"
        />
      </Transition>

      <onboarding-navigation
        class="sticky bottom-4 mb-5 mt-auto"
        @previous="handlePrevious"
        @next="handleNext"
      />
    </div>
  </div>
</template>
