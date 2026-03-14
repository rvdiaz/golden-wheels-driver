import { useUserNotificationsSubscription } from '~/screens/notifications/hooks/useUserNotificationsSubscription';
import { useUserSubscription } from './useUserSubscription';

export const useGlobalSubscriptions = () => {
  useUserNotificationsSubscription();
  useUserSubscription();
};
