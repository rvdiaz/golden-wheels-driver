import React from 'react';
import { Property } from './property';
import { IProperty } from '../interfaces';
import { MlsHistoryList } from './mlsHistory';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { RequestOwnerModal } from './owner/requestOwnerModal';

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
          {propertyData?.mlsHistory?.length > 0 && (
            <MlsHistoryList mlsHistory={propertyData.mlsHistory} />
          )}
        </View>
      </ScrollView>
      <RequestOwnerModal
        address={propertyData.propertyInfo.address.address}
        city={propertyData.propertyInfo.address.city}
        first_name=""
        last_name=""
        state={propertyData.propertyInfo.address.state}
        zip={propertyData.propertyInfo.address.zip}
        feature="propDetail"
      />
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
