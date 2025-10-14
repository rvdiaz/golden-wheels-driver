import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { GoalType, ITask, TaskSource } from '../interfaces';
import {
  formatTaskTime,
  getDurationInMinutes,
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
import { AddTaskScreen } from './addTask';
import { CheckCircle, Pencil, X, XCircle } from 'lucide-react-native';
import IconButton from '~/codidge_components/UI/button/IconButton';
import Text from '~/codidge_components/UI/text';
import { useSystemSettings } from '~/system_setting/customHook';
import { CategoryFullDescription } from './categoryFullDescription';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const TaskItem = ({ task }: { task: ITask }) => {
  const isActive = isActiveTask(task);

  const [value, setvalue] = useState(task.isCompleted ?? false);
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setvalue(task.isCompleted);
  }, [task.isCompleted]);

  const { tasksConfiguration } = useSystemSettings();

  const user = useReactiveVar(userData);

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

  const taskConfiguration = getTaskConfigByKey(task, tasksConfiguration ?? []);

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
    try {
      if (taskConfiguration) {
        const goalTypes: GoalType[] = [];

        // Check if task has additional fields
        if (taskConfiguration.fields && taskConfiguration.fields.length > 0) {
          // Show modal to collect field data
          if (toggleValue) {
            setShowModal(true);
          } else {
            await executeTaskCompletion([], toggleValue);
          }

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
          await executeTaskCompletion(goalTypes, toggleValue);
        }
      } else {
        // No task configuration, complete without goal types
        await executeTaskCompletion([], toggleValue);
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
      await executeTaskCompletion(goalTypes, true);
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

  const renderStatusIcon = () => {
    if (isActive) return null;

    if (taskStatus === 'complete') {
      return <CheckCircle size={20} color={borderColor} />;
    }

    if (taskStatus === 'inComplete') {
      return <XCircle size={20} color={borderColor} />;
    }

    return <View></View>;
  };

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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  gap: 5,
                }}>
                <View>
                  <Text
                    style={[
                      styles.taskTitle,
                      {
                        textDecorationLine: value ? 'line-through' : 'none',
                      },
                    ]}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskDescription} numberOfLines={3}>
                    {task.description ?? ''}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                alignItems: 'flex-end',
                gap: 3,
              }}>
              <View style={{ alignItems: 'flex-end', flexDirection: 'row', gap: 10 }}>
                {isActive ? (
                  <>
                    {!value && task.source !== TaskSource.admin && (
                      <IconButton
                        style={{
                          paddingVertical: 2,
                          backgroundColor: 'transparent',
                        }}
                        onPress={() => {
                          setModalVisible(true);
                        }}
                        icon={<Pencil size={16} color={theme.colors.accent} />}
                      />
                    )}
                    <SimpleCheckbox
                      color={theme.colors.success}
                      checked={value}
                      onToggle={handleCompleteTask}
                    />
                  </>
                ) : (
                  renderStatusIcon()
                )}
                {/* Info button - only show if there's a description */}
                {taskConfiguration?.description && (
                  <CategoryFullDescription taskHtmlDescription={taskConfiguration?.description} />
                )}
              </View>
            </View>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <AddTaskScreen
            defaultDate={String(task.date)}
            task={task}
            disposeModalHandler={() => {
              setModalVisible(false);
            }}
          />
        </View>
      </Modal>
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
    fontSize: 22,
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
