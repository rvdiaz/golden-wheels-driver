import { ApolloClient } from '@apollo/client';
import type { Purchase } from 'expo-iap';
import { validatePurchaseMutation } from './graphql';

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
          id: 'default',
        },
        userId,
        purchase: JSON.stringify(purchase),
      },
    });

    if (result.data?.validatePurchase?.status !== 'SUCCESS') {
      console.error('Server validation failed:', result.data?.validatePurchase?.error);
      return false;
    }
  } catch (error) {
    console.error('Error validating purchase on server:', error);
    return false;
  }
  return true;
};
