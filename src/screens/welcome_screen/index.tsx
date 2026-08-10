import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageBackground, StyleSheet, View, StatusBar } from 'react-native';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import Text from '~/codidge_components/UI/text';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '~/theme/theme';
import { typography } from '~/theme/typography';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { useTranslation } from '~/i18n';
import { FadeTransition } from '~/codidge_components/UI/transitions/fadeIn';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

interface GetStartedScreenProps {
  onGetStarted: () => void;
}

export const GetStartedScreen = ({ onGetStarted }: GetStartedScreenProps) => {
  const { t } = useTranslation();
  const zoom = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(zoom, {
      toValue: 1.12,
      duration: 9000,
      useNativeDriver: true,
    }).start();
  }, [zoom]);

  return (
    <View style={styles.container}>
      {/* Light bar: the top of the frame is dark behind the logo now */}
      <StatusBar barStyle="light-content" />

      {/*
        The background is absolute-positioned so the slow Ken Burns zoom only
        scales the photo and its scrims — the content sits outside as a sibling
        and stays put.
      */}
      <AnimatedImageBackground
        source={require('/assets/get_started.jpg')}
        style={[styles.backgroundImage, { transform: [{ scale: zoom }] }]}
        resizeMode="cover">
        {/*
          The photo is blown out at the top by windscreen glare, so a light logo
          disappears into it. This dark wash gives the logo something to sit on,
          and clears by a third of the way down so the driver and the car
          interior stay visible.
        */}
        <LinearGradient
          colors={['rgba(11,18,32,0.82)', 'rgba(11,18,32,0.35)', 'transparent']}
          locations={[0, 0.16, 0.34]}
          style={styles.topScrim}
          pointerEvents="none"
        />

        {/*
          The lower half fades into the app's own background so the headline and
          button sit on a clean surface and the photo doesn't end in a hard edge.
        */}
        <LinearGradient
          colors={[
            'transparent',
            'rgba(253,248,238,0.75)',
            theme.colors.primaryBodyBackground,
            theme.colors.bodyBackground,
          ]}
          locations={[0.34, 0.58, 0.76, 1]}
          style={styles.bottomScrim}
          pointerEvents="none"
        />
      </AnimatedImageBackground>

      <PageSafeContainer style={styles.safeArea}>
        <View style={styles.logoContainer}>
          <Image
            source={require('/assets/logoSingle1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.bottomContent}>
          <FadeTransition isVisible duration={700} style={styles.textBlock}>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerDot} />
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.headline}>{t('welcome.headline')}</Text>
            <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>
          </FadeTransition>

          <FadeTransition isVisible duration={800}>
            <PrimaryButton
              onPress={onGetStarted}
              title={t('welcome.cta')}
              size={ButtonSize.LARGE}
              style={styles.ctaButton}
            />
          </FadeTransition>
        </View>
      </PageSafeContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bodyBackground,
  },
  /**
   * The source is portrait, so `cover` fills the device edge to edge with no
   * letterboxing. Absolute-fill keeps it behind the content while the zoom
   * transform runs.
   */
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  /**
   * Both scrims are decorative. `pointerEvents` must be set in the STYLE, not as
   * a prop — under the New Architecture the prop is deprecated and the
   * full-screen scrim silently swallowed taps on the Get started button.
   */
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  bottomScrim: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    // Above the scrims, so touches always reach the button.
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
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
  /**
   * The divider, headline and subtitle used to be direct children of
   * bottomContent, whose gap spaced them. Inside the fade wrapper that gap no
   * longer reaches them, so it's restated here.
   */
  textBlock: {
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
    backgroundColor: theme.colors.primaryLight,
    opacity: 0.5,
  },
  dividerDot: {
    width: 5,
    height: 5,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryLight,
  },
  headline: {
    fontSize: 42,
    fontWeight: '700',
    color: theme.colors.primaryText,
    letterSpacing: 0.5,
    lineHeight: 48,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.md,
    color: theme.colors.textColor,
    lineHeight: 24,
    marginBottom: 4,
    textAlign: 'center',
  },
  ctaButton: {
    width: '100%',
    marginTop: 4,
  },
});
