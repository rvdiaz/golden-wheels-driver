import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { paywallVisibility, subscriptionStatusData } from '~/store/subscription';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import TextButton from '~/codidge_components/UI/button/TextButton';

export const SubscriptionButton = () => {
  const { hasActiveSubscription: hasSubscription } = useReactiveVar(subscriptionStatusData);

  if (hasSubscription) {
    return null; // Don't show the button if the user is already subscribed
  }

  return (
    <TextButton
      onPress={() => paywallVisibility(true)}
      size={ButtonSize.LARGE}
      title="Unlock all Premium Features!"
    />
  );
};
