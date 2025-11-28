import { requestPurchase } from 'expo-iap';
import { userData } from '~/store/user';
import { useApolloClient, useReactiveVar } from '@apollo/client';
import { useEffect, useRef } from 'react';
import { BalancePurchaseModalView, BalancePurchaseOption } from './balancePurchaseModalView';

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

export const BalancePurchaseModalStub = ({
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

  return (
    <BalancePurchaseModalView
      visible={visible}
      onClose={() => onClose()}
      products={[]}
      balanceOptions={BALANCE_OPTIONS}
      currentBalance={currentBalance}
      requestPurchase={(sku) => {
       console.log(":::::")
      }}
    />
  );
};

// Example: How to open the modal from another component
// import { BalancePurchaseModal } from './BalancePurchaseModal';
//
// <Button onPress={() => setBalancePurchaseModalVisible(true)}>
//   Add Balance
// </Button>
