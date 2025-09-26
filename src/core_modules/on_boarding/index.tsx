import React, { useState, useEffect } from 'react';
import { User, Settings, CheckCircle, TrendingUp } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FooterConfig, HeaderConfig } from './widgets/formsWrapper';
import { PersonalInformation } from './widgets/steps/personalnformationForm';
import { MultiStepFormWrapper } from './widgets/multiStepsWrapper';
import { VisionAndMission } from './widgets/steps/visionAndMission';
import { FinantialGoals } from './widgets/steps/finantialGoals';
import { FormProvider, useForm } from 'react-hook-form';
import { OnboardingFormData } from './interface';
import { SwotAnalysisStep } from './widgets/steps/swotAnalisysForm';
import { StartPointScreen } from './widgets/startScreen';

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
      financialGoals: {
        desiredAnnualIncome: undefined,
        avgCommissionBySales: undefined,
        avgCommissionByRents: undefined,
      },
    },
    mode: 'onChange', // Validate on change for better UX
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
        // Skip onboarding and call onComplete
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

  // Clear onboarding data (useful for testing or reset functionality)
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
    // Validate current step fields
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

  const handleFinalSubmit = handleSubmit(async (data) => {
    // Mark onboarding as completed
    await markOnboardingComplete();

    // Optionally clear the form data after completion
    // await clearOnboardingData();

    onComplete();
  });

  const stepBack = async () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    await saveCurrentStep(prevStep);
  };

  // Update step change handler to save step
  const handleStepChange = async (step: number) => {
    setCurrentStep(step);
    await saveCurrentStep(step);
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

  // Show loading state while checking saved data
  if (isLoading) {
    return null; // Or return a loading component
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
  // Check if onboarding is completed
  isOnboardingCompleted: async (): Promise<boolean> => {
    try {
      const isCompleted = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return isCompleted === 'true';
    } catch (error) {
      console.error('Error checking onboarding completion:', error);
      return false;
    }
  },

  // Reset onboarding (for testing or user request)
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

  // Get saved onboarding data
  getSavedData: async (): Promise<OnboardingFormData | null> => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Error getting saved data:', error);
      return null;
    }
  },

  // Save that the user has created an account
  setAccountCreated: async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNT_CREATED, 'true');
    } catch (error) {
      console.error('Error setting account created flag:', error);
    }
  },

  // Check if the user already created an account
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
