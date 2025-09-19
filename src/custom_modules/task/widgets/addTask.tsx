import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Header } from '~/codidge_components/UI/header';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import DropdownComponent from '~/codidge_components/UI/dropdown';
import { getTaskCategoriesOptions, TASK_PRIORITY_OPTIONS } from '../helpers';
import { DateInputField } from '~/codidge_components/UI/form/inputs/datePicker';
import { ITask, TaskFormValues, TaskPriority, TaskSource } from '../interfaces';
import { useMutation, useReactiveVar } from '@apollo/client';
import { addTaskMutation } from '../graphql/mutations';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { getTaskByUserQuery } from '../graphql/queries';
import { DateTimeInputField } from '~/codidge_components/UI/form/inputs/dateTimePicker';
import moment from 'moment';

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
  const userTaskSchema = user?.systemData?.tasksConfiguration;

  const [addTaskMutationFn, { loading }] = useMutation<{ addTask: ITask }>(addTaskMutation, {
    update: (cache, { data }) => {
      if (!data?.addTask) return;

      const newTask = data.addTask;

      // Read existing tasks for this user from cache
      const existingData = cache.readQuery<{ getTasksByUser: ITask[] }>({
        query: getTaskByUserQuery,
        variables: {
          tenant: { tenantId },
          userId: user?.id,
          date: defaultDate,
          userActiveTemplateId: user?.activeTemplateId,
        },
      });

      if (existingData?.getTasksByUser) {
        cache.writeQuery({
          query: getTaskByUserQuery,
          variables: {
            tenant: { tenantId },
            userId: user?.id,
            date: defaultDate,
            userActiveTemplateId: user?.activeTemplateId,
          },
          data: {
            getTasksByUser: [...existingData.getTasksByUser, newTask],
          },
        });
      }
    },
  });
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
      startTime: task?.startTime ?? null,
      endTime: task?.endTime ?? null,
      date: task?.date ?? defaultDate,
      description: task?.description ?? '',
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
              hour12: false, // remove if you want AM/PM
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
    } catch (error) {
      Alert.alert('Error', 'Error adding task!');
      console.log('data', data);
    }
  };

  const startTime = watch('startTime'); // watch start time

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Add Task"
        showBack={true}
        onBack={disposeModalHandler}
        rightAction={handleSubmit(onSubmit)}
        rightText="Save"
        loadingRight={loading}
        disabledRight={!isValid}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <ScrollView style={styles.content}>
          <View style={styles.formCard}>
            {/* Title */}
            <View style={styles.fieldContainer}>
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

            <View style={styles.fieldContainer}>
              <Controller
                control={control}
                name="category"
                rules={{
                  required: 'Category is required',
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <DropdownComponent
                    label="Type"
                    required={true}
                    data={getTaskCategoriesOptions(userTaskSchema ?? [])}
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
                render={({ field: { onChange, value } }) => (
                  <DateInputField
                    label="Tasks date"
                    value={value as Date}
                    onChangeText={(date) => {
                      const formatted = moment(date).format('YYYY-MM-DD');
                      onChange(formatted);
                    }}
                  />
                )}
              />
            </View>
          </View>
          {/* Date Time */}
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
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <DateTimeInputField
                    required={true}
                    mode="time"
                    label="To"
                    value={value as Date}
                    onChangeText={onChange}
                    error={!!error} // pass error state
                    errorMessage={error?.message} // pass message to display
                    hint="After from date*"
                  />
                )}
              />
            </View>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 40,
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
