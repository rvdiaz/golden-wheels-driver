import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { IPersonalData } from '../on_boarding/interface';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Text from '~/codidge_components/UI/text';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import TextButton from '~/codidge_components/UI/button/TextButton';
import { Checkbox } from '~/codidge_components/UI/form/checkbox';
import { InfoBanner } from './components/infoBanner';
import DropdownComponent from '~/codidge_components/UI/dropdown';
import { UserType } from './interfaces';
import { USER_TYPE_OPTIONS } from './helpers/onboardingStorage';
import * as Icons from 'lucide-react-native';

// Validation rules
const validationRules = {
  firstName: {
    required: 'First name is required',
    minLength: {
      value: 2,
      message: 'First name must be at least 2 characters',
    },
  },
  lastName: {
    required: 'Last name is required',
    minLength: {
      value: 2,
      message: 'Last name must be at least 2 characters',
    },
  },
  postalCode: {
    required: 'Zip Code is required',
    pattern: {
      value: /^[0-9]{5}$/,
      message: 'Zip Code must be 5 digits (US only)',
    },
  },
  brokerage: {
    minLength: {
      value: 2,
      message: 'Last name must be at least 2 characters',
    },
  },
  addressLine1: {
    required: 'Address is required',
  },
  city: {
    required: 'City is required',
  },
  region: {
    required: 'Region is required',
  },
};

// Main Personal Information Component
export const PersonalInformation = ({
  openSignIn,
  onNext,
}: {
  openSignIn: () => void;
  onNext: (personalData: IPersonalData) => void;
}) => {
  const [notAgentCheckbox, setnotAgentCheckbox] = useState(false);
  const [mlsError, setMlsError] = useState<string>('');

  const {
    control,
    handleSubmit,
    getValues,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext<IPersonalData>();

  const onSubmit = (data: IPersonalData) => {
    onNext({
      ...data,
      userType: data.userType ?? 'Agent',
    });
  };

  const handleCheckBoxChange = (newValue: boolean) => {
    setMlsError('');
    setnotAgentCheckbox(newValue);
  };

  const handleNextPress = async () => {
    let mlsValid = true;
    // Manual MLS validation when agent checkbox is NOT checked
    if (!notAgentCheckbox) {
      const mls = getValues('mlsNumber');

      if (!mls) {
        mlsValid = false;
        setMlsError('License Number is required');
      } else if (mls.length < 2) {
        mlsValid = false;
        setMlsError('License Number must be at least 2 characters');
      }
    }

    if (mlsValid && errorKeys.length > 0) {
      await trigger();
    }

    // If BOTH MLS and other fields are valid → submit
    if (mlsValid) {
      handleSubmit(onSubmit)();
    }
  };

  const mlsValue = watch('mlsNumber');
  const errorKeys = Object.keys(errors);

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.formContent}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            extraScrollHeight={Platform.OS === 'ios' ? 0 : 80}
            keyboardShouldPersistTaps="handled">
            <InfoBanner
              containerStyles={{
                marginTop: 30,
              }}
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
              }}>
              <View style={styles.inputContainer}>
                <Controller
                  name="firstName"
                  rules={validationRules.firstName}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="First Name"
                      required={true}
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter your first name"
                      errorMessage={errors.firstName?.message}
                      error={!!errors.firstName}
                    />
                  )}
                />
              </View>

              <View style={styles.inputContainer}>
                <Controller
                  name="lastName"
                  control={control}
                  rules={validationRules.lastName}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Last Name"
                      required={true}
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter your last name"
                      errorMessage={errors.lastName?.message}
                      error={!!errors.lastName}
                    />
                  )}
                />
              </View>

              <View style={styles.inputContainer}>
                <Controller
                  name="mlsNumber"
                  control={control}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label={!notAgentCheckbox ? 'License Number' : 'License Number (Optional)'}
                      value={value || ''}
                      onChangeText={(text) => {
                        if (text && text.length < 2) {
                          setMlsError('');
                        }
                        onChange(text);
                      }}
                      onBlur={onBlur}
                      placeholder="Enter your mls number"
                      errorMessage={mlsError}
                      error={!!mlsError}
                    />
                  )}
                />
                <Checkbox
                  containerStyle={{
                    marginBottom: 10,
                  }}
                  onToggle={handleCheckBoxChange}
                  checked={notAgentCheckbox}
                  label="I'm not an agent"
                />
              </View>

              <View
                style={[
                  styles.inputContainer,
                  !notAgentCheckbox && {
                    display: 'none',
                  },
                ]}>
                <Controller
                  control={control}
                  name="userType"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <DropdownComponent
                      label="Type"
                      data={USER_TYPE_OPTIONS}
                      placeholder="Select user type"
                      value={value ?? UserType.investor}
                      onChange={onChange}
                      icon={<Icons.UserCircle size={16} color="gray" />}
                    />
                  )}
                />
              </View>

              <View style={styles.inputContainer}>
                <Controller
                  name="addressLine1"
                  control={control}
                  rules={validationRules.addressLine1}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Address"
                      required={true}
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter your address"
                      errorMessage={errors.addressLine1?.message}
                      error={!!errors.addressLine1}
                    />
                  )}
                />
              </View>

              <View style={styles.inputContainer}>
                <Controller
                  name="city"
                  control={control}
                  rules={validationRules.city}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="City"
                      required={true}
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter your city"
                      errorMessage={errors.city?.message}
                      error={!!errors.city}
                    />
                  )}
                />
              </View>

              <View
                style={[
                  styles.inputContainer,
                  {
                    flexDirection: 'row',
                    gap: 8,
                  },
                ]}>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <Controller
                    name="postalCode"
                    control={control}
                    rules={validationRules.postalCode}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <InputField
                        label="Zip Code"
                        required={true}
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Enter your zip code"
                        errorMessage={errors.postalCode?.message}
                        error={!!errors.postalCode}
                      />
                    )}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                  }}>
                  <Controller
                    name="region"
                    control={control}
                    rules={validationRules.region}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <InputField
                        label="State"
                        required={true}
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Ex: FL"
                        errorMessage={errors.region?.message}
                        error={!!errors.region}
                      />
                    )}
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.footerContainer}>
        <PrimaryButton
          onPress={handleNextPress}
          size={ButtonSize.LARGE}
          title="Next"
          disabled={errorKeys.length > 0 || (!notAgentCheckbox && !mlsValue)}
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TextButton
            textStyle={styles.signInLink}
            title="Sign In"
            size={ButtonSize.SMALL}
            onPress={async () => {
              openSignIn();
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 8,
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signInLink: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
});
