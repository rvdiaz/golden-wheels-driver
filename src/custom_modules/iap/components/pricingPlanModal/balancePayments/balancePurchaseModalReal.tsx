import { initConnection, useIAP } from 'expo-iap';
import { userData } from '~/store/user';
import { useApolloClient, useReactiveVar } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { BalancePurchaseModalView } from './balancePurchaseModalView';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import * as Icons from 'lucide-react-native';
import { useInAppProductsList } from '~/custom_modules/iap/hooks/useSubscriptionPlanList';
import { validatePurchaseOnServer } from '~/custom_modules/iap/helper';

export const BalancePurchaseModalReal = () => {
  const [visible, setvisible] = useState(false);

  const user = useReactiveVar(userData);
  const userId = user?.id || '';

  const currentBalance = user?.balance?.amount || 0; // Get current balance from user state

  const purchaseRef = useRef({
    transactionDate: 0,
  });

  const client = useApolloClient();

  const { inApproducts } = useInAppProductsList();

  const { products, fetchProducts, requestPurchase, connected, finishTransaction } = useIAP({
    onPurchaseError(error) {
      console.error('Purchase error:', error);
      Alert.alert('Purchase Error', 'There was an issue processing your purchase.');
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
          console.log('Purchase Successful', 'Balance added to your account!');
          Alert.alert('Purchase Successful', 'Balance has been added to your account!', [
            {
              text: 'OK',
            },
          ]);
        } else {
          Alert.alert(
            'Purchase Failed',
            'There was an issue validating your purchase. Please contact support.'
          );
        }
      }

      await finishTransaction({ purchase, isConsumable: true }); // Note: consumable for balance credits
    },
  });

  console.log('IAP connected:', connected);

  useEffect(() => {
    if (connected) {
      initConnection().then(() => {
        console.log('IAP connection initialized');
        console.log(
          'Fetching products for SKUs:',
          inApproducts.map((option) => option.productId)
        );
        fetchProducts({
          type: 'in-app',
          skus: inApproducts.map((option) => option.productId),
        });
      });
    }
  }, [connected, fetchProducts]);

  // TODO: Fetch current balance from your user state or API
  useEffect(() => {
    // Example: setCurrentBalance(user?.balance || 0);
  }, [user]);

  if (inApproducts.length === 0) {
    return <></>;
  }

  return (
    <>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setvisible(true);
        }}
        activeOpacity={0.7}>
        <Icons.Plus size={20} color="#2B7FFF" />
      </TouchableOpacity>
      <BalancePurchaseModalView
        visible={visible}
        onClose={() => setvisible(false)}
        products={products}
        balanceOptions={inApproducts}
        currentBalance={currentBalance}
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
            type: 'in-app', // Note: 'inapp' for one-time purchases
          });
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
