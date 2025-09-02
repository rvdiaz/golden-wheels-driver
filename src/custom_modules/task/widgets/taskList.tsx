import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ITask } from '../interfaces';
import { TaskItem } from './taskItem';
import { theme } from '~/theme/theme';
import { Slider } from '~/codidge_components/UI/slider';

export const TaskList = ({ tasks }: { tasks: ITask[] }) => {
  const completedTasks = tasks.filter((task) => task.isCompleted);
  const totalTasks = tasks.length;
  const completedCount = completedTasks.length;
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <View style={styles.tasksCard}>
      <View style={styles.tasksHeader}>
        <Text style={styles.tasksTitle}>Today's Tasks</Text>
        <Text style={styles.tasksDate}>
          {completedCount}/{totalTasks} Complete
        </Text>
      </View>
      <Slider progressPercentage={progressPercentage} primaryColor={theme.colors.primary} />
      <View>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tasksCard: {
    flex: 2,
    backgroundColor: '#F8FAFC',
    borderRadius: theme.borderRadius.lg,
    padding: 12,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  tasksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A0A0A',
  },
  tasksDate: {
    fontSize: 12,
    color: '#0A0A0A',
    fontWeight: '400',
  },
});
