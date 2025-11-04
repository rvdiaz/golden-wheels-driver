import Constants from 'expo-constants';
import { lazy } from 'react';

const LazyPricingPlanModal = lazy(() =>
  import('./pricingPlanModalReal').then((module) => ({ default: module.PricingPlanModal }))
);
const LazyPricingPlanModalStub = lazy(() =>
  import('./pricingPlanModalStub').then((module) => ({ default: module.PricingPlanModalStub }))
);

export const PricingPlanModal = () => {
  const isRunningOnExpo = Constants.appOwnership === 'expo';

  if (isRunningOnExpo) {
    console.log('Using PricingPlanModalStub for Expo environment');
    return <LazyPricingPlanModalStub />;
  }

  return <LazyPricingPlanModal />;
};
