import React from 'react';
import { Image, ImageBackground, StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import TextButton from '~/codidge_components/UI/button/TextButton';
import Text from '~/codidge_components/UI/text';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '~/theme/theme';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

interface GetStartedScreenProps {
  onGetStarted: () => void;
}

export const GetStartedScreen = ({ onGetStarted }: GetStartedScreenProps) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Full-screen background image */}
      <ImageBackground
        source={require('/assets/get_started.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={styles.backgroundImageStyle}>
        {/* Top-to-mid overlay for logo readability */}
        <LinearGradient
          colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.0)', 'rgba(0,0,0,0.85)', 'rgba(0,0,0,0.97)']}
          locations={[0, 0.45, 0.65, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* ← NEW: bottom edge fade so image blends into #0a0a0a background */}
        <LinearGradient
          colors={['transparent', '#0a0a0a']}
          locations={[0.55, 0]} // starts fading at 55% of the image height
          style={styles.bottomEdgeFade}
        />

        <PageSafeContainer style={styles.safeArea}>
          {/* Top: Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('/assets/logo_welcome.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Bottom: Content overlay */}
          <View style={styles.bottomContent}>
            {/* Gold divider line */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerDot} />
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.headline}>Welcome to{'\n'}Golden Wheels</Text>

            <Text style={styles.subtitle}>
              Private chauffeur services across South Florida.{'\n'}
              Premium Vehicles & Exceptional Experience.
            </Text>

            <PrimaryButton
              onPress={onGetStarted}
              title="Get Started"
              size={ButtonSize.LARGE}
              style={styles.ctaButton}
            />

            <View style={styles.signInRow}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TextButton
                title="Sign In"
                style={{
                  paddingLeft: 5,
                }}
                textStyle={styles.signInButtonText}
              />
            </View>
          </View>
        </PageSafeContainer>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundImageStyle: {
    resizeMode: 'cover',
    width: '100%',
    height: '70%', // ← image only occupies top 70% of screen height
    top: 50,
  },
  bottomEdgeFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '75%', // matches backgroundImageStyle height (70%) + a bit extra
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 210,
    height: 100,
  },
  bottomContent: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    gap: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.primary,
    opacity: 0.5,
  },
  dividerDot: {
    width: 5,
    height: 5,
    borderRadius: 99,
    backgroundColor: theme.colors.primary,
  },
  headline: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    lineHeight: 44,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 22,
    marginBottom: 4,
    textAlign: 'center',
  },
  ctaButton: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    marginTop: 4,
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  signInText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
