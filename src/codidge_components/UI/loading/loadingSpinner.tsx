import React from 'react';
import { ActivityIndicator } from 'react-native';

import { theme } from '~/theme/theme';

/**
 * The default used to be '#fff', inherited from the customer app's dark theme.
 * On this app's near-white surface that renders an invisible spinner — every
 * screen that loaded looked like it was showing nothing at all. The default is
 * now a colour that reads on light; callers over a dark or gold fill pass their
 * own.
 */
export const LoadingSpinner = ({ color }: { color?: string }) => {
  return <ActivityIndicator color={color ?? theme.colors.primaryTextAccent} />;
};
