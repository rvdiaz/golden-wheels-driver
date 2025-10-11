import { useUserNotificationsSubscription } from '~/core_modules/notifications/hooks/useUserNotificationsSubscription';

export const useGlobalSubscriptions = () => {
  useUserNotificationsSubscription();
};
