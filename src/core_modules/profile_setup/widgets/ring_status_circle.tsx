import React from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { theme } from '~/theme/theme';

interface ProgressRingProps {
  completedSteps: number;
  totalSteps: number;
  size?: number;
  strokeWidth?: number;
  gradientColors?: [string, string];
  backgroundColor?: string;
  showStatusText?: boolean;
  completeText?: string;
  progressText?: string;
  style?: ViewStyle;
  numberStyle?: TextStyle;
  numberCompleteStyle?: TextStyle;
  statusStyle?: TextStyle;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  completedSteps,
  totalSteps,
  size = 120,
  strokeWidth = 8,
  gradientColors = ['#6366F1', '#3730A3'],
  backgroundColor = '#C7D2FE',
  showStatusText = true,
  completeText = 'Complete',
  progressText = 'Progress',
  style,
  numberStyle,
  numberCompleteStyle,
  statusStyle,
}) => {
  // Calculate progress
  const progress = totalSteps > 0 ? completedSteps / totalSteps : 0;
  const isComplete = completedSteps === totalSteps && totalSteps > 0;

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={[styles.container, style]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          {/* Gradient for completed portion */}
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </LinearGradient>
        </Defs>

        {/* Background circle (uncompleted) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle (completed) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Center Content */}
      <View style={styles.centerContent}>
        <View style={styles.progressNumbers}>
          <Text style={[styles.completedNumber, numberStyle]}>{completedSteps}</Text>
          <Text style={[styles.totalNumber, numberCompleteStyle]}>/{totalSteps}</Text>
        </View>
        {showStatusText && (
          <Text style={[styles.statusText, statusStyle]}>
            {isComplete ? completeText : progressText}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  completedNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  totalNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 4,
  },
});
