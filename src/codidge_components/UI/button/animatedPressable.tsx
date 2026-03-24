// AnimatedPressable.tsx
import React, { useRef } from 'react';
import { TouchableOpacity, Animated, StyleProp, ViewStyle } from 'react-native';

interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  scaleValue?: number;
  animated?: boolean;
}

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  onPress,
  style,
  scaleValue = 0.96,
  animated = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!animated) return;
    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (!animated) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  if (!animated) {
    return (
      <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
        activeOpacity={1}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};
