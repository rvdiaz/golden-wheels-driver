import React from 'react';
import * as Icons from 'lucide-react-native';
import { useQuery, useReactiveVar } from '@apollo/client';
import { ITask, TaskPriority } from '../interfaces';
import { getTaskByUserQuery } from '../graphql/queries';
import { userData } from '~/store/user';
import Constants from 'expo-constants';
import { TaskMetricsCard } from '~/custom_modules/dashboard/widgets/metricCards';
import { useTasksByUser } from '../hooks/listTask';


export const HighPriorityTaskMetric = () => {

  const { tasks, isLoading, refetch } = useTasksByUser();


  const highPriorityTask = tasks.filter((tsk) => tsk.priority === TaskPriority.high);

  const metric = {
    label: "Daily's Tasks",
    value: `${highPriorityTask.length}`,
    subLabel: 'High Priority',
    iconName: <Icons.Goal color="#166534" size={20} />,
    iconBackgroundColor: '#86EFAC',
    cardBackgroundColor: '#F0FDF4',
    isLoading, // Pass the loading state
  };

  // Always render the card - loading state is handled internally
  return <TaskMetricsCard {...metric} />;
};
