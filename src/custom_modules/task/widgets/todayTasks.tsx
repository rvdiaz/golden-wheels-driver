import { useQuery, useReactiveVar } from '@apollo/client';
import React from 'react';
import { ITask } from '../interfaces';
import { getTaskByUserQuery } from '../graphql/queries';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import { sortTasks } from '../helpers';
import { TaskList } from './taskList';

const tenantId = Constants.expoConfig?.extra?.TENANTID;
const today = new Date().toISOString().split('T')[0];

export const TodayTasks = () => {
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
    return <PageLoading />;
  }

  const tasks = sortTasks(data?.getTasksByUser ?? []);

  return <TaskList tasks={tasks} />;
};
