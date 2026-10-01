import React, { useState } from 'react';
import * as Icons from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { theme } from '~/theme/theme';
import TextButton from '~/codidge_components/UI/button/TextButton';
import { useTranslation } from '~/i18n';
import { useSignOut } from '../hooks/useSignOut';

export const LogoutButton = ({ onSuccessLogout }: { onSuccessLogout?: () => void }) => {
  const { t } = useTranslation();
  const [loadingLogout, setloadingLogout] = useState(false);
  const { signOutAndClear } = useSignOut();

  const handleSignOut = async () => {
    try {
      setloadingLogout(true);
      await signOutAndClear();
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
