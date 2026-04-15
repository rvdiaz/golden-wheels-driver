import React, { useEffect, useRef, useState } from 'react';
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
  const slideAnim = useRef(new Animated.Value(direction === 'right' ? 1 : -1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
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
      ]).start(() => {
        // Only unmount after animation completes
        setShouldRender(false);
      });
    }
  }, [isVisible, slideAnim, opacityAnim, direction, duration]);

  // Don't render anything if not visible and animation is done
  if (!shouldRender) {
    return null;
  }

  const translateX = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-300, 0, 300], // Increased from 100 to ensure full off-screen
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      pointerEvents={isVisible ? 'auto' : 'none'} // Critical fix: disable touch when hidden
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
    backgroundColor: 'transparent', // Ensure no background blocking
  },
});
