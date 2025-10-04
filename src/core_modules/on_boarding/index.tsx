import React, { useState, useEffect } from 'react';
import {
  User,
  CheckCircle,
  TrendingUp,
  Star,
  AlertTriangle,
  Target,
  Eye,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FooterConfig, HeaderConfig } from './widgets/formsWrapper';
import { PersonalInformation } from './widgets/steps/personalnformationForm';
import { MultiStepFormWrapper } from './widgets/multiStepsWrapper';
import { VisionAndMission } from './widgets/steps/visionAndMission';
import { FinantialGoals } from './widgets/steps/finantialGoals';
import { FormProvider, useForm } from 'react-hook-form';
import { OnboardingFormData } from './interface';
import {
  SwotStrengths,
  SwotWeaknesses,
  SwotOpportunities,
  SwotThreats,
} from './widgets/steps/swotAnalisysForm';
import { StartPointScreen } from './widgets/startScreen';
import { LoadingFirstScreen } from '~/navigation/header/loadingFirstScreen';

// Storage keys
const STORAGE_KEYS = {
  ONBOARDING_DATA: '@onboarding_data',
  ONBOARDING_STEP: '@onboarding_current_step',
  ONBOARDING_COMPLETED: '@onboarding_completed',
  ACCOUNT_CREATED: 'ACCOUNT_CREATED',
};

