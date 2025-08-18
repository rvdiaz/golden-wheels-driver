import { Clock, CheckSquare } from 'lucide-react-native';
import React from 'react';
import { TabHeader } from '~/codidge_components/UI/tabs';

export const TaskManagementHeader = () => {
  return (
    <TabHeader
      tabs={[
        { key: 'daily', label: 'Daily Schedule', Icon: Clock },
        { key: 'custom', label: 'Custom Tasks', Icon: CheckSquare },
      ]}
      onTabChange={(key) => console.log('Active tab:', key)}
    />
  );
};
