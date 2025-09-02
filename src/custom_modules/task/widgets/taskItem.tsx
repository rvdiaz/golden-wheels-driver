import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ITask } from '../interfaces';
import { formatTaskTime } from '../helpers';
import { useMutation, useReactiveVar } from '@apollo/client';
import { completeTaskMutation } from '../graphql/mutations';
import { userData } from '~/store/user';
import Constants from 'expo-constants';
import { theme } from '~/theme/theme';
import { SimpleCheckbox } from '~/codidge_components/UI/form/checkbox';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const TaskItem = ({ task }: { task: ITask }) => {
  const [value, setvalue] = useState(task.isCompleted ?? false);

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

  const handleCompleteTask = async (toggleValue: boolean) => {
    try {
      setvalue(toggleValue);
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
    <View key={task.id} style={styles.taskItem}>
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDescription}>Descriptions here</Text>
            </View>
          </View>

          <SimpleCheckbox checked={value} onToggle={handleCompleteTask} />
        </View>

        <View style={styles.taskMeta}>
          <View style={[styles.taskCategoryBadge]}>
            <Text style={[styles.taskBadgeText]}>{task.category}</Text>
          </View>
          <View style={styles.rightFooter}>
            <Image source={require('../../../assets/highPriority.png')} />
            <Text style={styles.taskTime}>
              {formatTaskTime(task.startTime.toString())} -{' '}
              {formatTaskTime(task.endTime.toString())}
            </Text>
          </View>
        </View>
      </View>
    </View>
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
    marginBottom: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  rightFooter: { alignItems: 'flex-end', marginBottom: 4, gap: 2 },
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
    fontWeight: '500',
    color: theme.colors.textColor,
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
    color: '#737373',
    marginTop: 4,
  },
  taskDescriptionCompleted: {
    textDecorationLine: 'line-through',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 21,
  },
  taskCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#ededed',
  },
  taskBadgeText: {
    fontSize: 11,
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
