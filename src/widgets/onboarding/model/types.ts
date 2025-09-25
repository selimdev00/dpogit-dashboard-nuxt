export interface OnboardingState {
  currentStep: number;
  completedSteps: Set<number>;
  totalSteps: number | null;
}

export type OnboardingStep = "profile" | "preferences";

export interface StepProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onComplete?: () => void;
}
