import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';

export const ProductsPage = () => {
  const navigation = useNavigation();

  return (
    <PageSafeContainer>
      <Header
        onBack={() => {
          navigation.goBack();
        }}
        title="Products"
        showBack={true}
      />
      <View style={styles.container}>
        <Text>Products</Text>
      </View>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
