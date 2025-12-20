import { useLazyQuery } from '@apollo/client';
import { updateUser } from '.';
import { getAdminUserQuery } from '~/core_modules/auth/graphql/queries';
import { IUser } from './interfaces';
import { useTenant } from '../tenant/useTenant';

export const useRefreshUser = () => {
  const [getUserFn] = useLazyQuery(getAdminUserQuery, {});
  const { userInfo } = useTenant();

  const refreshUser = async (userId: string, pushToken?: string) => {
    try {
      const { data } = await getUserFn({
        variables: {
          tenantID: userInfo?.activeTenantId,
          token: pushToken,
          userId,
        },
        fetchPolicy: 'network-only', // always hit the network for freshness
      });

      if (data?.getUser) {
        await updateUser(data.getUser as IUser); // <-- ✅ updates both AsyncStorage + reactive var
      }
    } catch (error) {
      console.error('❌ Error refreshing user:', error);
    }
  };

  return refreshUser;
};
