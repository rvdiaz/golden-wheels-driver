import React from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Header } from '~/codidge_components/UI/header';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import DropdownComponent from '~/codidge_components/UI/dropdown';
import {
  convertTimeStringToDate,
  getTaskCategoriesOptions,
  TASK_PRIORITY_OPTIONS,
} from '../helpers';
import { DateInputField } from '~/codidge_components/UI/form/inputs/datePicker';
import { ITask, TaskFormValues, TaskPriority, TaskSource } from '../interfaces';
import { useMutation, useReactiveVar } from '@apollo/client';
import { addTaskMutation, updateTaskMutation } from '../graphql/mutations';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { DateTimeInputField } from '~/codidge_components/UI/form/inputs/dateTimePicker';
import moment from 'moment';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { useTasksByUser } from '../hooks/listTask';
import { useSystemSettings } from '~/system_setting/customHook';
import { Bell } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const AddTaskScreen = ({
  disposeModalHandler,
  defaultDate,
  task,
}: {
  disposeModalHandler: () => void;
  defaultDate: string;
  task?: ITask;
}) => {
  const user = useReactiveVar(userData);
  const { tasksConfiguration } = useSystemSettings();

  const { refetch } = useTasksByUser();

  const [addTaskMutationFn, { loading }] = useMutation<{ addTask: ITask }>(addTaskMutation, {
    onCompleted: () => {
      refetch();
    },
  });

  const [updateTaskMutationFn, { loading: loadingMutation }] = useMutation<{ updateTask: ITask }>(
    updateTaskMutation,
    {
      onCompleted: () => {
        refetch();
      },
    }
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: task?.title ?? '',
      category: task?.category ?? '',
      priority: task?.priority ?? TaskPriority.medium,
      startTime: task?.startTime
        ? convertTimeStringToDate(task.startTime as string, task.date as string)
        : null,
      endTime: task?.endTime
        ? convertTimeStringToDate(task.endTime as string, task.date as string)
        : null,
      date: task?.date ?? defaultDate,
      description: task?.description ?? '',
      notificationSettings: task?.notificationSettings ?? {
        enabled: false,
      },
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    try {
      const formatted = {
        ...data,
        description: data.description,
        startTime: data.startTime
          ? new Date(data.startTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
          : null,
        endTime: data.endTime
          ? new Date(data.endTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
          : null,
      };

      if (task) {
        const updated = await updateTaskMutationFn({
          variables: {
            tenant: { tenantId },
            userId: user?.id,
            taskId: task.id,
            date: task.date,
            updates: {
              ...formatted,
              source: TaskSource.user,
            },
          },
        });

        reset({
          title: updated.data?.updateTask?.title ?? '',
          category: updated.data?.updateTask?.category ?? '',
          priority: updated.data?.updateTask?.priority ?? TaskPriority.medium,
          startTime: updated.data?.updateTask?.startTime
            ? convertTimeStringToDate(
                updated.data?.updateTask.startTime as string,
                task.date as string
              )
            : null,
          endTime: updated.data?.updateTask?.endTime
            ? convertTimeStringToDate(
                updated.data?.updateTask.endTime as string,
                task.date as string
              )
            : null,
          date: updated.data?.updateTask?.date ?? defaultDate,
          description: updated.data?.updateTask?.description ?? '',
        });

        disposeModalHandler();
      } else {
        await addTaskMutationFn({
          variables: {
            tenant: { tenantId },
            userId: user?.id,
            task: {
              ...formatted,
              source: TaskSource.user,
            },
          },
        });

        reset({
          title: '',
          category: '',
          priority: TaskPriority.medium,
          startTime: null,
          endTime: null,
          date: defaultDate,
          description: '',
        });

        disposeModalHandler();
      }
    } catch (error: any) {
      console.log(':::error', error);

      if (error.graphQLErrors?.length > 0) {
        const gqlError = error.graphQLErrors[0].message;

        if (gqlError === 'Task overlaps with existing tasks') {
          Alert.alert(
            'Task Conflict',
            'You already have a task scheduled at this time. To create a new one, please delete or reschedule the existing task first.'
          );
          return;
        }
      }
      const errorText = task ? 'Error adding task!' : 'Error editing task!';
      Alert.alert('Error', errorText);
    }
  };
  const startTime = watch('startTime'); // you already have this

  return (
    <PageSafeContainer style={styles.container}>
      <Header
        title={task ? 'Edit Task' : 'Add Task'}
        showBack={true}
        onBack={disposeModalHandler}
        rightAction={handleSubmit(onSubmit)}
        rightText="Save"
        loadingRight={loading || loadingMutation}
        disabledRight={!isValid}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <ScrollView style={styles.content}>
          <View style={styles.formCard}>
            {/* Title */}
            <View>
              <Controller
                control={control}
                name="title"
                rules={{ required: 'Title is required' }}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    label="Title"
                    required={true}
                    placeholder="Enter task title"
                    value={value}
                    onChangeText={onChange}
                    error={!!errors.title}
                    errorMessage={errors.title?.message}
                  />
                )}
              />
            </View>

            {/* Date Time */}
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Notes"
                  placeholder="Additional details about this income"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={3}
                  style={styles.textArea}
                />
              )}
            />

            <View style={styles.fieldContainer}>
              <Controller
                control={control}
                name="category"
                rules={{
                  required: 'Category is required',
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <DropdownComponent
                    label="Category"
                    required={true}
                    data={getTaskCategoriesOptions(tasksConfiguration ?? [])}
                    placeholder="Select task category"
                    value={value ?? ''}
                    onChange={onChange}
                    error={!!error}
                    errorMessage={error?.message}
                  />
                )}
              />
            </View>

            <View>
              {/* Priority */}
              <Controller
                control={control}
                name="priority"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <DropdownComponent
                    label="Priority"
                    data={TASK_PRIORITY_OPTIONS}
                    placeholder="Select income source"
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    errorMessage={error?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Task Date */}
          <View style={styles.fieldContainer}>
            <View
              style={{
                flex: 1,
              }}>
              <Controller
                control={control}
                name="date"
                render={({ field: { onChange, value } }) => {
                  return (
                    <DateInputField
                      label="Tasks date"
                      value={value as Date}
                      onChangeText={(date) => {
                        const formatted = moment(date).format('YYYY-MM-DD');
                        onChange(formatted);
                      }}
                    />
                  );
                }}
              />
            </View>
          </View>
          <View
            style={[
              styles.fieldContainer,
              {
                flexDirection: 'row',
                gap: 10,
              },
            ]}>
            <View
              style={{
                flex: 1,
              }}>
              <Controller
                control={control}
                name="startTime"
                rules={{ required: 'Start time is required' }} // <-- validation rule
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  return (
                    <DateTimeInputField
                      required={true}
                      mode="time"
                      label="From"
                      value={value as Date}
                      onChangeText={(date: Date) => {
                        onChange(date);
                      }}
                      error={!!error} // pass error state
                      errorMessage={error?.message} // pass message to display
                    />
                  );
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
              }}>
              <Controller
                control={control}
                name="endTime"
                rules={{
                  required: 'End time is required',
                  validate: (endTimeValue: Date | null | string) => {
                    if (!endTimeValue || !startTime) return true; // required will catch empty
                    if (endTimeValue <= startTime) {
                      return 'End time must be after start time';
                    }
                    return true;
                  },
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  const displayValue = value || startTime;

                  return (
                    <DateTimeInputField
                      required={true}
                      mode="time"
                      label="To"
                      value={displayValue as Date}
                      onChangeText={onChange}
                      error={!!error} // pass error state
                      errorMessage={error?.message} // pass message to display
                      hint="After from date*"
                    />
                  );
                }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              borderTopWidth: 1,
              paddingTop: 10,
              borderTopColor: theme.colors.borderNeutralColor,
            }}>
            <Text style={{ flex: 1, fontSize: 16 }}>Enable reminder notification</Text>
            <Controller
              control={control}
              name="notificationSettings.enabled"
              render={({ field: { value, onChange } }) => (
                <Switch onValueChange={onChange} value={value} />
              )}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  fieldContainer: {
    marginBottom: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: { flex: 1, padding: 24 },
  formCard: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: { height: 100, paddingTop: 12 },
  priorityContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  priorityText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  bottomBarContainer: {
    paddingHorizontal: 20,
  },
});
