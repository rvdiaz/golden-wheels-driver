import React, { ReactNode, useEffect, useRef } from 'react';
import { ITask } from '../interfaces';
import { Badge } from '~/codidge_components/UI/badge';
import { getTaskColorByType, getTaskIconByType, getTaskStatus } from '../helpers';
import { Animated, Easing, View } from 'react-native';
import Text from '~/codidge_components/UI/text';

export const RotatingIcon = ({
  children,
  isRotating = false,
}: {
  children: ReactNode;
  isRotating: boolean;
}) => {
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRotating) {
      // Start rotation
      const animation = Animated.loop(
        Animated.timing(rotateAnimation, {
          toValue: 1,
          duration: 2000, // 2 seconds per rotation
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();

      return () => {
        animation.stop();
        rotateAnimation.setValue(0);
      };
    }
  }, [isRotating, rotateAnimation]);

  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        transform: [{ rotate: rotation }],
      }}>
      {children}
    </Animated.View>
  );
};

export const StatusBadge = ({ task }: { task: ITask }) => {
  const taskStatus = getTaskStatus(task);
  const taskItemColor = getTaskColorByType(taskStatus.key);
  const taskIcon = getTaskIconByType(taskStatus.key);

  return (
    <Badge
      displayIcon={false}
      type="normal"
      style={{
        backgroundColor: taskItemColor,
        borderColor: taskItemColor,
        minWidth: 90,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
        }}>
        <RotatingIcon isRotating={taskStatus.key === 'inProgress'}>{taskIcon}</RotatingIcon>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#FFF',
          }}>
          {taskStatus.label}
        </Text>
      </View>
    </Badge>
  );
};
