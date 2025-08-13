import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ITask } from '../interfaces';
import * as Icons from 'lucide-react-native';
import { Badge } from '~/components/Badge';

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Marketing':
      return '#2563EB';
    case 'Lead Generation':
      return '#DC2626';
    case 'Relationship Building':
      return '#059669';
    default:
      return '#6B7280';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return { backgroundColor: '#FEE2E2', color: '#991B1B', borderColor: '#FECACA' };
    case 'Medium':
      return { backgroundColor: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A' };
    case 'Low':
      return { backgroundColor: '#D1FAE5', color: '#065F46', borderColor: '#A7F3D0' };
    default:
      return { backgroundColor: '#F3F4F6', color: '#374151', borderColor: '#E5E7EB' };
  }
};

export const TaskItem = ({
  task,
  onToggle,
}: {
  task: ITask;
  onToggle: (taskId: string) => void;
}) => {
  return (
    <TouchableOpacity
      key={task.id}
      style={[styles.taskItem, task.completed && styles.taskCompleted]}
      onPress={() => onToggle(task.id)}>
      <View style={styles.taskCheckbox}>
        {task.completed ? (
          <Icons.CheckCircle2 size={20} color="#059669" />
        ) : (
          <View style={styles.taskCheckboxEmpty} />
        )}
      </View>

      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
            {task.title}
          </Text>
          <Text style={styles.taskTime}>{task.dateTime}</Text>
        </View>
        <Text style={[styles.taskDescription, task.completed && styles.taskDescriptionCompleted]}>
          {task.description}
        </Text>
        <View style={styles.taskMeta}>
          <View style={[styles.taskBadge, { borderColor: getCategoryColor(task.category) }]}>
            <Text style={[styles.taskBadgeText, { color: getCategoryColor(task.category) }]}>
              {task.category}
            </Text>
          </View>
          <Badge
            style={[
              styles.priorityBadge,
              {
                backgroundColor: getPriorityColor(task.priority).backgroundColor,
                borderColor: getPriorityColor(task.priority).borderColor,
              },
            ]}
            textStyle={{ color: getPriorityColor(task.priority).color }}>
            {task.priority}
          </Badge>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tasksCard: {
    flex: 2,
    borderWidth: 2,
    borderColor: '#F3F4F6',
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
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  taskCompleted: {
    opacity: 0.7,
    backgroundColor: '#F9FAFB',
  },
  taskCheckbox: {
    marginRight: 12,
    marginTop: 2,
  },
  taskCheckboxEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
  },
  taskTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  taskDescriptionCompleted: {
    textDecorationLine: 'line-through',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  taskBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  taskProgress: {
    fontSize: 10,
    color: '#6B7280',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
