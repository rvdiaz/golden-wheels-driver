import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { theme } from '~/theme/theme';
import { TermsAndPrivacy } from './termsAndPrivacy';
import { Rocket } from 'lucide-react-native';
import { StepIcon } from './stepIcon';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';

interface StartScreenProps {
  onNext: () => void;
  onSave?: ({ started, timestamp }: { started: boolean; timestamp: string }) => void;
}

export const StartPointScreen = ({ onNext, onSave }: StartScreenProps) => {
  const handleGetStarted = () => {
    // Save any initial data if needed
    if (onSave) {
      onSave({ started: true, timestamp: new Date().toISOString() });
    }
    if (onNext) {
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Icon */}
      <StepIcon icon={Rocket} />
      {/* Main Title */}
      <Text style={styles.mainTitle}>Your journey starts here</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Share your goals and vision so we can build the perfect plan for you.
      </Text>

      {/* Illustration/Picture */}
      <View>
        <Image
          style={styles.image}
          source={require('assets/on-boarding-starting-point.png')}
          resizeMode="contain"
        />
      </View>

      <PrimaryButton
        onPress={handleGetStarted}
        size={ButtonSize.LARGE}
        title="Start now"
        style={styles.buttonStyle}
      />

      <TermsAndPrivacy />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.headerBackground,
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Text Styles
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  buttonStyle: {
    width: '100%',
  },
  image: {
    width: 250,
  },
});
