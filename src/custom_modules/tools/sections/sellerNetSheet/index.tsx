import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';

export const SellerNetSheetPage = () => {
  const navigation = useNavigation();

  return (
    <PageSafeContainer>
      <Header
        title="Seller Net Sheet"
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <Text>Seller Net Sheet</Text>
    </PageSafeContainer>
  );
};
