import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AccountDeletionModal } from '../accountDeletion';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { theme } from '~/theme/theme';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';

export const UserDeletionScreen = () => {
  const navigation = useNavigation();

  return (
    <PageSafeContainer style={styles.container}>
      <Header title="Account" showBack onBack={() => navigation.goBack()} />
      <View
        style={{
          padding: 16,
        }}>
        <AccountDeletionModal />
      </View>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSectionsBackgroundColor,
  },
});
