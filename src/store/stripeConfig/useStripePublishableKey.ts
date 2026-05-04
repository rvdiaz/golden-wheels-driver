// ~/hooks/useStripeInit.ts
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { useQuery } from '@apollo/client';
import { ENV_Vars } from '~/store/env';
import { getPaymentPublisCredentialsQuery } from './queries';

export const useStripePublishableKey = () => {
  const user = useReactiveVar(userData);

  const { data } = useQuery(getPaymentPublisCredentialsQuery, {
    variables: { tenant: ENV_Vars.tenant },
    skip: !user, // only fetch when logged in
  });

  return {
    publicKey: data?.getPaymentPublisCredentials?.publicKey ?? null,
    stripeAccountId: data?.getPaymentPublisCredentials?.stripeAccountId ?? null, // ← add
  };
};
