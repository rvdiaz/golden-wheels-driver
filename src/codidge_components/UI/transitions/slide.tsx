import { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Slide transition for step changes
export const SlideTransition = ({
  children,
  currentStep,
  totalSteps,
  duration = 300,
}: {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  duration?: number;
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: -currentStep * screenWidth,
      duration,
      useNativeDriver: true,
    }).start();
  }, [currentStep, duration]);

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        width: screenWidth * totalSteps,
        transform: [{ translateX: slideAnim }],
      }}>
      {children}
    </Animated.View>
  );
};
