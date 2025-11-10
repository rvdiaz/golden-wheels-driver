import { makeVar } from '@apollo/client';

interface ISubscriptionStatus {
  hasSubscription: boolean;
  expiryDate?: string;
  planName?: string;
}

export const subscriptionStatusData = makeVar<ISubscriptionStatus>({ hasSubscription: false });

export const updateSubscriptionStatus = async (status?: ISubscriptionStatus) => {
  subscriptionStatusData(status);
};

export const paywallVisibility = makeVar<boolean>(false);

export const setPaywallVisibility = (visible: boolean) => {
  paywallVisibility(visible);
};
