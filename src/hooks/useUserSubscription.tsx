/* import { useReactiveVar, useSubscription } from '@apollo/client';
import { updateUser, userData } from '~/store/user';
import Constants from 'expo-constants';
import { IUser } from '~/store/user/interfaces';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const useUserSubscription = () => {
  const currentUser = useReactiveVar(userData);

  useSubscription<{
    onUserUpdated: {
      user: IUser;
    };
  }>(onUserUpdatedSubscription, {
    variables: {
      userId: currentUser?.id ?? '',
      tenantId,
    },
    skip: !currentUser?.id,
    onData({ data }) {
      console.log('User subscription data received:', data);
      if (!data.data?.onUserUpdated?.user) {
        console.log('No user update received.');
        return;
      }
      const updatedUser = data.data.onUserUpdated.user;
      console.log('User updated:', updatedUser);
      updateUser(updatedUser);
    },
  });
};
 */
