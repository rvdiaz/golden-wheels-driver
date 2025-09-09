import { useMutation, useReactiveVar } from '@apollo/client';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  View,
} from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { createTransUnionPropertyMutation } from '~/custom_modules/tools/api/mutations';
import { userData } from '~/store/user';
import { ITransUnionProperty } from '../interfaces';
import InputField from '~/codidge_components/UI/form/inputs/inputField';

export const PropertyForm = ({
  disposeModalHandler,
  onAddProperty,
}: {
  disposeModalHandler: () => void;
  onAddProperty: () => void;
}) => {
  const user = useReactiveVar(userData);

  const [addPropertyMutationFn, { loading }] = useMutation(createTransUnionPropertyMutation);

  const {
    control,
    handleSubmit,
    reset,

    formState: { errors, isValid },
  } = useForm<ITransUnionProperty>({
    defaultValues: {
      propertyName: '',
      rent: undefined,
      deposit: undefined,
      isActive: true,
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      locality: '',
      region: '',
      postalCode: '',
      country: 'USA',
      bankruptcyCheck: false,
      bankruptcyTimeFrame: 0,
      incomeToRentRatio: 0,
      propertyId: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: ITransUnionProperty) => {
    try {
      // Clean up the data - remove empty strings and convert to proper types
      const propertyData = {
        propertyName: data.propertyName,
        rent: data.rent || undefined,
        deposit: data.deposit || undefined,
        isActive: data.isActive,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || undefined,
        addressLine3: data.addressLine3 || undefined,
        addressLine4: data.addressLine4 || undefined,
        locality: data.locality,
        region: data.region,
        postalCode: data.postalCode,
        country: data.country ?? 'USA',
        bankruptcyCheck: data.bankruptcyCheck,
        bankruptcyTimeFrame: data.bankruptcyTimeFrame ? Number(data.bankruptcyTimeFrame) : 6,
        incomeToRentRatio: Number(data.incomeToRentRatio),
      };

      await addPropertyMutationFn({
        variables: {
          userId: user?.id,
          propertyData,
        },
      });
      onAddProperty();

      Alert.alert('Success', 'Property created successfully!');
      reset();
      disposeModalHandler();
    } catch (error) {
      Alert.alert('Error', 'Failed to create property. Please try again.');
      console.error('Error creating property:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Add Property"
        showBack={true}
        onBack={disposeModalHandler}
        rightAction={handleSubmit(onSubmit)}
        rightText="Save"
        loadingRight={loading}
        disabledRight={!isValid}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Property Name - Required */}
          <View style={styles.inputFormWrapper}>
            <Controller
              control={control}
              name="propertyName"
              rules={{ required: 'Property name is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Property Name"
                  value={value}
                  required={true}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.propertyName?.message}
                  error={!!errors.propertyName}
                  placeholder="Enter property name"
                />
              )}
            />
          </View>

          {/* Address Line 1 - Required */}
          <View style={styles.inputFormWrapper}>
            <Controller
              control={control}
              name="addressLine1"
              rules={{ required: 'Address line 1 is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Address Line 1"
                  value={value}
                  required={true}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.addressLine1}
                  errorMessage={errors.addressLine1?.message}
                  placeholder="Enter address line 1"
                />
              )}
            />
          </View>

          {/* Address Line 2 - Optional */}
          <View style={styles.inputFormWrapper}>
            <Controller
              control={control}
              name="addressLine2"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Address Line 2"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.addressLine2}
                  errorMessage={errors.addressLine2?.message}
                  placeholder="Enter address line 2 (optional)"
                />
              )}
            />
          </View>

          {/* Locality - Required */}
          <View style={styles.inputFormWrapper}>
            <Controller
              control={control}
              name="locality"
              rules={{ required: 'Locality is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Locality"
                  value={value}
                  required={true}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.locality}
                  errorMessage={errors.locality?.message}
                  placeholder="Enter locality/city"
                />
              )}
            />
          </View>

          <View style={styles.pairInputContainer}>
            <View
              style={[
                styles.inputFormWrapper,
                {
                  flex: 1,
                },
              ]}>
              <Controller
                control={control}
                name="region"
                rules={{ required: 'Region is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Region"
                    value={value}
                    required={true}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.region}
                    errorMessage={errors.region?.message}
                    placeholder="Enter region/state"
                  />
                )}
              />
            </View>

            {/* Bankruptcy Time Frame - Required */}
            <View
              style={[
                styles.inputFormWrapper,
                {
                  flex: 1,
                },
              ]}>
              <Controller
                control={control}
                name="postalCode"
                rules={{ required: 'Postal code is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Postal Code"
                    value={value}
                    required={true}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.postalCode}
                    errorMessage={errors.postalCode?.message}
                    placeholder="Enter postal code"
                  />
                )}
              />
            </View>
          </View>

          {/* Income to Rent Ratio - Required */}
          <View style={styles.inputFormWrapper}>
            <Controller
              control={control}
              name="incomeToRentRatio"
              rules={{ required: 'Income to rent ratio is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Income to Rent Ratio"
                  value={value.toString()}
                  required={true}
                  onChangeText={(text) => onChange(parseInt(text, 10) || 0)}
                  onBlur={onBlur}
                  error={!!errors.incomeToRentRatio}
                  errorMessage={errors.incomeToRentRatio?.message}
                  placeholder="Enter income to rent ratio (e.g., 3 for 3:1)"
                  keyboardType="numeric"
                />
              )}
            />
          </View>
          <View style={styles.pairInputContainer}>
            {/* Rent - Optional */}
            <View style={styles.inputFormWrapper}>
              <Controller
                control={control}
                name="rent"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Rent"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(text ? parseInt(text, 10) : undefined)}
                    onBlur={onBlur}
                    error={!!errors.rent}
                    errorMessage={errors.rent?.message}
                    placeholder="Enter rent amount"
                    keyboardType="numeric"
                  />
                )}
              />
            </View>

            {/* Deposit - Optional */}
            <View style={styles.inputFormWrapper}>
              <Controller
                control={control}
                name="deposit"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Deposit"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(text ? parseInt(text, 10) : undefined)}
                    onBlur={onBlur}
                    error={!!errors.deposit}
                    errorMessage={errors.deposit?.message}
                    placeholder="Enter deposit amount"
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  inputFormWrapper: {
    paddingBottom: 8,
  },
  pairInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
