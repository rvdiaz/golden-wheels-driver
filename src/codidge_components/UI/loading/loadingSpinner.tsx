import React from 'react';
import { ActivityIndicator } from 'react-native';

export const LoadingSpinner = ({ color }: { color?: string }) => {
  return <ActivityIndicator color={color ?? '#fff'} />;
};
