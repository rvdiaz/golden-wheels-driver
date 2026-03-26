import { updateUser } from '.';
import { IUser } from './interfaces';
import { useUser } from '~/screens/auth/hooks/useUser';
import { ENV_Vars } from '../env';

export const useRefreshUser = () => {
  const { getCustomerFn } = useUser();

  const refreshUser = async (userId: string, pushToken?: string) => {
    try {
      const { data } = await getCustomerFn({
        variables: {
          tenant: ENV_Vars.tenant,
          customerId: userId,
        },
        fetchPolicy: 'network-only', // always hit the network for freshness
      });

      if (data?.getCustomer) {
        await updateUser(data.getCustomer as IUser); // <-- ✅ updates both AsyncStorage + reactive var
      }
    } catch (error) {
      console.error('❌ Error refreshing user:', error);
    }
  };

  return refreshUser;
};
