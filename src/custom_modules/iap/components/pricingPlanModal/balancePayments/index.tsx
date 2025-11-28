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

export const BalancePurchasePricingPlanModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const isRunningOnExpo = Constants.appOwnership === 'expo';

  if (isRunningOnExpo) {
    return <LazyBalancePurchaseModalStub onClose={onClose} visible={visible} />;
  }

  return <BalancePurchaseModalReal visible={visible} onClose={onClose} />;
};
