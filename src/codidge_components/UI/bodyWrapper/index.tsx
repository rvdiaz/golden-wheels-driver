import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '~/theme/theme';

/**
 * The app's surface.
 *
 * This wraps the tab container in ~/navigation, so every tab and every sub-page
 * inherits the one gradient: a warm gold wash at the top that resolves into the
 * flat body background about a third of the way down. Content sits on the
 * near-white end, so card and text contrast are unaffected and no screen needs
 * a background of its own.
 */
export const BodyWrapper = ({
  children,
  gradientCoverage = 1,
}: {
  children: React.ReactNode;
  /** Scales how far the wash reaches. 1 = default, 0 = effectively flat. */
  gradientCoverage?: number;
  // Legacy props from the customer app, accepted but ignored.
  backgroundImageSource?: { uri: string };
  imageHeight?: number;
}) => {
  // Stops must stay strictly ascending — a coverage of 0 would otherwise
  // collapse them all to 0 and make the native gradient complain.
  const coverage = Math.min(2, Math.max(0.01, gradientCoverage));

  return (
    <LinearGradient
      colors={[theme.colors.gradientTop, theme.colors.gradientMid, theme.colors.bodyBackground]}
      locations={[0, 0.18 * coverage, 0.38 * coverage]}
      style={styles.root}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bodyBackground,
  },
});
