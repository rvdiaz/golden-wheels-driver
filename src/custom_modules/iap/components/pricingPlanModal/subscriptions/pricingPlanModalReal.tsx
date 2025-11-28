import { initConnection, useIAP } from 'expo-iap';
import { PricingPlanModalView } from '../../pricingPlanModalView';
import { userData } from '~/store/user';
import { useApolloClient, useReactiveVar } from '@apollo/client';
import { useEffect, useRef } from 'react';
import { useSubscriptionPlanList } from '../../../hooks/useSubscriptionPlanList';
import { validatePurchaseOnServer } from '../../../helper';
import { Alert } from 'react-native';
import { paywallVisibility } from '~/store/subscription';

export const PricingPlanModal = () => {
  const user = useReactiveVar(userData);
  const userId = user?.id || '';

  const client = useApolloClient();

  const purchaseRef = useRef({
    transactionDate: 0,
  });

  const { plans, loading } = useSubscriptionPlanList();
  const { subscriptions, fetchProducts, requestPurchase, connected, finishTransaction } = useIAP({
    onPurchaseError(error) {
      console.error('Purchase error:', error);
    },
    async onPurchaseSuccess(purchase) {
      console.log('Purchase update:', purchase);

      if (purchaseRef.current.transactionDate === purchase.transactionDate) {
        console.log('Duplicate purchase event detected, ignoring.');
        return;
      }
      purchaseRef.current.transactionDate = purchase.transactionDate;

      if (!['purchased', 'restored'].includes(purchase.purchaseState)) {
        console.warn('Purchase not completed. Current state:', purchase.purchaseState);
      } else {
        const success = await validatePurchaseOnServer(userId, purchase, client);

        if (success) {
          console.log('Purchase Successful', 'Thank you for your purchase!');
          paywallVisibility(false);
        } else {
          Alert.alert(
            'Purchase Failed',
            'There was an issue validating your purchase. Please try again later.'
          );
        }
      }

      await finishTransaction({ purchase, isConsumable: false });
    },
  });

  console.log('IAP connected:', connected);

  useEffect(() => {
    if (connected && !loading) {
      initConnection().then(() => {
        console.log('IAP connection initialized');
        console.log(
          'Fetching products for SKUs:',
          plans.map((plan) => plan.productId)
        );
        fetchProducts({ type: 'subs', skus: plans.map((plan) => plan.productId) });
      });
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
