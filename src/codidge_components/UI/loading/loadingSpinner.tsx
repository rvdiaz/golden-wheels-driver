import React from 'react';
import { ActivityIndicator } from 'react-native';

export const LoadingSpinner = ({ color = '#fff' }: { color?: string }) => {
  return <ActivityIndicator color={color} />;
};
