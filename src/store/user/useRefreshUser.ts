import { updateUser } from '.';
import { IUser } from './interfaces';
import { useUser } from '~/screens/auth/hooks/useUser';
import { ENV_Vars } from '../env';

export const useRefreshUser = () => {
  const { getDriverProfileFn } = useUser();

  const refreshUser = async () => {
    try {
      const { data } = await getDriverProfileFn({
        variables: { tenant: ENV_Vars.tenant },
        fetchPolicy: 'network-only',
      });

      if (data?.getDriverProfile) {
        await updateUser(data.getDriverProfile as IUser);
      }
    } catch (error) {
      console.error('Error refreshing driver profile:', error);
    }
  };

  return refreshUser;
};
