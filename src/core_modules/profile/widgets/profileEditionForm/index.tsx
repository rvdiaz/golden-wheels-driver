import React from 'react';
import { StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import * as Icons from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { Header } from '~/codidge_components/UI/header';
import { IUser } from '~/store/interface';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import PhoneInput from '~/codidge_components/UI/form/inputs/phoneNumberInput';
import { parsePhoneNumber, validatePhoneNumber } from '~/codidge_components/helpers';
import { useMutation } from '@apollo/client';
import Constants from 'expo-constants';
import { ProfileFormData } from '../../interfaces';
import { formatPhoneNumberInput } from '~/custom_modules/crm/helpers';
import { updateUserMutation } from '~/core_modules/auth/graphql/mutations';
import { updateUser } from '~/store/user';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const ProfileEditionForm = ({ user, onClose }: { user: IUser; onClose: () => void }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ? formatPhoneNumberInput(user?.phone) : '',
      mlsNumber: user?.mlsNumber ?? '',
      addressLine1: user?.address?.addressLine1 ?? '',
      locality: user?.address?.locality ?? '',
      region: user?.address?.region ?? '',
      postalCode: user?.address?.postalCode ?? '',
      country: user?.address?.country ?? 'US',
    },
    mode: 'onChange',
  });

  const [updateUserFn, { loading }] = useMutation<{
    updateUser: IUser;
  }>(updateUserMutation);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const sanitizedData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone.replace(/\D/g, ''),
        mlsNumber: data.mlsNumber,
        address: {
          addressLine1: data.addressLine1,
          locality: data.locality,
          region: data.region,
          postalCode: data.postalCode,
          country: data.country,
        },
      };

      const response = await updateUserFn({
        variables: {
          tenant: { tenantId },
          userId: user?.id,
          updates: sanitizedData,
        },
      });

      if (response?.data?.updateUser) {
        Alert.alert('Success', 'Profile updated successfully', [
          {
            text: 'OK',
            onPress: () => onClose(),
          },
        ]);
        updateUser(response?.data?.updateUser);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    }
  };

  return (
    <PageSafeContainer style={styles.container}>
      <Header
        title=""
        showBack={true}
        onBack={onClose}
        rightAction={handleSubmit(onSubmit)}
        rightText="Save"
        loadingRight={loading}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <ScrollView
          style={styles.form}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContent}>
          {/* Name Fields */}
          <View style={styles.fieldContainer}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="firstName"
                rules={{
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    leftIcon={<Icons.User size={16} color="#6B7280" />}
                    label="First name"
                    required={true}
                    placeholder="First name"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.firstName}
                    errorMessage={errors.firstName?.message}
                  />
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="lastName"
                rules={{
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Last name"
                    required={true}
                    placeholder="Last name"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.lastName}
                    errorMessage={errors.lastName?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Phone Field */}
          <View style={styles.fieldContainer}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="phone"
                rules={{
                  required: 'Phone number is required',
                  validate: (value) => {
                    const parsed = parsePhoneNumber(value);
                    const validation = validatePhoneNumber(parsed.number, parsed.country);
                    return validation.isValid || validation.message || 'Invalid phone number';
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    value={value}
                    onChangeValue={onChange}
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    required={true}
                    error={!!errors.phone}
                    errorMessage={errors.phone?.message}
                    defaultCountry="US"
                    disabledSelection={true}
                  />
                )}
              />
            </View>
          </View>

          {/* MLS Number Field */}
          <View style={styles.fieldContainer}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="mlsNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    leftIcon={<Icons.Hash size={16} color="#6B7280" />}
                    label="MLS Number"
                    placeholder="Enter MLS number"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
          </View>

          {/* Address Line 1 */}
          <View style={styles.fieldContainer}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="addressLine1"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    leftIcon={<Icons.Map size={16} color="#6B7280" />}
                    label="Street Address"
                    placeholder="123 Main St"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
          </View>

          {/* City and State */}
          <View style={styles.fieldContainer}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="locality"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="City"
                    placeholder="City"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="region"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="State"
                    placeholder="State"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
          </View>

          {/* Postal Code and Country */}
          <View style={styles.fieldContainer}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="postalCode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Postal Code"
                    placeholder="12345"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="country"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Country"
                    placeholder="US"
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
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
    backgroundColor: '#FFF',
  },
  form: {
    flex: 1,
    padding: 24,
  },
  formContent: {
    paddingBottom: 100,
  },
  fieldContainer: {
    marginBottom: 10,
    gap: 10,
    flexDirection: 'row',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});
