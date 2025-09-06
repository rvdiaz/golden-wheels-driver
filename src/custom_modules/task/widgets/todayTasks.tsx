import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getActiveTasks } from '../helpers';
import { TaskList } from './taskList';
import * as Icons from 'lucide-react-native';
import { useTasksByUser } from '../hooks/listTask';
import moment from 'moment';

const today = moment().format('YYYY-MM-DD');

// Completion Widget Component
const TasksCompletionWidget = ({ onViewCompleted }: { onViewCompleted?: () => void }) => {
  return (
    <View style={styles.completionWidget}>
      <View style={styles.completionContent}>
        <View style={styles.completionIcon}>
          <Icons.CheckCircle2 size={40} color="#10B981" />
        </View>
        <View style={styles.completionText}>
          <Text style={styles.completionTitle}>All Tasks Complete! 🎉</Text>
          <Text style={styles.completionSubtitle}>
            Great job! You've finished all your tasks for today.
          </Text>
        </View>
      </View>
      {onViewCompleted && (
        <TouchableOpacity style={styles.viewCompletedButton} onPress={onViewCompleted}>
          <Text style={styles.viewCompletedText}>View Completed Tasks</Text>
          <Icons.ArrowRight size={16} color="#10B981" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export const TodayTasks = () => {
  const { tasks: taskList, isLoading } = useTasksByUser(today);

  const allTasks = taskList ?? [];

  // Filter tasks that haven't ended yet (future tasks)
  const activeTasks = getActiveTasks(allTasks);

  // Check if ALL tasks are actually completed (marked as isCompleted: true)
  const allTasksCompleted = allTasks.length > 0 && allTasks.every((task) => task.isCompleted);

  // Show completion widget ONLY when all tasks are actually completed
  if (allTasksCompleted && !isLoading) {
    return (
      <View style={{ marginTop: 16 }}>
        <TasksCompletionWidget
          onViewCompleted={() => {
            // Handle viewing completed tasks
            console.log('View completed tasks');
          }}
        />
      </View>
    );
  }

  // Show loading or empty state when no active tasks, but always show TaskList for loading
  if (activeTasks.length === 0 && !isLoading) {
    return null;
  }

  // Show TaskList with loading state or actual data
  return (
    <View style={{ marginTop: 16 }}>
      <TaskList displayList={activeTasks} tasks={allTasks} isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  completionWidget: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#BBF7D0',
  },
  completionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  completionIcon: {
    marginRight: 16,
  },
  completionText: {
    flex: 1,
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  completionSubtitle: {
    fontSize: 14,
    color: '#15803D',
    lineHeight: 20,
  },
  viewCompletedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  viewCompletedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginRight: 8,
  },
  minimalWidget: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  minimalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D97706',
    marginTop: 8,
    marginBottom: 4,
  },
  minimalSubtitle: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
  },
});
