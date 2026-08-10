import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useMutation, useReactiveVar } from '@apollo/client';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { pushTokenVar, setPushToken } from '~/store/user/pushToken';
import { userData } from '~/store/user';
import { CUSTOMER_APP_EAS_PROJECT_ID, ENV_Vars } from '~/store/env';
import { registerDeviceTokenCodidgeMutation } from '../graphql/mutations.notifications';

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
  const [registerDeviceTokenFn] = useMutation(registerDeviceTokenCodidgeMutation);
  // Which (account, token) pair we have already registered this session.
  const registeredRef = useRef<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!pushToken) {
        const token = await getPushNotificationToken();
        if (token) setPushToken(token);
      }
    })();
  }, [pushToken]);

  /**
   * Registration needs a signed-in caller: the resolver derives the recipient key from the
   * verified Cognito token and refuses anything else, so there is nothing to send until the
   * driver has a session.
   *
   * `userInfo.id` is the generated `driverID`, not the Cognito sub — that is fine, because it
   * is never transmitted. It serves only as "we have a session" and as the dedupe key.
   */
  useEffect(() => {
    const driverID = userInfo?.id;
    if (!pushToken || !driverID) return;

    const registration = `${driverID}:${pushToken}`;
    if (registeredRef.current === registration) return;
    // Claimed before the request so a second render cannot fire a duplicate in flight. The
    // backend upsert is idempotent either way; this just avoids the round trip.
    registeredRef.current = registration;

    registerDeviceTokenFn({
      variables: {
        organizationID: ENV_Vars.ORGANIZATION_ID,
        token: pushToken,
        platform: Platform.OS,
        deviceName: Device.deviceName ?? undefined,
      },
    }).catch((error) => {
      // Released so the next mount retries — a driver whose device stays unregistered never
      // hears about an available trip, which is worse than an extra call.
      registeredRef.current = null;
      console.error('❌ Could not register device for push notifications:', error);
    });
  }, [pushToken, userInfo?.id, registerDeviceTokenFn]);

  return { pushToken, userInfo };
};
