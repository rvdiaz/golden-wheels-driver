import React, { useState } from 'react';
import * as Icons from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useApolloClient } from '@apollo/client';
import { signOut } from 'aws-amplify/auth/cognito';
import { updateUser } from '~/store/user';
import { theme } from '~/theme/theme';
import { apiKeyClient } from '~/store/config/apolloClient';
import TextButton from '~/codidge_components/UI/button/TextButton';

export const LogoutButton = ({ onSuccessLogout }: { onSuccessLogout?: () => void }) => {
  const [loadingLogout, setloadingLogout] = useState(false);
  const client = useApolloClient();

  const handleSignOut = async () => {
    try {
      setloadingLogout(true);
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
      title="Sign Out"
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
