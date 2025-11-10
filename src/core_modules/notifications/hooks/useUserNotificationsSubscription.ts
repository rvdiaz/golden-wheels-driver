import { useReactiveVar, useSubscription } from '@apollo/client';
import { userData } from '~/store/user';
import { getUserNotificationsQuery, onNotificationPublishedSubscription } from '../graphql/queries';
import Constants from 'expo-constants';
import { GetUserNotificationsResponse, OnNotificationPublishedData } from '../interfaces';
import { getUserNotificationsVariables } from '../helpers';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const useUserNotificationsSubscription = () => {
  const userInfo = useReactiveVar(userData);
  useSubscription<OnNotificationPublishedData>(onNotificationPublishedSubscription, {
    variables: {
      tenantId,
      userId: userInfo?.id ?? '',
      sent: true,
      showOnApp: true,
    },
    onError(err) {
      console.log('Error details:', JSON.stringify(err, null, 2));
    },
    shouldResubscribe(options) {
      return options.variables?.userId !== userInfo?.id;
    },
    skip: !userInfo?.id,
    onData({ data, client }) {
      if (!data.data?.onNotificationPublished.userNotification) {
        return;
      }

      const newNotification = data.data.onNotificationPublished.userNotification;

      client.cache.updateQuery<GetUserNotificationsResponse>(
        {
          query: getUserNotificationsQuery,
          variables: getUserNotificationsVariables(userInfo?.id),
        },
        (prev) => {
          if (!prev) {
            return prev;
          }

          return {
            getUserNotifications: {
              ...prev.getUserNotifications,
              items: [
                newNotification,
                ...prev.getUserNotifications.items.filter(
                  (item) => item.notificationId !== newNotification.notificationId
                ),
              ],
            },
          };
        }
      );
    },
  });
};
