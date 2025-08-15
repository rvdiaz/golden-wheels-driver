import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';

import * as Icons from 'lucide-react-native';
import { Card } from '~/codidge_components/UI/card';
import { Header } from '~/codidge_components/UI/header';

type Priority = 'high' | 'medium' | 'low';

interface TaskFormValues {
  title: string;
  description: string;
  category: string;
  priority: Priority;
}

export const AddTaskScreen = ({ disposeModalHandler }: { disposeModalHandler: () => void }) => {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: 'medium',
    },
  });

  const priority = watch('priority');

  const onSubmit = (data: TaskFormValues) => {
    if (!data.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    // Save task to your store here
    console.log('Saving task:', data);

    Alert.alert('Success', 'Task added successfully', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
    disposeModalHandler();
  };

  const getPriorityColor = (selectedPriority: string) => {
    switch (selectedPriority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Add Task"
        showBack
        onBack={disposeModalHandler}
        rightAction={handleSubmit(onSubmit)}
        rightText="Save"
      />

      <View style={styles.content}>
        <Card style={styles.formCard}>
          {/* Title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <Controller
              control={control}
              name="title"
              rules={{ required: 'Title is required' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter task title"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.title && <Text style={{ color: 'red' }}>{errors.title.message}</Text>}
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter task description"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              )}
            />
          </View>

          {/* Category */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Follow-up, Listing, Research"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* Priority */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {(['high', 'medium', 'low'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    priority === p && {
                      backgroundColor: getPriorityColor(p) + '20',
                      borderColor: getPriorityColor(p),
                    },
                  ]}
                  onPress={() => setValue('priority', p)}>
                  <Text
                    style={[styles.priorityText, priority === p && { color: getPriorityColor(p) }]}>
                    {p.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        {/* Schedule Card */}
        <Card style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <Icons.Calendar size={20} color="#2563EB" />
            <Text style={styles.scheduleTitle}>Add to Schedule</Text>
          </View>
          <Text style={styles.scheduleDescription}>
            This task will be added to your daily schedule
          </Text>
          <TouchableOpacity style={styles.scheduleButton}>
            <Icons.Clock size={16} color="#2563EB" />
            <Text style={styles.scheduleButtonText}>Set Due Date & Time</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { flex: 1, padding: 16 },
  formCard: { padding: 20, marginBottom: 16 },
  formGroup: { marginBottom: 20 },
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
  scheduleCard: { padding: 20 },
  scheduleHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  scheduleDescription: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  scheduleButtonText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 8,
  },
});
