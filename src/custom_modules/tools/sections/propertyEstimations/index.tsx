import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import { Header } from '~/codidge_components/UI/header';
import SearchAddressAutoComplete from '../../widgets/searchAutoComplete';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import {
  IProperty,
  IPropertyInfo,
  PropertyEstimatorAvm,
} from '../owner_property_details/interfaces';
import { useLazyQuery } from '@apollo/client';
import { getPropertyEstimationQuery } from '../owner_property_details/graphql/queries';
import * as Icons from 'lucide-react-native';
import { ResultsWrapper } from './results';

interface PropertySearchData {
  address: string;
}

export const PropertyEstimationsPage = () => {
  const navigation = useNavigation();

  const [showResults, setShowResults] = useState(false);

  const { control, handleSubmit, watch } = useForm<PropertySearchData>({
    defaultValues: {
      address: '',
    },
  });

  const selectedAddress = watch('address'); // ✅ Watch address for button state

  const [getPropertyDetailsFn, { data, loading, error }] = useLazyQuery<{
    getPropertyEstimations: {
      avm: PropertyEstimatorAvm;
      comps: IPropertyInfo[];
      property: IProperty;
    };
  }>(getPropertyEstimationQuery, {
    fetchPolicy: 'network-only', // ✅ Always fetch from backend
  });

  const onSubmit = async (data: PropertySearchData) => {
    try {
      await getPropertyDetailsFn({
        variables: {
          propertyId: data.address,
          needClosestProperties: true,
        },
      });
      setShowResults(true);
    } catch (error) {
      console.log(':::error', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Quick CMA Tool" showBack onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Card style={styles.searchCard}>
          <Text style={styles.cardTitle}>Property Lookup</Text>
          <Text style={styles.cardSubtitle}>
            Enter the property address to get owner and property information
          </Text>

          {/* ✅ React Hook Form Controlled AutoComplete */}
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange } }) => (
              <SearchAddressAutoComplete
                onSelection={(address) => {
                  onChange(address); // ✅ Update form value
                }}
              />
            )}
          />
          <PrimaryButton
            loading={loading}
            style={{
              marginTop: 10,
            }}
            leftWidget={<Icons.Search size={20} color="white" />}
            title="Search Results"
            size={ButtonSize.LARGE}
            onPress={handleSubmit(onSubmit)}
            disabled={!selectedAddress} // ✅ Disabled if no address
          />
        </Card>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!data?.getPropertyEstimations && showResults}
        onRequestClose={() => {
          setShowResults(false);
        }}>
        <ResultsWrapper
          estimationResults={data?.getPropertyEstimations!}
          dispose={() => {
            setShowResults(false);
          }}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
    overflow: 'visible',
  },
  searchCard: {
    padding: 20,
    marginBottom: 16,
    overflow: 'visible',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
});
