import { useCallback } from 'react';
import { useApolloClient, useMutation, useReactiveVar } from '@apollo/client';
import { signOut } from 'aws-amplify/auth/cognito';
import { updateUser } from '~/store/user';
import { apiKeyClient } from '~/store/config/apolloClient';
import { pushTokenVar } from '~/store/user/pushToken';
import { ENV_Vars } from '~/store/env';
import { unregisterDeviceTokenCodidgeMutation } from '~/screens/auth/graphql/mutations.notifications';

/**
 * Ends the session and clears everything tied to it. Shared by Sign Out and by account
 * deletion, which must leave the phone in exactly the same state.
 */
export const useSignOut = () => {
  const client = useApolloClient();
  const pushToken = useReactiveVar(pushTokenVar);
  const [unregisterDeviceTokenFn] = useMutation(unregisterDeviceTokenCodidgeMutation);

  const signOutAndClear = useCallback(
    async ({ unregisterDevice = true }: { unregisterDevice?: boolean } = {}) => {
      // Before signOut, not after: the resolver identifies the device by the caller's Cognito
      // token, which is gone the moment the session ends. Failure is swallowed — a device left
      // registered is a nuisance (the next driver on this phone sees stale trip alerts until
      // Expo reports the token dead), not a reason to block someone from signing out.
      if (unregisterDevice && pushToken) {
        try {
          await unregisterDeviceTokenFn({
            variables: { organizationID: ENV_Vars.ORGANIZATION_ID, token: pushToken },
          });
        } catch (error) {
          console.warn('⚠️ Could not unregister device for push notifications:', error);
        }
      }

      await signOut();
      updateUser(null);
      await client.clearStore(); // Clears all cached data
      await apiKeyClient.clearStore();
    },
    [client, pushToken, unregisterDeviceTokenFn]
  );

  return { signOutAndClear };
};
