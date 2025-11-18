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
      console.log('Notification subscription data received:', data);
      if (!data.data?.onNotificationPublished.userNotification) {
        console.log('No new notification received.');
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
            return { getUserNotifications: { items: [newNotification] } };
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
