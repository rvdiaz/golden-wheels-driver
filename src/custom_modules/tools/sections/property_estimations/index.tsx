import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, StyleSheet, View, ScrollView } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import { Header } from '~/codidge_components/UI/header';
import SearchAddressAutoComplete from '../../components/searchAutoComplete';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import {
  IProperty,
  IPropertyInfo,
  PropertyEstimatorAvm,
} from '../owner_property_details/interfaces';
import { useLazyQuery } from '@apollo/client';
import * as Icons from 'lucide-react-native';
import { ResultsWrapper } from './results';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { getPropertyEstimationQuery } from '../../api/queries';

interface PropertySearchData {
  propData: {
    displayName: string;
    address: string;
    placeId: string;
    meta: any;
  };
}

export const PropertyEstimationsPage = () => {
  const navigation = useNavigation();

  const [showResults, setShowResults] = useState(false);

  const { control, handleSubmit, watch } = useForm<PropertySearchData>({
    defaultValues: {
      propData: {
        displayName: '',
        address: '',
        placeId: '',
        meta: '',
      },
    },
  });

  const selectedAddress = watch('propData');

  const [getPropertyDetailsFn, { data, loading }] = useLazyQuery<{
    getPropertyEstimations: {
      avm: PropertyEstimatorAvm;
      comps: IPropertyInfo[];
      property: IProperty;
    };
  }>(getPropertyEstimationQuery, {
    fetchPolicy: 'network-only',
  });

  const onSubmit = async (data: PropertySearchData) => {
    try {
      await getPropertyDetailsFn({
        variables: {
          propertyId: data.propData.placeId,
          propertyAddress: data.propData.address,
          needClosestProperties: true,
        },
      });
      setShowResults(true);
    } catch (error) {
      console.log(':::error', error);
    }
  };

  return (
    <PageSafeContainer style={styles.container}>
      <Header title="Quick CMA Tool" showBack onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.iconBadge}>
            <Icons.TrendingUp size={24} color="#3B82F6" />
          </View>
          <Text style={styles.heroTitle}>Comparative Market Analysis</Text>
          <Text style={styles.heroSubtitle}>
            Get instant property valuations with comparable sales data and market insights
          </Text>
        </View>

        <Card style={styles.searchCard}>
          <View style={styles.cardContent}>
            <View style={styles.labelContainer}>
              <Icons.Home size={18} color="#3B82F6" />
              <Text style={styles.sectionLabel}>Property Address</Text>
            </View>

            <Controller
              control={control}
              name="propData"
              render={({ field: { onChange } }) => (
                <SearchAddressAutoComplete
                  onSelection={(propData) => {
                    onChange(propData);
                  }}
                />
              )}
            />

            <PrimaryButton
              loading={loading}
              leftWidget={<Icons.Calculator size={20} color="white" />}
              title="Generate CMA Report"
              size={ButtonSize.LARGE}
              onPress={handleSubmit(onSubmit)}
              disabled={!selectedAddress}
            />

            {!selectedAddress && (
              <View style={styles.hintBox}>
                <Icons.Info size={14} color="#64748B" />
                <Text style={styles.hintText}>Enter a property address to generate analysis</Text>
              </View>
            )}
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Icons.Sparkles size={20} color="#F59E0B" />
            <Text style={styles.infoHeaderText}>Why Use Quick CMA?</Text>
          </View>
          <View style={styles.infoBenefits}>
            <View style={styles.benefitItem}>
              <Icons.Check size={16} color="#10B981" />
              <Text style={styles.benefitText}>Instant property valuations</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icons.Check size={16} color="#10B981" />
              <Text style={styles.benefitText}>Compare with recent sales</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icons.Check size={16} color="#10B981" />
              <Text style={styles.benefitText}>Professional presentation</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icons.Check size={16} color="#10B981" />
              <Text style={styles.benefitText}>Save time on market research</Text>
            </View>
          </View>
        </Card>
      </ScrollView>

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
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    paddingBottom: 12,
  },
  infoHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  infoBenefits: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#78350F',
    flex: 1,
  },
});
