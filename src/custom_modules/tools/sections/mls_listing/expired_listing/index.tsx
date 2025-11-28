import { useLazyQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { ExpiredStatus, IExpiredListingForm, IMlsListingItemResponse } from '../interfaces';
import { Controller, useForm } from 'react-hook-form';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';
import { Card } from '~/codidge_components/UI/card';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { MapPin } from 'lucide-react-native';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/OutlineButton';
import * as Icons from 'lucide-react-native';
import PropertyListScreen from './results/expiredListingListContainer';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { getMlsListingQuery } from '~/custom_modules/tools/api/queries';

const iconsSize = 16;
const pageSize = 20;

export const ExpiredListingPage = () => {
  const navigation = useNavigation();
  const [showResults, setShowResults] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [getExpiredListingFn, { data, loading }] = useLazyQuery<{
    getMlsListing: {
      listings: IMlsListingItemResponse[];
      indexCount: number;
    };
  }>(getMlsListingQuery, {
    fetchPolicy: 'network-only',
  });

  const [results, setResults] = useState<IMlsListingItemResponse[]>([]);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IExpiredListingForm>({
    defaultValues: {
      daysOld: 10,
      zipCode: '',
    },
  });

  const onSubmit = async (formData: IExpiredListingForm) => {
    try {
      setShowResults(false);
      const res = await getExpiredListingFn({
        variables: {
          input: {
            zipCode: formData.zipCode,
            daysOld: formData.daysOld,
            status: ExpiredStatus.active,
            pageSize,
            indexCount: 0,
            sold: false,
          },
        },
      });
      setResults(res.data?.getMlsListing?.listings ?? []); // replace with new search
      setShowResults(true);
    } catch (error) {
      console.log(':::error', error);
    }
  };

  const fetchMoreResults = async () => {
    const zipCode = getValues('zipCode');
    const daysOld = getValues('daysOld');
    setLoadingMore(true);

    if (data?.getMlsListing.indexCount !== 0 && !!data?.getMlsListing.indexCount) {
      const res = await getExpiredListingFn({
        variables: {
          input: {
            zipCode: zipCode ?? '',
            daysOld: daysOld ?? 10,
            status: ExpiredStatus.active,
            pageSize,
            indexCount: data?.getMlsListing.indexCount ?? 0,
            sold: false,
          },
        },
      });

      if (res.data?.getMlsListing?.listings && res.data?.getMlsListing?.listings.length > 0) {
        setResults((prev) => [...prev, ...(res.data?.getMlsListing?.listings ?? [])]); // append
      }
    }

    setLoadingMore(false);
  };

  const ceroResults =
    data?.getMlsListing.listings.length === 0 && results.length === 0 && showResults;

  return (
    <PageSafeContainer style={styles.container}>
      <Header title="Expired Listings" showBack onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.iconBadge}>
            <Icons.Home size={24} color="#3B82F6" />
          </View>
          <Text style={styles.heroTitle}>Find Expired Listings</Text>
          <Text style={styles.heroSubtitle}>
            Discover expired property listings in your target area and connect with potential
            clients
          </Text>
        </View>

        <Card style={styles.cardContainer}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.sectionLabel}>Search Parameters</Text>
              <Controller
                control={control}
                name="zipCode"
                rules={{ required: 'ZIP code is required' }}
                render={({ field: { value, onChange } }) => (
                  <InputField
                    leftIcon={<MapPin size={iconsSize} color="#3B82F6" />}
                    label="ZIP Code"
                    placeholder="Enter ZIP code"
                    keyboardType="number-pad"
                    value={value?.toString()}
                    onChangeText={onChange}
                    error={!!errors.zipCode}
                    errorMessage={errors.zipCode?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="daysOld"
                rules={{ required: 'Days back is required' }}
                render={({ field: { value, onChange } }) => (
                  <InputField
                    leftIcon={<Icons.Calendar size={iconsSize} color="#3B82F6" />}
                    label="Days Back"
                    placeholder="e.g., 30"
                    keyboardType="number-pad"
                    value={value?.toString()}
                    onChangeText={onChange}
                    error={!!errors.daysOld}
                    errorMessage={errors.daysOld?.message}
                  />
                )}
              />
            </View>

            <View style={styles.infoBox}>
              <Icons.Info size={16} color="#3B82F6" />
              <Text style={styles.infoText}>
                Search for properties that expired within the specified timeframe
              </Text>
            </View>

            <PrimaryButton
              size={ButtonSize.LARGE}
              loading={loading}
              title="Search Listings"
              onPress={handleSubmit(onSubmit)}
              rightWidget={<Icons.Search color="#FFF" size={18} />}
            />
          </View>
        </Card>

        {ceroResults && (
          <Card style={styles.emptyStateCard}>
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIcon}>
                <Icons.SearchX size={40} color="#94A3B8" />
              </View>
              <Text style={styles.emptyStateTitle}>No Listings Found</Text>
              <Text style={styles.emptyStateDescription}>
                We couldn't find any expired listings for that ZIP code. Try adjusting your search
                criteria or using a different area.
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showResults && !ceroResults}
        onRequestClose={() => {
          setShowResults(false);
        }}>
        {results && (
          <PropertyListScreen
            loadMore={async () => {
              await fetchMoreResults();
            }}
            expListings={results}
            loadingMore={loadingMore}
            dispose={() => {
              setShowResults(false);
            }}
          />
        )}
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
  cardContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    gap: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    gap: 10,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  emptyStateCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
    padding: 32,
  },
  emptyStateContainer: {
    alignItems: 'center',
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
});
