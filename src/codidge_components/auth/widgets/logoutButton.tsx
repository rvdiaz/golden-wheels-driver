import React, { useState } from 'react';
import * as Icons from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useApolloClient, useMutation, useReactiveVar } from '@apollo/client';
import { signOut } from 'aws-amplify/auth/cognito';
import { updateUser } from '~/store/user';
import { theme } from '~/theme/theme';
import { apiKeyClient } from '~/store/config/apolloClient';
import { pushTokenVar } from '~/store/user/pushToken';
import { ENV_Vars } from '~/store/env';
import { unregisterDeviceTokenCodidgeMutation } from '~/screens/auth/graphql/mutations.notifications';
import TextButton from '~/codidge_components/UI/button/TextButton';
import { useTranslation } from '~/i18n';

export const LogoutButton = ({ onSuccessLogout }: { onSuccessLogout?: () => void }) => {
  const { t } = useTranslation();
  const [loadingLogout, setloadingLogout] = useState(false);
  const client = useApolloClient();
  const pushToken = useReactiveVar(pushTokenVar);
  const [unregisterDeviceTokenFn] = useMutation(unregisterDeviceTokenCodidgeMutation);

  const handleSignOut = async () => {
    try {
      setloadingLogout(true);

      // Before signOut, not after: the resolver identifies the device by the caller's Cognito
      // token, which is gone the moment the session ends. Failure is swallowed — a device left
      // registered is a nuisance (the next driver on this phone sees stale trip alerts until
      // Expo reports the token dead), not a reason to block someone from signing out.
      if (pushToken) {
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
      setloadingLogout(false);
      if (onSuccessLogout) {
        onSuccessLogout();
      }
    } catch (error) {
      setloadingLogout(false);
    }
  };

  return (
    <TextButton
      onPress={handleSignOut}
      leftWidget={<Icons.LogOut color={theme.colors.danger} size={24} />}
      title={t('account.signOut')}
      style={{
        paddingVertical: 16,
      }}
      loading={loadingLogout}
      textStyle={styles.menuText}
    />
  );
};

const styles = StyleSheet.create({
  menuText: {
    fontSize: 16,
    color: theme.colors.danger,
    marginLeft: 12,
  },
});
