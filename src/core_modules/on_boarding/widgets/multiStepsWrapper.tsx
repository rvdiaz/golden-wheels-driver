import { FooterConfig, HeaderConfig } from './formsWrapper';

// Multi-step form wrapper for handling multiple forms with animations
export interface MultiStepFormProps {
  steps: Array<{
    header: HeaderConfig;
    footer: FooterConfig;
    component: React.ComponentType<any>;
    props?: any;
  }>;
  currentStep: number;
  onStepChange?: (step: number) => void;
}

export const MultiStepFormWrapper = ({ steps, currentStep, onStepChange }: MultiStepFormProps) => {
  const currentStepConfig = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange?.(currentStep + 1);
    }
    currentStepConfig.footer.onNext?.();
  };

  const handleBack = () => {
    if (currentStep > 0) {
      onStepChange?.(currentStep - 1);
    }
    currentStepConfig.footer.onBack?.();
  };

  const percentByTotalSteps = steps.length;

  // Create footer with navigation handlers
  const footerWithNavigation = {
    ...currentStepConfig.footer,
    progressPercentage: (currentStep / percentByTotalSteps) * 100,
    onNext: currentStepConfig.footer.onNext || handleNext,
    onBack: currentStepConfig.footer.onBack || handleBack,
  };

  const stepsConfig = {
    ...currentStepConfig,
    currentStep,
    totalSteps: steps.length,
    footer: footerWithNavigation,
  };

  const CurrentComponent = stepsConfig.component;

  return <CurrentComponent {...(stepsConfig || {})} />;
};
