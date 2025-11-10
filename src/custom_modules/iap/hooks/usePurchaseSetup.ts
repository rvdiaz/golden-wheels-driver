import { useApolloClient, useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { userData } from '~/store/user';
import { ExpoPurchaseError, Purchase, useIAP } from 'expo-iap';
import { validatePurchaseOnServer } from '../helper';

export const usePurchaseSetup = () => {
  const user = useReactiveVar(userData);
  const client = useApolloClient();

  const { connected } = useIAP({
    onPurchaseError: (error: ExpoPurchaseError) => {
      console.error('Purchase error:', error);
    },
    onPurchaseSuccess: async (purchase: Purchase) => {
      await validatePurchaseOnServer(user?.id || '', purchase, client);
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected || !user) {
      return;
    }
    setLoading(false);
  }, [connected, user]);

  return {
    connected,
    loading,
  };
};
