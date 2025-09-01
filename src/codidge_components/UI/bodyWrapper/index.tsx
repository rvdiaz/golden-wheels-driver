import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '~/theme/theme';

export const BodyWrapper = ({
  children,
  widgetBackgroundColor = '#f8f9fa',
  borderRadius = 20,
  widgetHeight = 80,
}: {
  children: React.ReactNode;
  widgetBackgroundColor?: string;
  borderRadius?: number;
  widgetHeight?: number;
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'red',
        zIndex: 1000,
      }}>
      <View
        style={[
          styles.widgetContainer,
          {
            backgroundColor: widgetBackgroundColor,
            borderTopLeftRadius: theme.borderRadius.xl,
            borderTopRightRadius: borderRadius,
            height: widgetHeight,
            marginTop: -(widgetHeight / 2), // This creates the overlap effect
          },
        ]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    flex: 1,
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
});
