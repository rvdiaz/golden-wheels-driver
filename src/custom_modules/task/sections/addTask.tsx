import React from 'react';
import { View, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Header } from '~/codidge_components/UI/header';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import DropdownComponent from '~/codidge_components/UI/dropdown';
import { getPriorityColor, TASK_CATEGORY_OPTIONS, TASK_PRIORITY_OPTIONS } from '../helpers';
import { RadioGroupButtons } from '~/codidge_components/UI/form/RadioGroupButton';
import { DateInputField } from '~/codidge_components/UI/form/inputs/datePicker';
import { ITask, TaskFormValues, TaskPriority } from '../interfaces';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/OutlineButton';
import { useMutation, useReactiveVar } from '@apollo/client';
import { addTaskMutation } from '../graphql/mutations';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { getTaskByUserQuery } from '../graphql/queries';

const tenantId = Constants.expoConfig?.extra?.TENANTID;
const today = new Date().toISOString().split('T')[0];

export const AddTaskScreen = ({ disposeModalHandler }: { disposeModalHandler: () => void }) => {
  const customer = useReactiveVar(userData);

  const defaultTaskDate = new Date();
  defaultTaskDate.setDate(defaultTaskDate.getDate() + 1);
  const taskDateISO = defaultTaskDate.toISOString();

  const [addTaskMutationFn, { loading }] = useMutation<{ addTask: ITask }>(addTaskMutation, {
    update: (cache, { data }) => {
      if (!data?.addTask) return;

      const newTask = data.addTask;

      // Read existing tasks for this user from cache
      const existingData = cache.readQuery<{ getTasksByUser: ITask[] }>({
        query: getTaskByUserQuery,
        variables: {
          tenant: { tenantId },
          userId: customer?.id,
          date: today,
        },
      });

      if (existingData?.getTasksByUser) {
        cache.writeQuery({
          query: getTaskByUserQuery,
          variables: {
            tenant: { tenantId },
            userId: customer?.id,
            date: today,
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
    formState: { errors, isValid },
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: TaskPriority.medium,
      scheduledTime: taskDateISO,
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    try {
      await addTaskMutationFn({
        variables: {
          tenant: { tenantId },
          userId: customer?.id,
          task: {
            ...data,
            source: 'user',
          },
        },
      });

      reset({
        title: '',
        description: '',
        category: '',
        priority: TaskPriority.medium,
        scheduledTime: taskDateISO,
      });

      disposeModalHandler();
    } catch (error) {
      Alert.alert('Error', 'Error adding task!');
      console.log('data', data);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add Task" rightAction={disposeModalHandler} rightText="Close" />

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

          {/* Description */}
          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="description"
              rules={{ required: 'Description is required' }}
              render={({ field: { onChange, value } }) => (
                <InputField
                  label="Description"
                  required={true}
                  placeholder="Enter task description"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{
                    minHeight: 80,
                  }}
                  error={!!errors.description}
                  errorMessage={errors.description?.message}
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
                  data={TASK_CATEGORY_OPTIONS}
                  placeholder="Select task category"
                  value={value ?? ''}
                  onChange={onChange}
                  error={!!error}
                  errorMessage={error?.message}
                />
              )}
            />
          </View>

          <View style={styles.fieldContainer}>
            {/* Priority */}
            <Controller
              control={control}
              name="priority"
              render={({ field: { value, onChange } }) => (
                <RadioGroupButtons
                  label="Priority"
                  value={value}
                  onChange={onChange}
                  options={TASK_PRIORITY_OPTIONS}
                  getColor={getPriorityColor}
                />
              )}
            />
          </View>
        </View>

        {/* Follow Up */}
        <View style={styles.fieldContainer}>
          <View
            style={{
              flex: 1,
            }}>
            <Controller
              control={control}
              name="scheduledTime"
              render={({ field: { onChange, value } }) => (
                <DateInputField label="Tasks date" value={value as Date} onChangeText={onChange} />
              )}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBarContainer}>
        {/* Submit Button */}
        <PrimaryButton
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          size={ButtonSize.LARGE}
          disabled={!isValid}
          title="Save Task"
        />
      </View>
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
