import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PageSafeContainerProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export const PageSafeContainer: React.FC<PageSafeContainerProps> = ({ children, style }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.base,
        { paddingTop: Math.max(insets.top, 0), paddingBottom: Math.max(insets.bottom, 0) },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#FFF',
    flex: 1, // make it fill the screen
  },
});
