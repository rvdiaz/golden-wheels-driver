import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const FadeTransition = ({
  children,
  isVisible,
  duration = 300,
  style = {},
}: {
  children: React.ReactNode;
  isVisible: boolean;
  duration?: number;
  style?: any;
}) => {
  const fadeAnim = useRef(new Animated.Value(isVisible ? 1 : 0)).current;
  const translateAnim = useRef(new Animated.Value(isVisible ? 0 : 30)).current;

  useEffect(() => {
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
  }, [isVisible, duration]);

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
