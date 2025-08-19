import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';

interface LabelProps {
  label: string;
  style?: StyleProp<TextStyle>;
}

export const Label = ({ label, style }: LabelProps) => {
  return <Text style={[styles.label, style]}>{label}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
});
