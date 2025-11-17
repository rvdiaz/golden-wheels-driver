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
      <Card style={styles.cardContainer}>
        <ScrollView>
          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="zipCode"
              rules={{ required: 'Home price is required' }}
              render={({ field: { value, onChange } }) => (
                <InputField
                  leftIcon={<MapPin size={iconsSize} />}
                  label="Zip Code"
                  placeholder="Zip Code"
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
              rules={{ required: 'Days are required' }}
              render={({ field: { value, onChange } }) => (
                <InputField
                  leftIcon={<MapPin size={iconsSize} />}
                  label="Days Back"
                  placeholder="30"
                  keyboardType="number-pad"
                  value={value?.toString()}
                  onChangeText={onChange}
                  error={!!errors.daysOld}
                  errorMessage={errors.daysOld?.message}
                />
              )}
            />
            <PrimaryButton
              size={ButtonSize.LARGE}
              loading={loading}
              title="Show Results"
              onPress={handleSubmit(onSubmit)}
              rightWidget={<Icons.ChevronRight color="#FFF" />}
            />
          </View>
          {ceroResults && (
            <View
              style={[
                styles.container,
                {
                  padding: 16,
                  alignItems: 'center',
                },
              ]}>
              <Text style={styles.title}>No Listings Found</Text>
              <Text style={styles.description}>
                We couldn’t find any expired listings for that ZIP code. Try adjusting your search
                criteria or using a different area.
              </Text>
            </View>
          )}
        </ScrollView>
      </Card>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showResults && !ceroResults}
        onRequestClose={() => {
          setShowResults(false);
        }}>
         {results&& (
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
    backgroundColor: '#F9FAFB',
  },
  cardContainer: {
    margin: 16,
  },
  formContainer: {
    gap: 16,
    padding: 24,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
  },
  description: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});
