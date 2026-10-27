import { useLazyQuery, useMutation } from '@apollo/client';
import { updateDriverMutation } from '../graphql/mutations';
import { getDriverProfileQuery } from '../graphql/queries';
import { IUser } from '~/store/user/interfaces';

export const useUser = () => {
  const [updateDriverFn, { loading: loadingUpdate }] = useMutation<{ updateDriver: IUser }>(
    updateDriverMutation
  );

  const [getDriverProfileFn, { loading: loadingLoadUser }] = useLazyQuery<{
    getDriverProfile: IUser;
  }>(getDriverProfileQuery, {
    // The answer depends on who signed in (the token), not on the variables, so a cached
    // result belongs to whoever was signed in before — including a null from a failed login.
    fetchPolicy: 'network-only',
  });

  return {
    updateDriverFn,
    getDriverProfileFn,
    loadingLoadUser,
    loadingUpdate,
  };
};
