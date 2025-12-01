import { ApolloClient } from '@apollo/client';
import type { Purchase } from 'expo-iap';
import { validatePurchaseMutation } from './graphql';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { IAppPaymentProducts, IAppProductType } from './interfaces';

const tenantId = Constants.expoConfig?.extra?.TENANTID;
const appAppleId = Constants.expoConfig?.extra?.APPLE_APP_ID;

export const validatePurchaseOnServer = async (
  userId: string,
  purchase: Purchase,
  client: ApolloClient
): Promise<boolean> => {
  try {
    const result = await client.mutate({
      mutation: validatePurchaseMutation,
      variables: {
        tenant: {
          tenantId,
        },
        userId,
        appAppleId,
        platform: Platform.OS,
        purchase: JSON.stringify(purchase),
      },
    });

    console.log('Server validation result:', result.data);

    if (result.data?.validatePurchase?.status !== 'VALIDATED') {
      console.error('Server validation failed:', result.data?.validatePurchase?.error);
      return false;
    }
  } catch (error) {
    console.error('Error validating purchase on server:', error);
    return false;
  }
  return true;
};

export const isSubscription = (prod: IAppPaymentProducts) => {
  return prod.type === IAppProductType.subscription;
};
