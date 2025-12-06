import React, { useState } from 'react';
import { StyleSheet, View, Modal, ScrollView } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { Card } from '~/codidge_components/UI/card';
import SearchAddressAutoComplete from '../../components/searchAutoComplete';
import { PropertyOwnerResults } from './results';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { useLazyQuery } from '@apollo/client';
import { IProperty } from './interfaces';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { getPropertyQuery } from '../../api/queries';

interface PropertySearchData {
  address: string;
}

export const PropertyInfoScreen: React.FC = () => {
  const navigation = useNavigation();
  const [showResults, setShowResults] = useState(true);

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

  const selectedAddress = watch('address');

  const [getPropertyDetailsFn, { data, loading }] = useLazyQuery<{
    getPropertyData: IProperty;
  }>(getPropertyQuery, {
    fetchPolicy: 'network-only',
  });

  const onSubmit = async (data: PropertySearchData) => {
    try {
      await getPropertyDetailsFn({
        variables: {
          propertyId: data.address,
          needOwnerContact: false,
        },
      });
      setShowResults(true);
    } catch (error) {
      console.log(':::error', error);
    }
  };

  return (
    <PageSafeContainer style={styles.container}>
      <Header title="Property & Owner Info" showBack onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.iconBadge}>
            <Icons.Building2 size={24} color="#3B82F6" />
          </View>
          <Text style={styles.heroTitle}>Property Lookup</Text>
          <Text style={styles.heroSubtitle}>
            Search any property address to access detailed ownership and property information
          </Text>
        </View>

        <Card style={styles.searchCard}>
          <View style={styles.cardContent}>
            <View style={styles.labelContainer}>
              <Icons.MapPin size={18} color="#3B82F6" />
              <Text style={styles.sectionLabel}>Property Address</Text>
            </View>

            <Controller
              control={control}
              name="address"
              render={({ field: { onChange } }) => (
                <SearchAddressAutoComplete
                  onSelection={(address) => {
                    onChange(address.placeId);
                  }}
                />
              )}
            />

            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Icons.Check size={16} color="#10B981" />
                <Text style={styles.featureText}>Owner contact information</Text>
              </View>
              <View style={styles.featureItem}>
                <Icons.Check size={16} color="#10B981" />
                <Text style={styles.featureText}>Property details & valuation</Text>
              </View>
              <View style={styles.featureItem}>
                <Icons.Check size={16} color="#10B981" />
                <Text style={styles.featureText}>Sales history & tax records</Text>
              </View>
            </View>

            <PrimaryButton
              loading={loading}
              leftWidget={<Icons.Search size={20} color="white" />}
              title="Get Property Details"
              size={ButtonSize.LARGE}
              onPress={handleSubmit(onSubmit)}
              disabled={!selectedAddress}
            />

            {!selectedAddress && (
              <View style={styles.hintBox}>
                <Icons.Info size={14} color="#64748B" />
                <Text style={styles.hintText}>Start typing an address to begin your search</Text>
              </View>
            )}
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <View style={styles.infoCardContent}>
            <View style={styles.infoIconContainer}>
              <Icons.Shield size={20} color="#3B82F6" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Secure & Reliable Data</Text>
              <Text style={styles.infoDescription}>
                All property information is sourced from public records and verified databases
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {data?.getPropertyData && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showResults}
          onRequestClose={() => {
            setShowResults(false);
          }}>
          <PropertyOwnerResults
            dispose={() => {
              setShowResults(false);
            }}
            propertyData={data?.getPropertyData}
          />
        </Modal>
      )}
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  searchCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    padding: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  featureList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    gap: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
  },
  hintText: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  infoCardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 2,
  },
  infoDescription: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
    opacity: 0.8,
  },
});
