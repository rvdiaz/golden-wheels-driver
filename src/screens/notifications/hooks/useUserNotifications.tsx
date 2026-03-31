import { useQuery, useReactiveVar } from '@apollo/client';
import React from 'react';
import { getUserNotificationsQuery } from '../graphql/queries';
import { ENV_Vars } from '~/store/env';
import { userData } from '~/store/user';
import { INotification } from '../interfaces';

export const useUserNotifications = () => {
  const userInfo = useReactiveVar(userData);

  const { data, loading: loadingNotifications } = useQuery<{
    getUserNotifications: INotification[];
  }>(getUserNotificationsQuery, {
    variables: {
      userId: userInfo?.id,
      tenant: ENV_Vars.tenant,
    },
    skip: !userInfo?.id,
  });

  const notificationList = data?.getUserNotifications ?? [];

  return {
    notifications: notificationList,
    loadingNotifications,
  };
};
