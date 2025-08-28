import { useLazyQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { getMlsListingQuery } from '../graphql/queries';
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
import { ExpiredListingResults } from './results';

const iconsSize = 16;

export const ExpiredListing = () => {
  const navigation = useNavigation();
  const [showResults, setShowResults] = useState(false);

  const [getExpiredListingFn, { data, loading, error }] = useLazyQuery<{
    getMlsListing: IMlsListingItemResponse[];
  }>(getMlsListingQuery, {
    fetchPolicy: 'network-only',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IExpiredListingForm>({
    defaultValues: {
      daysOld: 10,
      zipCode: '',
    },
  });

  const onSubmit = async (data: IExpiredListingForm) => {
    try {
      await getExpiredListingFn({
        variables: {
          input: {
            zipCode: data.zipCode,
            daysOld: data.daysOld,
            status: ExpiredStatus.active,
          },
        },
      });
      setShowResults(true);
    } catch (error) {
      console.log(':::error', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        </ScrollView>
      </Card>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showResults}
        onRequestClose={() => {
          setShowResults(false);
        }}>
        {data?.getMlsListing && (
          <ExpiredListingResults
            expListings={data?.getMlsListing ?? []}
            dispose={() => {
              setShowResults(false);
            }}
          />
        )}
      </Modal>
    </SafeAreaView>
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
});
