import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { MarketValueCard } from './mainEstimation';
import {
  IProperty,
  IPropertyInfo,
  PropertyEstimatorAvm,
} from '../../owner_property_details/interfaces';
import { CompsProperties } from './compsProperties';

export const ResultsWrapper = ({
  dispose,
  estimationResults,
}: {
  dispose: () => void;
  estimationResults: {
    property: IProperty;
    avm: PropertyEstimatorAvm;
    comps: IPropertyInfo[];
  };
}) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'flex-end' }}>
      <Header
        title="Quick CMA Tool"
        rightText="Close"
        rightAction={() => {
          dispose();
        }}
      />
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <MarketValueCard
          averageValue={estimationResults.avm.avm}
          propertyInfo={estimationResults.property.propertyInfo}
        />
        <CompsProperties propertiesComps={estimationResults.comps} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    marginTop: 10,
  },
});
