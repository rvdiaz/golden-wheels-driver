import React from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // or react-native-linear-gradient
import { TermsAndPrivacy } from './termsAndPrivacy';
import { Rocket } from 'lucide-react-native';
import { StepIcon } from './stepIcon';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';

const { height } = Dimensions.get('window');

interface StartScreenProps {
  onNext: () => void;
  onSave?: ({ started, timestamp }: { started: boolean; timestamp: string }) => void;
}

export const StartPointScreen = ({ onNext, onSave }: StartScreenProps) => {
  const handleGetStarted = () => {
    if (onSave) {
      onSave({ started: true, timestamp: new Date().toISOString() });
    }
    if (onNext) {
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated Background with Gradient Blobs */}
      <View style={styles.gradientContainer}>
        {/* Base gradient */}
        <LinearGradient
          colors={['#1D0D66', '#2D1B8F', '#1D0D66']}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {/* Main Content Centered */}
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

      {/* Terms & Conditions at the Bottom */}
      <View style={styles.bottomContent}>
        <TermsAndPrivacy />
      </View>
    </View>
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
    flex: 1,
    zIndex: 1,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 16,
    letterSpacing: -0.5,
    width: '80%',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    marginBottom: 40,
    opacity: 0.9,
  },
  buttonStyle: {
    width: '100%',
  },
  bottomContent: {
    alignItems: 'center',
    zIndex: 1,
  },
});
