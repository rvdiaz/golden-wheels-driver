import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { IGoalProgress } from '../interfaces';
import { theme } from '~/theme/theme';
import { Slider } from '~/codidge_components/UI/slider';
import Text from '~/codidge_components/UI/text';

export const GoalItem = ({ goal }: { goal: IGoalProgress }) => {
  // Calculate progress percentage
  const progressPercentage = Math.min((goal.value / goal.targetValue) * 100, 100);

  // Format frequency for display
  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      daily: '#10B981',
      weekly: '#3B82F6',
      monthly: '#8B5CF6',
      quarterly: '#F59E0B',
      yearly: '#EF4444',
    };
    return colors[frequency as keyof typeof colors] || theme.colors.primary;
  };

  // Format period for better display
  const formatPeriod = (period: string, frequency: string) => {
    if (!period) return '';

    try {
      // Handle different period formats based on frequency
      switch (frequency) {
        case 'daily': {
          // Format: "2024-03-23"
          const date = new Date(period);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
          }
          break;
        }

        case 'weekly': {
          // Format: "2024-WW-23" (week 23 of 2024)
          const match = period.match(/^(\d{4})-WW-(\d+)$/);
          if (match) {
            const [, year, week] = match;
            return `Week ${parseInt(week)} '${year.slice(-2)}`;
          }
          break;
        }

        case 'monthly': {
          // Format: "2024-03"
          const match = period.match(/^(\d{4})-(\d{2})$/);
          if (match) {
            const [, year, month] = match;
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return date.toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            });
          }
          break;
        }

        case 'quarterly': {
          // Format: "2024-QQ-03" (Q3 of 2024)
          const match = period.match(/^(\d{4})-QQ-(\d+)$/);
          if (match) {
            const [, year, quarter] = match;
            return `Q${quarter} ${year}`;
          }
          break;
        }

        case 'rollingQuarterly': {
          const match = period.match(/^(\d{4})-QQ-(\d+)$/);
          if (match) {
            const [, year, quarter] = match;
            return `Q${quarter} ${year}`;
          }

          // Handle rolling format like "2025-01-01_to_2026-09-30"
          const rangeMatch = period.match(/^(\d{4}-\d{2}-\d{2})_to_(\d{4}-\d{2}-\d{2})$/);
          if (rangeMatch) {
            const [, startStr, endStr] = rangeMatch;
            const start = new Date(startStr);
            const end = new Date(endStr);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
              return `${start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
            }
          }
          break;
        }

        case 'yearly': {
          // Format: "2024"
          if (/^\d{4}$/.test(period)) {
            return period;
          }
          break;
        }

        case 'rollingYearly': {
          if (/^\d{4}$/.test(period)) {
            return period;
          }

          // Handle rolling format like "2025-01-01_to_2026-09-30"
          const rangeMatch = period.match(/^(\d{4}-\d{2}-\d{2})_to_(\d{4}-\d{2}-\d{2})$/);
          if (rangeMatch) {
            const [, startStr, endStr] = rangeMatch;
            const start = new Date(startStr);
            const end = new Date(endStr);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
              return `${start.toLocaleDateString('en-US', { year: 'numeric' })} - ${end.toLocaleDateString('en-US', { year: 'numeric' })}`;
            }
          }
          break;
        }
      }
    } catch (error) {
      console.warn('Error formatting period:', error);
    }

    // Fallback to original period if parsing fails
    return period;
  };

  const frequencyColor = getFrequencyBadge(goal.frequency);

  return (
    <TouchableOpacity style={[styles.goalItem, goal.completed && styles.goalItemCompleted]}>
      <View style={styles.goalContent}>
        <View style={styles.goalHeader}>
          <View style={styles.goalInfo}>
            <Text style={[styles.goalTitle, goal.completed && styles.goalTitleCompleted]}>
              {goal.goalName}
            </Text>
            {goal.goalDescription && (
              <Text
                style={[styles.goalDescription, goal.completed && styles.goalDescriptionCompleted]}>
                {goal.goalDescription}
              </Text>
            )}
          </View>
          {goal.completed && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓</Text>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Slider
            progressPercentage={progressPercentage}
            primaryColor={goal.completed ? '#10B981' : frequencyColor}
          />
        </View>

        <View style={styles.goalMeta}>
          {/* Frequency Badge */}
          <View style={[styles.frequencyBadge, { backgroundColor: `${frequencyColor}20` }]}>
            <Text style={[styles.frequencyText, { color: frequencyColor }]}>{goal.frequency}</Text>
          </View>

          <View style={styles.rightFooter}>
            {/* Progress Text */}
            <Text style={styles.progressText}>
              {goal.value}/{goal.targetValue} {goal.unit}
            </Text>
            {/* Period */}
            <Text style={styles.periodText}>{formatPeriod(goal.period, goal.frequency)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  goalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  goalItemCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  goalContent: {
    flex: 1,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  goalInfo: {
    flex: 1,
    marginRight: 8,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textColor,
    lineHeight: 20,
  },
  goalTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  goalDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 16,
  },
  goalDescriptionCompleted: {
    textDecorationLine: 'line-through',
  },
  completedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 12,
  },
  goalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  frequencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  frequencyText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  rightFooter: {
    alignItems: 'flex-end',
    gap: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textColor,
  },
  periodText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '400',
  },
});
