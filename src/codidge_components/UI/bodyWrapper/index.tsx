import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '~/theme/theme';

export const BodyWrapper = ({
  children,
}: {
  children: React.ReactNode;
  // Legacy props accepted but ignored — driver app is always light
  gradientCoverage?: number;
  backgroundImageSource?: { uri: string };
  imageHeight?: number;
}) => {
  return <View style={styles.root}>{children}</View>;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bodyBackground,
  },
});
