import { useUserNotificationsSubscription } from '~/core_modules/notifications/hooks/useUserNotificationsSubscription';
import { useUserSubscription } from './useUserSubscription';

export const useGlobalSubscriptions = () => {
  useUserNotificationsSubscription();
  useUserSubscription();
};
