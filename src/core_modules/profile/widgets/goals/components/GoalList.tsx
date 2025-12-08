import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IGoalProgress } from '../interfaces';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';

interface GoalItemProps {
  goal: IGoalProgress;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal }) => {
  const progressPercentage = Math.min((goal.value / goal.targetValue) * 100, 100);

  return (
    <View style={styles.goalItem}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalName}>{goal.goalName}</Text>
        <Text style={styles.goalValue}>
          {goal.value} / {goal.targetValue}
        </Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
      </View>
    </View>
  );
};

interface GroupedGoalsProps {
  goals: IGoalProgress[];
  isLoading: boolean;
}

export const GroupedGoalsList: React.FC<GroupedGoalsProps> = ({ goals, isLoading }) => {
  if (isLoading) {
    return <PageLoading />;
  }

  if (!goals || goals.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Active Goals</Text>
        <Text style={styles.emptyText}>Start tracking your progress!</Text>
      </View>
    );
  }

  // Group goals by their group property
  const groupedGoals = goals.reduce(
    (acc, goal) => {
      const groupName = goal.group || 'Other';
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(goal);
      return acc;
    },
    {} as Record<string, IGoalProgress[]>
  );

  return (
    <View style={styles.container}>
      {Object.entries(groupedGoals).map(([groupName, groupGoals]) => (
        <View key={groupName} style={styles.groupCard}>
          <Text style={styles.groupTitle}>{groupName}</Text>

          <View style={styles.goalsContainer}>
            {groupGoals.map((goal, index) => (
              <View key={goal.progressId}>
                <GoalItem goal={goal} />
                {index < groupGoals.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  goalsContainer: {
    gap: 0,
  },
  goalItem: {
    paddingVertical: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
    marginRight: 12,
  },
  goalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
});
