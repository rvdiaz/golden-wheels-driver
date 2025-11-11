import React, { useState } from 'react';
import { Property } from './property';
import { IProperty } from '../interfaces';
import { Owner } from './owner';
import { MlsHistoryList } from './mlsHistory';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

export const PropertyOwnerResults = ({
  propertyData,
  dispose,
}: {
  propertyData: IProperty;
  dispose: () => void;
}) => {
  return (
    <PageSafeContainer style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'flex-end' }}>
      <Header
        title=""
        showBack={true}
        onBack={dispose}
        rightText={propertyData.propertyInfo.address.address}
        rightAction={() => {}}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Property propertyData={propertyData} />
          <Owner ownerInfo={propertyData.ownerInfo} />
          {propertyData?.mlsHistory?.length > 0 && (
            <MlsHistoryList mlsHistory={propertyData.mlsHistory} />
          )}
        </View>
      </ScrollView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    marginTop: 16,
    paddingHorizontal: 16,
  },
});
