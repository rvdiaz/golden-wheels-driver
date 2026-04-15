// ~/components/StripeWrapper.tsx
import React from 'react';
import { useStripePublishableKey } from './useStripePublishableKey';

let StripeProvider: React.FC<{ publishableKey: string; children: React.ReactNode }> | null = null;
try {
  StripeProvider = require('@stripe/stripe-react-native').StripeProvider;
} catch {
  console.warn('[Stripe] Native module not available');
}

export const StripeWrapper = ({ children }: { children: React.ReactNode }) => {
  const publishableKey = useStripePublishableKey();

  // No Stripe native module — just render children
  if (!StripeProvider) return <>{children}</>;

  // Key not yet fetched — render children without Stripe
  // (payment screen will be unreachable until user is logged in anyway)
  if (!publishableKey) return <>{children}</>;

  return <StripeProvider publishableKey={publishableKey}>{children}</StripeProvider>;
};
