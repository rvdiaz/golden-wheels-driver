import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export const FadeTransition = ({
  children,
  isVisible,
  duration = 450,
  style = {},
}: {
  children: React.ReactNode;
  isVisible: boolean;
  duration?: number;
  style?: any;
}) => {
  // Always start hidden for the initial animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(30)).current;

  // Track if this is the first render
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // If isVisible is true and we haven't animated yet, start the animation
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // If isVisible changes after first animation, animate accordingly
    else if (hasAnimated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: isVisible ? 1 : 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: isVisible ? 0 : 30,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, duration, hasAnimated]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateAnim }],
        },
        style,
      ]}>
      {children}
    </Animated.View>
  );
};
