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
import { Flag } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Text from '~/codidge_components/UI/text';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import TextButton from '~/codidge_components/UI/button/TextButton';
import { Checkbox } from '~/codidge_components/UI/form/checkbox';

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
  zipCode: {
    required: 'Zip Code is required',
    minLength: {
      value: 2,
      message: 'Zip Code must be at least 2 characters',
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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormContext<IPersonalData>();

  const hasErrors = Object.keys(errors).length > 0;

  const onSubmit = (data: IPersonalData) => {
    onNext(data);
  };

  const handleNextPress = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.formContent}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            extraScrollHeight={Platform.OS === 'ios' ? 0 : 80}
            keyboardShouldPersistTaps="handled">
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: 30,
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
                      required={!notAgentCheckbox}
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter your mls number"
                      errorMessage={!notAgentCheckbox ? errors.mlsNumber?.message : ''}
                      error={!notAgentCheckbox ? !!errors.mlsNumber : false}
                    />
                  )}
                />
                <Checkbox
                  containerStyle={{
                    marginBottom: 10,
                  }}
                  onToggle={(newValue) => setnotAgentCheckbox(newValue)}
                  checked={notAgentCheckbox}
                  label="I'm not an agent"
                />
              </View>
              <View style={styles.usaNotice}>
                <Flag size={16} color="#1F2937" />
                <Text style={styles.usaNoticeText}>This service is available for US only</Text>
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
                    rules={validationRules.zipCode}
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
          disabled={hasErrors}
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
  usaNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  usaNoticeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
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
