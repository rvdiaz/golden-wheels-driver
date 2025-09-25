import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { theme } from '~/theme/theme';

export const StepIcon = ({ icon: Icon }: { icon: FC<SvgProps> }) => {
  return (
    <View style={styles.iconContainer}>
      <Text style={styles.mainIcon}>
        <Icon color="#FFF" />
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: theme.colors.accent,
    padding: 12,
    borderRadius: theme.borderRadius.lg,
  },
  mainIcon: {
    fontSize: 80,
    textAlign: 'center',
    color: '#fff',
  },
});
