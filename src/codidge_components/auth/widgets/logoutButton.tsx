import React, { useState } from 'react';
import * as Icons from 'lucide-react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useApolloClient } from '@apollo/client';
import { signOut } from 'aws-amplify/auth/cognito';
import { updateUser } from '~/store/user';
import Text from '~/codidge_components/UI/text';
import { apiKeyClient } from '~/store/config/apolloClient';

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
      <Icons.LogOut size={24} />
      <Text style={[styles.menuText]}>{loadingLogout ? 'Signing out' : 'Sign Out'}</Text>
      <Icons.ChevronRight size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginLeft: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
});
