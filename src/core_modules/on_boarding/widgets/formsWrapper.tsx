import { StyleSheet, Text, View } from 'react-native';
import { FadeTransition } from '~/codidge_components/UI/transitions/fadeIn';
import { StepIcon } from './stepIcon';
import { Slider } from '~/codidge_components/UI/slider';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { theme } from '~/theme/theme';

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
  showTransition?: boolean;
  props: any;
}

export const FormWrapper = ({
  header,
  footer,
  children,
  currentStep,
  showTransition = true,
}: FormWrapperProps) => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <FadeTransition isVisible={true} style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <StepIcon icon={header.icon} />
          <Text style={styles.mainTitle}>{currentStep + 1}</Text>
          <Text style={styles.subtitle}>{header.subtitle}</Text>
        </View>
      </FadeTransition>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Form Content */}
        <View style={styles.contentContainer}>
          <FadeTransition isVisible={showTransition} style={{ flex: 1 }}>
            {children}
          </FadeTransition>
        </View>

        {/* Footer Section */}
        <View style={styles.footerContainer}>
          {footer.showSlider && (
            <FadeTransition isVisible={true}>
              <View style={styles.sliderContainer}>
                <Slider progressPercentage={footer.progressPercentage || 0} />
              </View>
            </FadeTransition>
          )}

          {footer.customFooter ? (
            <FadeTransition isVisible={true}>{footer.customFooter}</FadeTransition>
          ) : (
            <FadeTransition isVisible={true}>
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
                      onPress={footer.onNext}
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
                    onPress={footer.onNext}
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
            </FadeTransition>
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

  // Header Styles
  headerContainer: {
    paddingTop: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
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
    fontSize: 16,
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
    marginTop: 32,
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
