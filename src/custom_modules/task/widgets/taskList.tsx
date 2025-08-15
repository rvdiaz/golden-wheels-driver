import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import { ITask } from '../interfaces';
import { TaskItem } from './taskItem';

export const TaskList = ({
  tasks,
  onToggle,
}: {
  tasks: ITask[];
  onToggle: (taskId: string) => void;
}) => {
  return (
    <Card style={styles.tasksCard}>
      <View style={styles.tasksHeader}>
        <Text style={styles.tasksTitle}>Today's Tasks</Text>
        <Text style={styles.tasksDate}>Wednesday, August 7</Text>
      </View>

      <View style={styles.tasksList}>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={onToggle} />
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  tasksCard: {
    flex: 2,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  tasksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  tasksDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  tasksList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
