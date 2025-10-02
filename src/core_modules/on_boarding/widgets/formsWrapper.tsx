import { StyleSheet, Text, View } from 'react-native';
import { FadeTransition } from '~/codidge_components/UI/transitions/fadeIn';
import { StepIcon } from './stepIcon';
import { Slider } from '~/codidge_components/UI/slider';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { theme } from '~/theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

export interface HeaderConfig {
  icon: any; // Lucide icon component
  title: string;
  subtitle: string;
}

// Footer configuration type
export interface FooterConfig {
  showBack?: boolean;
  backTitle?: string;
  showNext?: boolean;
  nextTitle?: string;
  showSlider?: boolean;
  progressPercentage?: number;
  onBack?: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  nextDisabled?: boolean;
  customFooter?: React.ReactNode;
}

// Main FormWrapper props
export interface FormWrapperProps {
  header: HeaderConfig;
  footer: FooterConfig;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  showTransition?: boolean;
  props: any;
}

// New StepProgress component to show the progress line
const StepProgress = ({
  currentStep,
  totalSteps,
  icon,
}: {
  currentStep: number;
  totalSteps: number;
  icon: any;
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <View style={styles.stepProgressContainer}>
      {/* Left line - hidden on first step */}
      <View style={[styles.progressLineLeft, isFirstStep && styles.hiddenLine]} />

      {/* Icon container - always centered */}
      <View style={styles.iconContainer}>
        <StepIcon icon={icon} />
      </View>

      {/* Right line - hidden on last step */}
      <View style={[styles.progressLineRight, isLastStep && styles.hiddenLine]} />
    </View>
  );
};

export const FormWrapper = ({
  header,
  footer,
  children,
  currentStep,
  totalSteps,
}: FormWrapperProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.gradientContainer}>
        {/* Base gradient */}
        <LinearGradient
          colors={['#1D0D66', '#2D1B8F', '#1D0D66']}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <StepProgress currentStep={currentStep} totalSteps={totalSteps} icon={header.icon} />
          <Text style={styles.mainTitle}>
            Step {currentStep + 1} of {totalSteps}
          </Text>
          <Text style={styles.subtitle}>{header.subtitle}</Text>
        </View>
      </View>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Form Content */}
        <View style={styles.contentContainer}>
          <FadeTransition isVisible={true} style={{ flex: 1 }}>
            {children}
          </FadeTransition>
        </View>

        {/* Footer Section */}
        <View style={styles.footerContainer}>
          {footer.showSlider && (
            <View>
              <View style={styles.sliderContainer}>
                <Slider progressPercentage={footer.progressPercentage || 0} />
              </View>
            </View>
          )}

          {footer.customFooter ? (
            <View>{footer.customFooter}</View>
          ) : (
            <View>
              <View style={styles.footer}>
                {footer.showBack && footer.showNext ? (
                  // Both buttons
                  <View style={styles.buttonRow}>
                    <OutlineButton
                      size={ButtonSize.LARGE}
                      title={footer.backTitle || 'Back'}
                      leftWidget={<ArrowLeft size={16} color={theme.colors.primary} />}
                      style={styles.backButton}
                      onPress={footer.onBack}
                    />
                    <PrimaryButton
                      size={ButtonSize.LARGE}
                      title={footer.nextTitle || 'Continue'}
                      rightWidget={<ArrowRight size={16} color="#FFF" />}
                      style={styles.nextButton}
                      onPress={footer.onComplete ?? footer.onNext}
                      disabled={footer.nextDisabled}
                    />
                  </View>
                ) : footer.showNext ? (
                  // Only next button
                  <PrimaryButton
                    size={ButtonSize.LARGE}
                    title={footer.nextTitle || 'Continue'}
                    rightWidget={<ArrowRight size={16} color="#FFF" />}
                    style={styles.fullWidthButton}
                    onPress={footer.onComplete ?? footer.onNext}
                    disabled={footer.nextDisabled}
                  />
                ) : footer.showBack ? (
                  // Only back button
                  <OutlineButton
                    size={ButtonSize.LARGE}
                    title={footer.backTitle || 'Back'}
                    leftWidget={<ArrowLeft size={16} color={theme.colors.primary} />}
                    style={styles.fullWidthButton}
                    onPress={footer.onBack}
                  />
                ) : null}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.headerBackground,
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  // Header Styles
  headerContainer: {
    paddingTop: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  // Step Progress Styles
  stepProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 60,
    position: 'relative',
  },
  progressLineLeft: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.accent,
  },
  progressLineRight: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.accent,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    paddingHorizontal: 0, // Add some padding around the icon
  },
  hiddenLine: {
    opacity: 0, // Hide the line while maintaining layout
  },

  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    paddingHorizontal: 20,
  },

  // Form Styles
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 24,
    borderTopLeftRadius: theme.borderRadius.xxl,
    borderTopRightRadius: theme.borderRadius.xxl,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 24,
  },
  // Footer Styles
  footerContainer: {
    marginTop: 'auto',
  },
  sliderContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  footer: {
    padding: 24,
  },

  // Button Styles
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
  fullWidthButton: {
    width: '100%',
  },
});
