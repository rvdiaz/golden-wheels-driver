import { useCallback } from 'react';
import { useApolloClient, useLazyQuery, useQuery } from '@apollo/client';
import { getUserQuery } from '~/core_modules/auth/graphql/queries';
import { updateUser } from '.';
import { IUser } from '../interface';
import Constants from 'expo-constants';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const useRefreshUser = () => {
  const [getUserFn] = useLazyQuery(getUserQuery, {});

  const refreshUser = async (userId: string, pushToken?: string) => {
    try {
      const { data } = await getUserFn({
        variables: {
          tenant: { tenantId },
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
