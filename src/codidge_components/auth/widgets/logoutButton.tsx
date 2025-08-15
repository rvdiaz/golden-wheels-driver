import React, { useState } from 'react';
import * as Icons from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useApolloClient } from '@apollo/client';
import { signOut } from 'aws-amplify/auth/cognito';
import { updateUser } from '~/store/user';

export const LogoutButton = () => {
  const [loadingLogout, setloadingLogout] = useState(false);
  const client = useApolloClient();

  const handleSignOut = async () => {
    try {
      setloadingLogout(true);
      await signOut();
      updateUser(null);
      await client.clearStore(); // Clears all cached data
      setloadingLogout(false);
    } catch (error) {
      setloadingLogout(false);
    }
  };

  return (
    <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleSignOut}>
      <Icons.LogOut size={20} color="#EF4444" />
      <Text style={[styles.menuText, { color: '#EF4444' }]}>
        {loadingLogout ? 'Signing out' : 'Sign Out'}
      </Text>
      <Icons.ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
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
