import { defineStore } from "pinia";
import { ref, computed, watch, reactive } from "vue";

export enum onboardingStorageKeys {
  STEP = "onboarding_step",
  AGREE = "onboarding_agree",
  STEPS_DATA = "onboarding_steps_data",
}

export const useOnboardingStore = defineStore("onboarding", () => {

  // State
  const currentStep = ref<number>(1);
  const completedSteps = ref(new Set<number>());
  const totalSteps = ref<number>(-1);
  const isAgreed = ref<boolean>(false);
  const stepsData = ref<Record<number, any>>({});


  // Getters
  const isStepCompleted = computed(() => (step: number) => {
    return completedSteps.value.has(step);
  });

  const progress = computed(() => {
    return (completedSteps.value.size / 4) * 100;
  });

  const isFirstStep = computed(() => {
    return currentStep.value === 1;
  });

  const isLastStep = computed(() => {
    return currentStep.value === totalSteps.value;
  });

  const isAgreementStep = computed(() => {
    return isLastStep.value && !isAgreed.value;
  });

  const getStepData = computed(() => (step: number) => {
    return stepsData.value[step] || {};
  });

  // Actions
  const setTotalSteps = (n: number) => {
    totalSteps.value = n;
  };

  const nextStep = () => {
    if (currentStep.value < totalSteps.value) {
      completedSteps.value.add(currentStep.value);
      currentStep.value++;
    }
  };

  const previousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps.value) {
      currentStep.value = step;
    }
  };

  const skipToEnd = () => {
    currentStep.value = totalSteps.value;
  };

  const reset = () => {
    currentStep.value = 1;
    completedSteps.value.clear();
    stepsData.value = {};
    isAgreed.value = false;
  };

  const setIsAgreed = (value: boolean) => {
    isAgreed.value = value;
  };

  const init = async () => {
    await initCurrentStep();
    await initIsAgreed();
  };

  const initCurrentStep = async () => {
    // Cloud storage removed - implement local storage if needed
  };

  const initIsAgreed = async () => {
    // Cloud storage removed - implement local storage if needed
  };

  const initStepsData = async () => {
    // Cloud storage removed - implement local storage if needed
  };

  const setStepData = (step: number, data: any) => {
    stepsData.value[step] = data;
  };

  return {
    // State
    totalSteps,
    currentStep,
    completedSteps,
    isAgreed,
    stepsData,

    // Getters
    isStepCompleted,
    progress,
    isAgreementStep,
    isFirstStep,
    isLastStep,
    getStepData,

    // Actions
    init,
    initCurrentStep,
    initIsAgreed,
    initStepsData,
    setTotalSteps,
    nextStep,
    previousStep,
    goToStep,
    skipToEnd,
    reset,
    setIsAgreed,
    setStepData,
  };
});
