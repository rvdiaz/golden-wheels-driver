import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';

export const CmaComparativesPage = () => {
  const navigation = useNavigation();
  return (
    <PageSafeContainer>
      <Header
        title="CMA"
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <Text>CMA</Text>
    </PageSafeContainer>
  );
};
