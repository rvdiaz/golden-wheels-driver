import React, { useState } from 'react';
import { Property } from './property';
import { IProperty } from '../interfaces';
import { Owner } from './owner';
import { MlsHistoryList } from './mlsHistory';
import { Modal, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { Share } from 'lucide-react-native';
import { ShareModalPropertyDetails } from './shareModal';

export const PropertyOwnerResults = ({
  propertyData,
  dispose,
}: {
  propertyData: IProperty;
  dispose: () => void;
}) => {
  const [shareModalVisible, setShareModalVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'flex-end' }}>
      <Header title="Mortgage Results" rightText="Close" rightAction={dispose} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Property propertyData={propertyData} />
          <Owner ownerInfo={propertyData.ownerInfo} />
          {propertyData?.mlsHistory?.length > 0 && (
            <MlsHistoryList mlsHistory={propertyData.mlsHistory} />
          )}
        </View>
      </ScrollView>
      <PrimaryButton
        size={ButtonSize.LARGE}
        style={{
          paddingVertical: 16,
          marginHorizontal: 16,
        }}
        title="Send Results"
        onPress={() => {
          setShareModalVisible(true);
        }}
        rightWidget={<Share size={16} color="#FFF" style={{ marginLeft: 10 }} />}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={shareModalVisible}
        onRequestClose={() => setShareModalVisible(false)}>
        <ShareModalPropertyDetails
          cancel={() => {
            setShareModalVisible(false);
          }}
        />
      </Modal>
    </SafeAreaView>
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
