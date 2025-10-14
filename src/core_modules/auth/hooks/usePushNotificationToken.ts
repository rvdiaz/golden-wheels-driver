import { useEffect } from 'react';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { pushTokenVar, setPushToken } from '~/store/user/pushToken';
import { userData, updateUser } from '~/store/user';

import { getUserQuery } from '../graphql/queries';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

const getPushNotificationToken = async (): Promise<string> => {
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return '';
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return '';
  }

  // Use Expo Push Token instead
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  if (!projectId) {
    console.error('Project ID not found');
    return '';
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return token;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const usePushNotificationTokenSetup = () => {
  const pushToken = useReactiveVar(pushTokenVar);
  const userInfo = useReactiveVar(userData);
  const [getCustomerFn] = useLazyQuery(getUserQuery);

  useEffect(() => {
    (async () => {
      if (!pushToken) {
        const token = await getPushNotificationToken();
        setPushToken(token);
      }
    })();
  }, [pushToken]);

  useEffect(() => {
    if (pushToken && userInfo && userInfo.loadedFromStorage) {
      const { loadedFromStorage, ...user } = userInfo || {};
      updateUser(user);
      getCustomerFn({
        variables: {
          tenant: {
            tenantId,
          },
          token: pushToken,
          userId: userInfo.id,
        },
      }).then(() => {
        console.log('User data updated with push token');
      });
    }
  }, [pushToken, userInfo, getCustomerFn]);

  console.log(':::::pushToken', pushToken);

  return {
    pushToken,
    userInfo,
  };
};
