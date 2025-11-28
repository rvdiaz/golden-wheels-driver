import { initConnection, useIAP } from 'expo-iap';
import { userData } from '~/store/user';
import { useApolloClient, useReactiveVar } from '@apollo/client';
import { useEffect, useRef } from 'react';
import { BalancePurchaseModalView, BalancePurchaseOption } from './balancePurchaseModalView';
import { Alert } from 'react-native';

// Example balance purchase options configuration
const BALANCE_OPTIONS: BalancePurchaseOption[] = [
  {
    productId: 'balance_5',
    name: 'Starter',
    description: 'Perfect for getting started',
    price: 4.99,
    balanceAmount: 5.0,
    features: ['Instant credit', 'No expiration', 'Secure payment'],
  },
  {
    productId: 'balance_10',
    name: 'Basic',
    description: 'Great for regular use',
    price: 9.99,
    balanceAmount: 10.0,
    bonusPercentage: 5,
    features: ['Instant credit', 'No expiration', 'Secure payment', '5% bonus balance'],
  },
  {
    productId: 'balance_25',
    name: 'Popular',
    description: 'Most popular choice',
    price: 24.99,
    balanceAmount: 25.0,
    bonusPercentage: 10,
    badge: 'SAVE 10%',
    isPopular: true,
    features: [
      'Instant credit',
      'No expiration',
      'Secure payment',
      '10% bonus balance',
      'Priority support',
    ],
  },
  {
    productId: 'balance_50',
    name: 'Pro',
    description: 'Best value for power users',
    price: 49.99,
    balanceAmount: 50.0,
    bonusPercentage: 20,
    badge: 'BEST VALUE',
    features: [
      'Instant credit',
      'No expiration',
      'Secure payment',
      '20% bonus balance',
      'Priority support',
      'Exclusive features',
    ],
  },
  {
    productId: 'balance_100',
    name: 'Ultimate',
    description: 'Maximum balance boost',
    price: 99.99,
    balanceAmount: 100.0,
    bonusPercentage: 25,
    badge: 'MAX BONUS',
    features: [
      'Instant credit',
      'No expiration',
      'Secure payment',
      '25% bonus balance',
      'VIP support',
      'Exclusive features',
      'Early access to new features',
    ],
  },
];

export const BalancePurchaseModalReal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const user = useReactiveVar(userData);
  const userId = user?.id || '';

  const client = useApolloClient();

  const currentBalance = user?.balance?.amount || 0; // Get current balance from user state

  const purchaseRef = useRef({
    transactionDate: 0,
  });

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
        // TODO: Implement your server validation logic here
        // const success = await validatePurchaseOnServer(userId, purchase, client);

        const success = true; // Placeholder

        if (success) {
          console.log('Purchase Successful', 'Balance added to your account!');
          Alert.alert('Purchase Successful', 'Balance has been added to your account!', [
            {
              text: 'OK',
              onPress: () => {
                onClose();
                // TODO: Refresh user balance from server
              },
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
          BALANCE_OPTIONS.map((option) => option.productId)
        );
        fetchProducts({
          type: 'inapp', // Note: 'inapp' for one-time purchases, not 'subs'
          skus: BALANCE_OPTIONS.map((option) => option.productId),
        });
      });
    }
  }, [connected, fetchProducts]);

  // TODO: Fetch current balance from your user state or API
  useEffect(() => {
    // Example: setCurrentBalance(user?.balance || 0);
  }, [user]);

  return (
    <BalancePurchaseModalView
      visible={visible}
      onClose={() => onClose()}
      products={[]}
      balanceOptions={BALANCE_OPTIONS}
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
  );
};
