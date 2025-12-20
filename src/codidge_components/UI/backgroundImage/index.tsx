import React from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';

interface BackgroundComp {
  children: React.ReactNode;
  style?: ViewStyle;
}

// Background Component
const Background = ({ children, style }: BackgroundComp) => {
  return (
    <ImageBackground style={[styles.background, style]} resizeMode="cover">
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default Background;
