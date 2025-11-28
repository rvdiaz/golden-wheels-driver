import { userData } from '~/store/user';
import { useReactiveVar } from '@apollo/client';
import { Platform } from 'react-native';
import { ProductSubscription } from 'expo-iap';
import { useSubscriptionPlanList } from '~/custom_modules/iap/hooks/useSubscriptionPlanList';
import { PricingPlanModalView } from '../../pricingPlanModalView';

export const PricingPlanModalStub = () => {
  const user = useReactiveVar(userData);
  const userId = user?.id || '';

  const { plans } = useSubscriptionPlanList();

  const subscriptions: ProductSubscription[] = plans.map((plan) => ({
    currency: 'USD',
    price: plan.price,
    description: plan.description || '',
    title: plan.name || '',
    productId: plan.productId || '',
    displayNameIOS: plan.name || '',
    localizedPrice: `$${plan.price?.toFixed(2)}` || '$0.00',
    displayPrice: `$${plan.price?.toFixed(2)}` || '$0.00',
    id: plan.productId || '',
    isFamilyShareableIOS: false,
    jsonRepresentationIOS: '',
    nameAndroid: plan.name || '',
    platform: (['android', 'ios'] as const).includes(Platform.OS as 'android' | 'ios')
      ? (Platform.OS as 'android' | 'ios')
      : 'ios',
    type: 'subs' as const,
    typeIOS: 'subs' as const,
    subscriptionOfferDetailsAndroid: [],
  }));

  return (
    <PricingPlanModalView
      subscriptions={subscriptions}
      requestPurchase={(sku) => {
        console.log(`Requesting purchase for SKU: ${sku}, User ID: ${userId}`);
      }}
    />
  );
};
