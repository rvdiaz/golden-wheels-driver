import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ITask } from '../interfaces';
import * as Icons from 'lucide-react-native';
import { Badge } from '~/codidge_components/UI/badge';
import { formatTaskTime, getCategoryColor, getPriorityColor } from '../helpers';
import { useMutation, useReactiveVar } from '@apollo/client';
import { completeTaskMutation, updateTaskMutation } from '../graphql/mutations';
import { userData } from '~/store/user';
import Constants from 'expo-constants';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const TaskItem = ({ task }: { task: ITask }) => {
  const customer = useReactiveVar(userData);
  const [completeTaskFn] = useMutation<{ completeTask: ITask }>(completeTaskMutation, {
    update: (cache, { data: mutationData }) => {
      if (!mutationData?.completeTask) return;

      const updatedTask = mutationData.completeTask;

      cache.modify({
        fields: {
          getTasksByUser(existingTaskRefs = [], { readField }) {
            return existingTaskRefs.map((taskRef: any) => {
              const id = readField('id', taskRef);
              if (id === updatedTask.id) {
                // Merge the updated task directly into the cached reference
                return { ...taskRef, ...updatedTask };
              }
              return taskRef;
            });
          },
        },
      });
    },
  });

  const handleCompleteTask = async () => {
    try {
      await completeTaskFn({
        variables: {
          task,
          tenant: { tenantId },
          userId: customer?.id,
          completionParam: !task.isCompleted,
        },
        optimisticResponse: {
          completeTask: {
            ...task,
            isCompleted: !task.isCompleted,
          },
        },
      });
    } catch (error) {
      console.error(':error', error);
    }
  };

  return (
    <TouchableOpacity
      key={task.id}
      style={[styles.taskItem, task.isCompleted && styles.taskCompleted]}
      onPress={handleCompleteTask}>
      <View style={styles.taskCheckbox}>
        {task.isCompleted ? (
          <Icons.CheckCircle2 size={20} color="#059669" />
        ) : (
          <View style={styles.taskCheckboxEmpty} />
        )}
      </View>

      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, task.isCompleted && styles.taskTitleCompleted]}>
            {task.title}
          </Text>

          <View style={styles.taskHeader}>
            <Text style={styles.taskTime}>
              {formatTaskTime(task.startTime.toString())} -{' '}
              {formatTaskTime(task.endTime.toString())}
            </Text>
          </View>
        </View>

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
            displayIcon={false}
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
    paddingHorizontal: 4,
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
