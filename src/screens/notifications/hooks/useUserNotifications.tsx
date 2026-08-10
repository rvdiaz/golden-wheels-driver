import { useQuery, useReactiveVar } from '@apollo/client';
import { listMyNotificationsQuery } from '../graphql/queries';
import { ENV_Vars } from '~/store/env';
import { userData } from '~/store/user';
import { ListMyNotificationsResponse } from '../interfaces';

export const useUserNotifications = () => {
  const userInfo = useReactiveVar(userData);

  const {
    data,
    loading: loadingNotifications,
    refetch: refetchNotifications,
  } = useQuery<ListMyNotificationsResponse>(listMyNotificationsQuery, {
    // No driver id in the variables: the server reads the mailbox off the verified token, and
    // `userInfo.id` is a generated driverID rather than the Cognito sub anyway. This only gates
    // on a session existing at all.
    variables: {
      organizationID: ENV_Vars.ORGANIZATION_ID,
      limit: 30,
    },
    skip: !userInfo?.id,
    fetchPolicy: 'cache-and-network',
  });

  return {
    notifications: data?.listMyNotifications?.items ?? [],
    loadingNotifications,
    refetchNotifications,
  };
};
