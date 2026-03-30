import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface PageTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  style?: ViewStyle;
  direction?: 'left' | 'right';
  duration?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  isVisible,
  style,
  direction = 'right',
  duration = 200,
}) => {
  const slideAnim = useRef<any>(new Animated.Value(direction === 'right' ? 1 : -1)).current;
  const opacityAnim = useRef<any>(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Slide in animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: duration * 0.6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: direction === 'right' ? 1 : -1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: duration * 0.6,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, slideAnim, opacityAnim, direction, duration]);

  if (!isVisible && opacityAnim._value === 0) {
    return null;
  }

  const translateX = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-100, 0, 100],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [{ translateX: translateX }],
          opacity: opacityAnim,
        },
      ]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
