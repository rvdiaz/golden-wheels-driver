import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { surfaces } from '~/theme/surfaces';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>; // a
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    ...surfaces.card,
  },
});
