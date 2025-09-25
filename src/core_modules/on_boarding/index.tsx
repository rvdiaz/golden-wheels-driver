import React, { useState } from 'react';
import { User, Settings, CheckCircle, TrendingUp } from 'lucide-react-native';
import { FooterConfig, HeaderConfig } from './widgets/formsWrapper';
import { PersonalInformation } from './widgets/steps/personalnformationForm';
import { MultiStepFormWrapper } from './widgets/multiStepsWrapper';
import { VisionAndMission } from './widgets/steps/visionAndMission';
import { FinantialGoals } from './widgets/steps/finantialGoals';
import { FormProvider, useForm } from 'react-hook-form';
import { OnboardingFormData } from './interface';
import { SwotAnalysisStep } from './widgets/steps/swotAnalisysForm';

// Complete onboarding flow using the MultiStepFormWrapper
export const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<OnboardingFormData>({
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        mlsNumber: '',
        zipCode: '',
        brokerage: '',
        email: '',
        phone: '',
      },
      visionMission: {
        oneYear: '',
        fiveYear: '',
        statement: '',
        drivesYou: '',
      },
      swotAnalysis: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
      },
      financialGoals: {},
    },
    mode: 'onChange', // Validate on change for better UX
  });

  const {
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = methods;

  // Handle step navigation with validation
  const handleStepNext = async (stepName?: keyof OnboardingFormData) => {
    // Validate current step fields
    const isValid = await trigger(stepName);

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePersonalInfoNext = () => {
    handleStepNext('personalInfo');
  };

  const handleVisionMissionNext = () => {
    handleStepNext('visionMission');
  };

  const handleFinalSubmit = handleSubmit((data) => {
    console.log('Complete form data:', data);
    onComplete();
  });

  const stepBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const steps = [
    {
      header: {
        icon: User,
        title: 'Personal Information',
        subtitle: 'Tell us about yourself so we can personalize your experience',
      } as HeaderConfig,
      footer: {
        showNext: true,
        nextTitle: 'Continue',
        showSlider: true,
        progressPercentage: 25,
        onNext: handlePersonalInfoNext,
      } as FooterConfig,
      component: PersonalInformation,
      props: {
        errors: errors.personalInfo,
      },
    },
    {
      header: {
        icon: Settings,
        title: 'Vision and Mission',
        subtitle: 'Define your vision and mission for success',
      } as HeaderConfig,
      footer: {
        showBack: true,
        showNext: true,
        backTitle: 'Back',
        nextTitle: 'Continue',
        showSlider: true,
        progressPercentage: 50,
        onBack: stepBack,
        onNext: handleVisionMissionNext,
      } as FooterConfig,
      component: VisionAndMission,
      props: {
        errors: errors.visionMission,
      },
    },
    // SWOT Analysis - Strengths
    {
      header: {
        icon: TrendingUp,
        title: 'SWOT Analysis',
        subtitle: 'Assess your strengths, weaknesses, opportunities, and threats',
      } as HeaderConfig,
      footer: {
        showBack: true,
        showNext: true,
        backTitle: 'Back',
        nextTitle: 'Continue',
        progressPercentage: 75,
        onBack: stepBack,
        onNext: handleStepNext, // No validation per substep
      } as FooterConfig,
      component: SwotAnalysisStep, // 👈 New single component for all SWOT
      props: {
        errors: errors.swotAnalysis,
      },
    },
    {
      header: {
        icon: CheckCircle,
        title: 'Financial Goals',
        subtitle: 'Set your financial objectives and targets',
      } as HeaderConfig,
      footer: {
        showBack: true,
        showNext: true,
        backTitle: 'Back',
        nextTitle: 'Complete Setup',
        showSlider: true,
        progressPercentage: 100,
        onBack: stepBack,
        onComplete: handleFinalSubmit,
      } as FooterConfig,
      component: FinantialGoals,
      props: {
        errors: errors.financialGoals,
        allData: getValues(), // Pass all form data if needed
      },
    },
  ];

  return (
    <FormProvider {...methods}>
      <MultiStepFormWrapper steps={steps} currentStep={currentStep} onStepChange={setCurrentStep} />
    </FormProvider>
  );
};
