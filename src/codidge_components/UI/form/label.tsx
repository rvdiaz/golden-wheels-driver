import React from 'react';
import { StyleSheet, Text } from 'react-native';

export const Label = ({ label }: { label: string }) => {
  return <Text style={styles.label}>{label}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
});
