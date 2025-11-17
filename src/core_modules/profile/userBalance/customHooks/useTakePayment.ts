import { useMutation, useReactiveVar } from '@apollo/client';
import { takeUserBalanceMutation } from '../graphql/mutations';
import Constants from 'expo-constants';
import { updateUser, userData } from '~/store/user';

type TakeUserBalanceVariables = {
  tenant?: {
    tenantId: string;
  };
  userId: string;
  amount: number;
};

type TakeUserBalanceData = {
  takeUserBalance: {
    amount: number;
    currency: string;
  };
};

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const useTakeUserBalance = () => {
  const currentUser = useReactiveVar(userData);

  const [mutate, { data, loading, error }] = useMutation<
    TakeUserBalanceData,
    TakeUserBalanceVariables
  >(takeUserBalanceMutation);

  const takeBalance = async (variables: TakeUserBalanceVariables) => {
    try {
      const response = await mutate({
        variables: {
          tenant: {
            tenantId,
          },
          ...variables,
        },
      });

      const newBalance = response.data?.takeUserBalance;

      if (currentUser) {
        updateUser({
          ...currentUser,
          balance: {
            amount: newBalance?.amount ?? 0,
            currency: newBalance?.currency ?? 'USD',
          },
        });
      }
    } catch (err) {
      console.error('Error taking balance:', err);
      throw err;
    }
  };

  return { takeBalance, data, loading, error };
};
