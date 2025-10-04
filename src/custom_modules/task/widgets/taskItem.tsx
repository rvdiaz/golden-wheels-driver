import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { GoalType, ITask } from '../interfaces';
import {
  formatTaskTime,
  getDurationInMinutes,
  getTaskColorByPriority,
  getTaskColorByType,
  getTaskConfigByKey,
  getTaskStatus,
  isActiveTask,
} from '../helpers';
import { useMutation, useReactiveVar } from '@apollo/client';
import { completeTaskMutation } from '../graphql/mutations';
import { userData } from '~/store/user';
import Constants from 'expo-constants';
import { theme } from '~/theme/theme';
import { SimpleCheckbox } from '~/codidge_components/UI/form/checkbox';
import { Badge } from '~/codidge_components/UI/badge';
import { TaskFieldsModal } from '~/codidge_components/UI/customField/modalForm';
import Text from '~/codidge_components/UI/text';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const TaskItem = ({ task }: { task: ITask }) => {
  const isActive = isActiveTask(task);

  const [value, setvalue] = useState(task.isCompleted ?? false);
  const [showModal, setShowModal] = useState(false);

  const user = useReactiveVar(userData);
  const userTaskSchema = user?.systemData?.tasksConfiguration;
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
                return { ...taskRef, ...updatedTask };
              }
              return taskRef;
            });
          },
        },
      });
    },
  });

  const taskConfiguration = getTaskConfigByKey(task, userTaskSchema ?? []);

  const executeTaskCompletion = async (goalTypes: GoalType[], completionParam = true) => {
    try {
      setvalue(completionParam);
      await completeTaskFn({
        variables: {
          task: { ...task, progress: goalTypes },
          tenant: { tenantId },
          userId: user?.id,
          completionParam: completionParam,
          goalTypes, // Add the goalTypes to the mutation variables
        },
        optimisticResponse: {
          completeTask: {
            ...task,
            isCompleted: completionParam,
          },
        },
      });
    } catch (error) {
      console.error(':error', error);
      setvalue(false); // Revert on error
    }
  };

  const handleCompleteTask = async (toggleValue: boolean) => {
    if (!toggleValue) {
      // If unchecking, you might want to handle this differently
      // setvalue(false);
      return;
    }

    try {
      if (taskConfiguration) {
        const goalTypes: GoalType[] = [];

        // Check if task has additional fields
        if (taskConfiguration.fields && taskConfiguration.fields.length > 0) {
          // Show modal to collect field data
          setShowModal(true);
          return; // Don't complete the task yet, wait for modal submission
        } else {
          // Handle duration goal type
          if (taskConfiguration.goalType === 'duration') {
            const duration = getDurationInMinutes(task.startTime as string, task.endTime as string);
            goalTypes.push({
              goalKey: taskConfiguration.goalKey!,
              goalType: taskConfiguration.goalType,
              value: duration,
            });
          }

          // Handle duration goal type
          if (taskConfiguration.goalType === 'amount') {
            goalTypes.push({
              goalKey: taskConfiguration.goalKey!,
              goalType: taskConfiguration.goalType,
              value: 1,
            });
          }
          // No additional fields, complete the task with duration only
          await executeTaskCompletion(goalTypes);
        }
      } else {
        // No task configuration, complete without goal types
        await executeTaskCompletion([]);
      }
    } catch (error) {
      console.error(':error', error);
    }
  };

  const handleModalSubmit = async (fieldGoalTypes: GoalType[]) => {
    try {
      const goalTypes: GoalType[] = [...fieldGoalTypes];

      if (taskConfiguration) {
        // Handle duration goal type
        if (taskConfiguration.goalType === 'duration') {
          const duration = getDurationInMinutes(task.startTime as string, task.endTime as string);
          goalTypes.push({
            goalKey: taskConfiguration.goalKey!,
            goalType: taskConfiguration.goalType,
            value: duration,
          });
        }

        // Handle duration goal type
        if (taskConfiguration.goalType === 'amount') {
          goalTypes.push({
            goalKey: taskConfiguration.goalKey!,
            goalType: taskConfiguration.goalType,
            value: 1,
          });
        }
      }
      await executeTaskCompletion(goalTypes);
    } catch (error) {
      console.error(':error', error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Reset checkbox since task wasn't completed
    setvalue(task.isCompleted ?? false);
  };

  const taskStatus = getTaskStatus(task);
  const borderColor = getTaskColorByType(taskStatus);

  return (
    <>
      <View
        key={task.id}
        style={[
          styles.taskItem,
          { backgroundColor: 'white', borderBottomWidth: 4, borderBottomColor: borderColor },
        ]}>
        <View style={styles.taskContent}>
          <View style={styles.taskHeader}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDescription} numberOfLines={3}>
                  {task.description ?? ''}
                </Text>
              </View>
            </View>

            {isActive && (
              <SimpleCheckbox
                color={theme.colors.success}
                checked={value}
                onToggle={handleCompleteTask}
              />
            )}
          </View>

          <View style={styles.taskMeta}>
            <View style={styles.leftFooter}>
              <Badge
                displayIcon={false}
                type="normal"
                textStyle={{
                  color: '#636363',
                }}>
                {taskConfiguration?.label ?? task.category}
              </Badge>
            </View>
            {/*  <View style={[styles.taskCategoryBadge]}>
              <Text style={[styles.taskBadgeText]}>
                {taskConfiguration?.label ?? task.category}
              </Text>
            </View> */}
            <View style={styles.rightFooter}>
              <Text style={styles.taskTime}>
                {formatTaskTime(task.startTime.toString())} -{' '}
                {formatTaskTime(task.endTime.toString())}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* Task Fields Modal */}
      <TaskFieldsModal
        visible={showModal}
        fields={taskConfiguration?.fields ?? []}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        taskTitle={task.title}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
  },
  leftFooter: {
    gap: 5,
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
