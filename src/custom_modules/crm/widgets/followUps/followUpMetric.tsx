import React from 'react';
import * as Icons from 'lucide-react-native';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import Constants from 'expo-constants';
import { IContact } from '../../interfaces';
import { getUserContacts } from '../../graphql/queries';
import { TaskMetricsCard } from '~/custom_modules/dashboard/widgets/metricCards';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const FollowUpMetric = () => {
  const customer = useReactiveVar(userData);

  const { data, loading } = useQuery<{ getUserContacts: IContact[] }>(getUserContacts, {
    variables: {
      tenant: {
        tenantId,
      },
      userId: customer?.id,
    },
  });

  const users = data?.getUserContacts ?? [];
  const followUp = [];

  const metric = {
    label: 'Contacts',
    value: `${followUp.length}`,
    subLabel: 'Follow-Ups',
    iconName: <Icons.Contact color="#9A3412" size={20} />,
    iconBackgroundColor: '#FDBA74',
    cardBackgroundColor: '#FFF7ED',
    subLabelColor: '#7C2D12',
    isLoading: loading,
  };

  return <TaskMetricsCard {...metric} />;
};
