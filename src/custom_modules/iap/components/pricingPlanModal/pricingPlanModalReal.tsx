import { useIAP } from 'expo-iap';
import { PricingPlanModalView } from '../pricingPlanModalView';
import { userData } from '~/store/user';
import { useApolloClient, useReactiveVar } from '@apollo/client';
import { useEffect } from 'react';
import { useSubscriptionPlanList } from '../../hooks/useSubscriptionPlanList';
import { validatePurchaseOnServer } from '../../helper';
import { Alert } from 'react-native';

export const PricingPlanModal = () => {
  const user = useReactiveVar(userData);
  const userId = user?.id || '';

  const client = useApolloClient();

  const { plans, loading } = useSubscriptionPlanList();
  const { subscriptions, fetchProducts, requestPurchase, connected, finishTransaction } = useIAP({
    onPurchaseError(error) {
      console.error('Purchase error:', error);
    },
    async onPurchaseSuccess(purchase) {
      console.log('Purchase successful:', purchase);

      if (!['purchased', 'restored'].includes(purchase.purchaseState)) {
        console.warn('Purchase not completed. Current state:', purchase.purchaseState);
        return;
      }

      const success = await validatePurchaseOnServer(userId, purchase, client);

      if (success) {
        Alert.alert('Purchase Successful', 'Thank you for your purchase!');
      } else {
        Alert.alert(
          'Purchase Failed',
          'There was an issue validating your purchase. Please try again later.'
        );
      }

      await finishTransaction({ purchase, isConsumable: false });
    },
  });

  useEffect(() => {
    if (connected && !loading) {
      fetchProducts({ type: 'subs', skus: plans.map((plan) => plan.productId) });
    }
  }, [connected, fetchProducts, plans, loading]);

  return (
    <PricingPlanModalView
      subscriptions={subscriptions}
      requestPurchase={(sku) => {
        requestPurchase({
          request: {
            android: {
              skus: [sku],
              obfuscatedAccountIdAndroid: userId,
            },
            ios: {
              sku,
              appAccountToken: userId,
            },
          },
          type: 'subs',
        });
      }}
    />
  );
};
