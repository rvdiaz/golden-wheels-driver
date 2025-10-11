import { useMutation, useReactiveVar } from '@apollo/client';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Alert, View } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { createTransUnionPropertyMutation } from '~/custom_modules/tools/api/mutations';
import { userData } from '~/store/user';
import { ITransUnionProperty } from '../../interfaces';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

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
      propertyId: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: ITransUnionProperty) => {
    try {
      // Clean up the data - remove empty strings and convert to proper types
      const propertyData = {
        isActive: data.isActive,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || undefined,
        addressLine3: data.addressLine3 || undefined,
        addressLine4: data.addressLine4 || undefined,
        locality: data.locality,
        region: data.region,
        postalCode: data.postalCode,
        country: data.country ?? 'USA',
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
    <PageSafeContainer style={styles.container}>
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
                  label="City"
                  value={value}
                  required={true}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.locality}
                  errorMessage={errors.locality?.message}
                  placeholder="Enter city"
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
                    placeholder="Ex: FL"
                  />
                )}
              />
            </View>

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
        </ScrollView>
      </KeyboardAvoidingView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
