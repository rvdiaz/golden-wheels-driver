import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { Rocket } from 'lucide-react-native';
import { StepIcon } from '../on_boarding/widgets/stepIcon';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { FadeTransition } from '~/codidge_components/UI/transitions/fadeIn';
import { theme } from '~/theme/theme';
import Background from '~/codidge_components/UI/backgroundImage';
import { AuthWrapper } from '~/core_modules/auth/authWrapper';
import { FormProvider, useForm } from 'react-hook-form';
import { IPersonalData } from '../on_boarding/interface';
import { OnboardingFlowStorage } from './helpers/onboardingStorage';
import { LoadingFirstScreen } from '~/navigation/header/loadingFirstScreen';

export const StartPointScreen = () => {
  const [showFirstScreen, setShowFirstScreen] = useState(true);
  const [loading, setloading] = useState(true);

  const methods = useForm<IPersonalData>({
    defaultValues: {
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
    mode: 'onChange',
  });

  // Check onboarding state on mount
  useEffect(() => {
    const checkOnboardingState = async () => {
      const hasPassedFirst = await OnboardingFlowStorage.hasPassedFirstScreen();

      if (hasPassedFirst) {
        setShowFirstScreen(false);
      }
      setloading(false);
    };

    checkOnboardingState();
  }, []);

  const handleGetStarted = async () => {
    await OnboardingFlowStorage.setFirstScreenPassed();
    setShowFirstScreen(false);
  };

  if (loading) {
    return <LoadingFirstScreen />;
  }

  let bodyWidget = <AuthWrapper />;

  if (showFirstScreen) {
    bodyWidget = (
      <Background>
        <View style={styles.container}>
          <FadeTransition isVisible={true} style={{ flex: 1 }}>
            <View style={styles.centerContent}>
              <StepIcon icon={Rocket} />
              <Text style={styles.mainTitle}>Your journey starts here</Text>
              <Text style={styles.subtitle}>
                Share your goals and vision so we can build the perfect plan for you.
              </Text>
              <PrimaryButton
                onPress={handleGetStarted}
                size={ButtonSize.LARGE}
                title="Start now"
                style={styles.buttonStyle}
              />
            </View>
          </FadeTransition>
        </View>
      </Background>
    );
  }

  return (
    <FormProvider {...methods}>
      <View
        style={{
          backgroundColor: theme.colors.primary,
          flex: 1,
        }}>
        {bodyWidget}
      </View>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blobGradient: {
    flex: 1,
    borderRadius: 999,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    flex: 1,
    zIndex: 1,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 10,
    width: '90%',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: 10,
    opacity: 0.9,
    width: '100%',
  },
  buttonStyle: {
    width: '100%',
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 16,
  },
  signInLink: {
    fontSize: 16,
    color: theme.colors.accent,
  },
  headerContainer: {
    width: '100%',
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    width: 120,
  },
});
