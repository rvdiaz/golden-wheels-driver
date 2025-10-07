import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';

export const IARolePlayingPage = () => {
  const navigation = useNavigation();
  return (
    <PageSafeContainer>
      <Header
        title="IA Role Playing"
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <Text>IA Role Playing</Text>
    </PageSafeContainer>
  );
};
