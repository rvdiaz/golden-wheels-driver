import { useQuery } from '@apollo/client';
import { IAppPaymentProducts } from '../interfaces';
import { getAppPaymentProductsQuery } from '../graphql';
import Constants from 'expo-constants';
import { useMemo } from 'react';
import { apiKeyClient } from '~/store/config/apolloClient';
import { isSubscription } from '../helper';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

// Hook to get all IAP products
export const usePurchaseProducts = () => {
  const { data, loading, error, refetch } = useQuery<{
    getAppPaymentProductsPlans: IAppPaymentProducts[];
  }>(getAppPaymentProductsQuery, {
    variables: {
      tenant: { tenantId },
      active: true,
    },
    client: apiKeyClient,
  });

  const sortedProducts = useMemo(() => {
    return data?.getAppPaymentProductsPlans
      ? [...data.getAppPaymentProductsPlans].sort((a, b) => a.order - b.order)
      : [];
  }, [data?.getAppPaymentProductsPlans]);

  return {
    products: sortedProducts,
    loading,
    error,
    refetch,
  };
};

export const useAllProducts = () => {
  const { products, loading, error, refetch } = usePurchaseProducts();

  const categorized = useMemo(() => {
    const subscriptions: IAppPaymentProducts[] = [];
    const inAppProducts: IAppPaymentProducts[] = [];

    products.forEach((product) => {
      if (isSubscription(product)) {
        subscriptions.push(product);
      } else if (isSubscription(product)) {
        inAppProducts.push(product);
      }
    });

    return { subscriptions, inAppProducts };
  }, [products]);

  return {
    allProducts: products,
    subscriptions: categorized.subscriptions,
    inAppProducts: categorized.inAppProducts,
    loading,
    error,
    refetch,
  };
};

export const useSubscriptionPlanList = () => {
  const { subscriptions, loading } = useAllProducts();

  const sortedPlans = useMemo(() => {
    return subscriptions ? [...subscriptions].sort((a, b) => a.order - b.order) : [];
  }, [subscriptions]);

  return { plans: sortedPlans, loading };
};

export const useInAppProductsList = () => {
  const { inAppProducts, loading } = useAllProducts();

  const inApproducts = useMemo(() => {
    return inAppProducts ? [...inAppProducts].sort((a, b) => a.order - b.order) : [];
  }, [inAppProducts]);

  return { inApproducts: inApproducts, loading };
};
