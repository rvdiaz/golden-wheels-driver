import Constants from 'expo-constants';
import { lazy } from 'react';

const LazyBalancePurchaseModalStub = lazy(() =>
  import('./balancePurchaseModalStub').then((module) => ({
    default: module.BalancePurchaseModalStub,
  }))
);

const BalancePurchaseModalReal = lazy(() =>
  import('./balancePurchaseModalReal').then((module) => ({
    default: module.BalancePurchaseModalReal,
  }))
);

export const BalancePurchasePricingPlanModal = () => {
  const isRunningOnExpo = Constants.appOwnership === 'expo';

  if (isRunningOnExpo) {
    return <LazyBalancePurchaseModalStub />;
  }

  return <BalancePurchaseModalReal />;
};