// Complete onboarding flow using the MultiStepFormWrapper
export const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);

  const methods = useForm<OnboardingFormData>({
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        mlsNumber: '',
        brokerage: '',
        email: '',
        phone: '',
        addressLine1: '',
        region: 'FL',
        country: 'USA',
        postalCode: '',
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
      financialGoals: {
        desiredAnnualIncome: undefined,
        avgCommissionBySales: undefined,
        avgCommissionByRents: undefined,
      },
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    trigger,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = methods;

  // Load saved data on component mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Watch form data and save to storage whenever it changes
  useEffect(() => {
    const subscription = watch((data) => {
      if (!isLoading) {
        saveFormData(data as OnboardingFormData);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isLoading]);

  // Save form data to AsyncStorage
  const saveFormData = async (data: OnboardingFormData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_DATA, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  // Save current step to AsyncStorage
  const saveCurrentStep = async (step: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_STEP, step.toString());
    } catch (error) {
      console.error('Error saving current step:', error);
    }
  };

  // Mark onboarding as completed
  const markOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
    }
  };

  // Load saved data from AsyncStorage
  const loadSavedData = async () => {
    try {
      setIsLoading(true);

      // Check if onboarding is already completed
      const isCompleted = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      if (isCompleted === 'true') {
        onComplete();
        return;
      }

      // Load saved form data
      const savedData = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
      if (savedData) {
        const parsedData = JSON.parse(savedData) as OnboardingFormData;
        reset(parsedData);
      }

      // Load saved step
      const savedStep = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_STEP);
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear onboarding data
  const clearOnboardingData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ONBOARDING_DATA,
        STORAGE_KEYS.ONBOARDING_STEP,
        STORAGE_KEYS.ONBOARDING_COMPLETED,
      ]);
    } catch (error) {
      console.error('Error clearing onboarding data:', error);
    }
  };

  // Handle step navigation with validation and persistence
  const handleStepNext = async (stepName?: keyof OnboardingFormData) => {
    const isValid = await trigger(stepName);

    if (isValid) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      await saveCurrentStep(nextStep);
    }
  };

  const handlePersonalInfoNext = () => {
    handleStepNext('personalInfo');
  };

  const handleVisionMissionNext = () => {
    handleStepNext('visionMission');
  };

  // SWOT step handlers - no validation needed as they're selection-based
  const handleSwotNext = () => {
    handleStepNext();
  };

  const handleFinalSubmit = handleSubmit(async (data) => {
    await markOnboardingComplete();
    onComplete();
  });

  const stepBack = async () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    await saveCurrentStep(prevStep);
  };

  const handleStepChange = async (step: number) => {
    setCurrentStep(step);
    await saveCurrentStep(step);
  };

  // Calculate progress percentage for each step
  const totalSteps = 7; // Personal Info + Vision/Mission + 4 SWOT steps + Financial Goals

  const steps = [
    // Step 1: Personal Information
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
        progressPercentage: (1 / totalSteps) * 100,
        onNext: handlePersonalInfoNext,
      } as FooterConfig,
      component: PersonalInformation,
      props: {
        errors: errors.personalInfo,
      },
    },
    // Step 2: Vision and Mission
    {
      header: {
        icon: Eye,
        title: 'Vision and Mission',
        subtitle: 'Define your vision and mission for success',
      } as HeaderConfig,
      footer: {
        showBack: true,
        showNext: true,
        backTitle: 'Back',
        nextTitle: 'Continue',
        showSlider: true,
        progressPercentage: (2 / totalSteps) * 100,
        onBack: stepBack,
        onNext: handleVisionMissionNext,
      } as FooterConfig,
      component: VisionAndMission,
      props: {
        errors: errors.visionMission,
      },
    },
    // Step 3: SWOT - Strengths
    {
      header: {
        icon: Star,
        title: 'SWOT Analysis - Strengths',
        subtitle: 'What are your key strengths as a real estate professional?',
      } as HeaderConfig,
      footer: {
        showBack: true,
        showNext: true,
        backTitle: 'Back',
        nextTitle: 'Continue',
        showSlider: true,
        progressPercentage: (3 / totalSteps) * 100,
        onBack: stepBack,
        onNext: handleSwotNext,
      } as FooterConfig,
      component: SwotStrengths,
      props: {
        errors: errors.swotAnalysis,
      },
    },
    // Step 4: SWOT - Weaknesses
    {
      header: {
        icon: AlertTriangle,
        title: 'SWOT Analysis - Weaknesses',
        subtitle: 'What areas would you like to improve or develop?',
      } as HeaderConfig,
      footer: {
        showBack: true,
        showNext: true,
        backTitle: 'Back',
        nextTitle: 'Continue',
        showSlider: true,
        progressPercentage: (4 / totalSteps) * 100,
        onBack: stepBack,
        onNext: handleSwotNext,
      } as FooterConfig,
      component: SwotWeaknesses,
      props: {
        errors: errors.swotAnalysis,
      },
    },
    // Step 5: SWOT - Opportunities
    {
      header: {
        icon: TrendingUp,
        title: 'SWOT Analysis - Opportunities',
        subtitle: 'What opportunities do you see in your market?',
      } as HeaderConfig,
      footer: {
        showBack: true,
        showNext: true,
        backTitle: 'Back',
        nextTitle: 'Continue',
        showSlider: true,
        progressPercentage: (5 / totalSteps) * 100,
        onBack: stepBack,
        onNext: handleSwotNext,
      } as FooterConfig,
      component: SwotOpportunities,
      props: {
        errors: errors.swotAnalysis,
      },
    },
    // Step 6: SWOT - Threats
    {
      header: {
        icon: Target,
        title: 'SWOT Analysis - Threats',
        subtitle: 'What challenges or threats do you need to consider?',
      } as HeaderConfig,
      footer: {
        showBack: true,
        showNext: true,
        backTitle: 'Back',
        nextTitle: 'Continue',
        showSlider: true,
        progressPercentage: (6 / totalSteps) * 100,
        onBack: stepBack,
        onNext: handleSwotNext,
      } as FooterConfig,
      component: SwotThreats,
      props: {
        errors: errors.swotAnalysis,
      },
    },
    // Step 7: Financial Goals
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
        progressPercentage: (7 / totalSteps) * 100,
        onBack: stepBack,
        onComplete: handleFinalSubmit,
      } as FooterConfig,
      component: FinantialGoals,
      props: {
        errors: errors.financialGoals,
        allData: getValues(),
      },
    },
  ];

  if (isLoading) {
    return <LoadingFirstScreen />;
  }

  if (currentStep === -1) {
    return (
      <StartPointScreen
        onNext={() => {
          setCurrentStep(0);
        }}
      />
    );
  }

  return (
    <FormProvider {...methods}>
      <MultiStepFormWrapper
        steps={steps}
        currentStep={currentStep}
        onStepChange={handleStepChange}
      />
    </FormProvider>
  );
};

// Export utility functions for external use
export const OnboardingStorage = {
  isOnboardingCompleted: async (): Promise<boolean> => {
    try {
      const isCompleted = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return isCompleted === 'true';
    } catch (error) {
      console.error('Error checking onboarding completion:', error);
      return false;
    }
  },

  resetOnboarding: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ONBOARDING_DATA,
        STORAGE_KEYS.ONBOARDING_STEP,
        STORAGE_KEYS.ONBOARDING_COMPLETED,
      ]);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  },

  getSavedData: async (): Promise<OnboardingFormData | null> => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Error getting saved data:', error);
      return null;
    }
  },

  setAccountCreated: async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNT_CREATED, 'true');
    } catch (error) {
      console.error('Error setting account created flag:', error);
    }
  },

  isAccountCreated: async (): Promise<boolean> => {
    try {
      const isCreated = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNT_CREATED);
      return isCreated === 'true';
    } catch (error) {
      console.error('Error checking account created flag:', error);
      return false;
    }
  },
};
