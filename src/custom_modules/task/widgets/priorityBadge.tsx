import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '~/theme/theme';
import Text from '~/codidge_components/UI/text';

// Enum for priorities
export type TaskPriority = 'high' | 'medium' | 'low';

interface PriorityBadgeProps {
  priority: TaskPriority;
  style?: ViewStyle;
  textStyle?: TextStyle;
  displayIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, style, textStyle }) => {
  // Define colors and icons by priority
  const priorityStyles = {
    high: {
      bg: 'rgba(220, 38, 38, 0.15)', // red-600, 15% opacity
      border: '#DC2626',
      text: '#991B1B',
      label: 'High',
    },
    medium: {
      bg: 'rgba(245, 158, 11, 0.15)', // amber-500, 15% opacity
      border: '#F59E0B',
      text: '#B45309',
      label: 'Medium',
    },
    low: {
      bg: 'rgba(34, 197, 94, 0.15)', // green-500, 15% opacity
      border: '#22C55E',
      text: '#166534',
      label: 'Low',
    },
  };

  const { bg, border, text, label } = priorityStyles[priority];

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: border }, style]}>
      <View style={styles.content}>
        <Text style={[styles.badgeText, { color: text }, textStyle]}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
