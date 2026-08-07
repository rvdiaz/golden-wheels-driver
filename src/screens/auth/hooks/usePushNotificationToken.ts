import { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { pushTokenVar, setPushToken } from '~/store/user/pushToken';
import { userData } from '~/store/user';
import { CUSTOMER_APP_EAS_PROJECT_ID, ENV_Vars } from '~/store/env';

const getPushNotificationToken = async (): Promise<string> => {
  try {
    if (!Device.isDevice) return '';

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return '';

    const projectId = ENV_Vars.EAS_PROJECT_ID;
    if (!projectId) {
      console.error('Project ID not found');
      return '';
    }

    // A token minted against another Expo project is accepted here and then
    // silently never delivers — the worst kind of failure to debug. Make it loud.
    if (projectId === CUSTOMER_APP_EAS_PROJECT_ID) {
      console.error(
        '[push] EAS_PROJECT_ID is still the CUSTOMER app project. Push tokens ' +
          'minted now are unroutable. Run `eas init` in the driver repo and ' +
          'update EAS_PROJECT_ID in app.config.ts.'
      );
      if (__DEV__) {
        throw new Error('Driver app is using the customer app EAS project id');
      }
    }

    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return '';
  }
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
  const [updateDriverFn] = useMutation(updateDriverMutation);

  useEffect(() => {
    (async () => {
      if (!pushToken) {
        const token = await getPushNotificationToken();
        if (token) setPushToken(token);
      }
    })();
  }, [pushToken]);

  useEffect(() => {
    if (pushToken && userInfo?.id) {
      updateDriverFn({
        variables: {
          tenant: ENV_Vars.tenant,
          driverId: userInfo.id,
          driver: { pushToken },
        },
      }).catch((err) => console.warn('Failed to save push token:', err));
    }
  }, [pushToken, userInfo?.id]);

  return { pushToken, userInfo };
};
