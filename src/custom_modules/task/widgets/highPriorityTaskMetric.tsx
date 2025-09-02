import React from 'react';
import { TaskMetricsCard } from '~/custom_modules/dashboard/widgets/metricsStats';
import * as Icons from 'lucide-react-native';
import { useQuery, useReactiveVar } from '@apollo/client';
import { ITask, TaskPriority } from '../interfaces';
import { getTaskByUserQuery } from '../graphql/queries';
import { userData } from '~/store/user';
import Constants from 'expo-constants';

const tenantId = Constants.expoConfig?.extra?.TENANTID;
const today = new Date().toISOString().split('T')[0];

export const HighPriorityTaskMetric = () => {
  const customer = useReactiveVar(userData);

  const { data, loading: isLoading } = useQuery<{ getTasksByUser: ITask[] }>(getTaskByUserQuery, {
    variables: {
      tenant: {
        tenantId,
      },
      userId: customer?.id,
      date: today,
      userActiveTemplateId: customer?.activeTemplateId,
    },
  });

  if (isLoading) {
    return;
  }

  const tasks = data?.getTasksByUser ?? [];
  const highPriorityTask = tasks.filter((tsk) => tsk.priority === TaskPriority.high);

  const metric = {
    label: "Daily's Tasks",
    value: `${highPriorityTask.length}`,
    subLabel: 'High Priority',
    iconName: <Icons.Goal color="#166534" size={20} />,
    iconBackgroundColor: '#86EFAC',
    cardBackgroundColor: '#F0FDF4',
  };

  if (highPriorityTask.length > 0) {
    return <TaskMetricsCard {...metric} />;
  }
};
