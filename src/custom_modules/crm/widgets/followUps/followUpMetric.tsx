import React from 'react';
import * as Icons from 'lucide-react-native';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import Constants from 'expo-constants';
import { IContact, IFollowUpResponse } from '../../interfaces';
import { getUserFollowUpsQuery } from '../../graphql/queries';
import { TaskMetricsCard } from '~/custom_modules/dashboard/widgets/metricCards';
import moment from 'moment';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const FollowUpMetric = () => {
  const user = useReactiveVar(userData);

  const today = moment().format('YYYY-MM-DD');
  const fifteenDaysLater = moment().add(15, 'days').format('YYYY-MM-DD');

  const { data, loading } = useQuery<{ getUserFollowUps: IFollowUpResponse }>(
    getUserFollowUpsQuery,
    {
      variables: {
        tenant: {
          tenantId,
        },
        input: {
          userId: user?.id,
          dateFrom: today,
          dateTo: fifteenDaysLater,
        },
      },
    }
  );
  const followUps = data?.getUserFollowUps?.followUps ?? [];

  const metric = {
    label: 'CRM',
    value: `${followUps ? followUps.length : 0}`,
    subLabel: 'Follow-Ups',
    iconName: <Icons.Contact color="#9A3412" size={20} />,
    iconBackgroundColor: '#FDBA74',
    cardBackgroundColor: '#FFF7ED',
    subLabelColor: '#7C2D12',
    isLoading: loading,
  };

  return <TaskMetricsCard {...metric} />;
};
