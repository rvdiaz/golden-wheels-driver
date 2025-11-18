import { makeVar } from '@apollo/client';

interface ISubscriptionStatus {
  hasActiveSubscription: boolean;
  expiryDate?: Date;
  planName?: string;
}

export const subscriptionStatusData = makeVar<ISubscriptionStatus>({
  hasActiveSubscription: false,
});

export const updateSubscriptionStatus = (status?: ISubscriptionStatus) => {
  subscriptionStatusData(status);
};

export const paywallVisibility = makeVar<boolean>(false);

export const setPaywallVisibility = (visible: boolean) => {
  paywallVisibility(visible);
};
