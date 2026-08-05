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
  }>(getDriverProfileQuery);

  return {
    updateDriverFn,
    getDriverProfileFn,
    loadingLoadUser,
    loadingUpdate,
  };
};
