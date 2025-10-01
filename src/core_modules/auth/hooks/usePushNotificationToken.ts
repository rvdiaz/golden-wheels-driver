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

  const { data } = await Notifications.getDevicePushTokenAsync();
  return data;
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

  return {
    pushToken,
    userInfo,
  };
};
