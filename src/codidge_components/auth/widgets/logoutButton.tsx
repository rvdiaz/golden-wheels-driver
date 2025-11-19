import React, { useState } from 'react';
import * as Icons from 'lucide-react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useApolloClient } from '@apollo/client';
import { signOut } from 'aws-amplify/auth/cognito';
import { updateUser } from '~/store/user';
import Text from '~/codidge_components/UI/text';
import { apiKeyClient } from '~/store/config/apolloClient';
import { theme } from '~/theme/theme';

export const LogoutButton = () => {
  const [loadingLogout, setloadingLogout] = useState(false);
  const client = useApolloClient();

  const handleSignOut = async () => {
    try {
      setloadingLogout(true);
      await signOut();
      updateUser('');
      await client.clearStore(); // Clears all cached data
      await apiKeyClient.clearStore();
      setloadingLogout(false);
    } catch (error) {
      setloadingLogout(false);
    }
  };

  return (
    <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleSignOut}>
      <Icons.LogOut color={theme.colors.danger} size={24} />
      <Text style={[styles.menuText]}>{loadingLogout ? 'Signing out' : 'Sign Out'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginLeft: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginVertical: 10,
  },
  menuText: {
    fontSize: 16,
    color: theme.colors.danger,
    marginLeft: 12,
  },
});
