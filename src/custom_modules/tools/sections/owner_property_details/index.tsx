import React, { useState } from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { Card } from '~/codidge_components/UI/card';
import SearchAddressAutoComplete from '../../widgets/searchAutoComplete';
import { PropertyOwnerResults } from './results';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { useLazyQuery } from '@apollo/client';
import { IProperty } from './interfaces';
import { getPropertyQuery } from './graphql/queries';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

interface PropertySearchData {
  address: string;
}

export const PropertyInfoScreen: React.FC = () => {
  const navigation = useNavigation();
  const [showResults, setShowResults] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PropertySearchData>({
    defaultValues: {
      address: '',
    },
  });

  const selectedAddress = watch('address'); // ✅ Watch address for button state

  const [getPropertyDetailsFn, { data, loading, error }] = useLazyQuery<{
    getPropertyData: IProperty;
  }>(getPropertyQuery, {
    fetchPolicy: 'network-only', // ✅ Always fetch from backend
  });

  const onSubmit = async (data: PropertySearchData) => {
    try {
      await getPropertyDetailsFn({
        variables: {
          propertyId: data.address,
          needOwnerContact: true,
        },
      });
      setShowResults(true);
    } catch (error) {
      console.log(':::error', error);
    }
  };

  return (
    <PageSafeContainer style={styles.container}>
      <Header title="Property/Owner Information" showBack onBack={() => navigation.goBack()} />

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
                  onChange(address);
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
        visible={showResults}
        onRequestClose={() => {
          setShowResults(false);
        }}>
        {data?.getPropertyData && (
          <PropertyOwnerResults
            dispose={() => {
              setShowResults(false);
            }}
            propertyData={data?.getPropertyData}
          />
        )}
      </Modal>
    </PageSafeContainer>
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
  searchButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
