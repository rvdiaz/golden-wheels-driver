// ~/components/StripeWrapper.tsx
import React from 'react';
import { useStripePublishableKey } from './useStripePublishableKey';

let StripeProvider: React.FC<{
  publishableKey: string;
  stripeAccountId?: string; // ← add
  children: React.ReactNode;
}> | null = null;

try {
  StripeProvider = require('@stripe/stripe-react-native').StripeProvider;
} catch {
  console.warn('[Stripe] Native module not available');
}

export const StripeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { publicKey, stripeAccountId } = useStripePublishableKey(); // ← destructure both

  if (!StripeProvider) return <>{children}</>;
  if (!publicKey) return <>{children}</>;

  return (
    <StripeProvider
      publishableKey={publicKey}
      {...(stripeAccountId ? { stripeAccountId } : {})} // ← pass only if oauth2
    >
      {children}
    </StripeProvider>
  );
};
