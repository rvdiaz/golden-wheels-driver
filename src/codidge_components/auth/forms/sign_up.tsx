import React, { useState } from 'react';
import Constants from 'expo-constants';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { signUp } from 'aws-amplify/auth/cognito';
import { useAuthContext } from '../context';
import { IAuthModuleKeys, RegisterFormData } from '../interfaces';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import TextButton from '~/codidge_components/UI/button/TextButton';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Text from '~/codidge_components/UI/text';
import { TermsAndConditions } from './terms_and_conditions';
import { useSystemSettings } from '~/system_setting/customHook';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[2-9]\d{2}[2-9]\d{6}$/, 'Enter a valid 10-digit US phone number'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~]/,
      'Password must contain at least one special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  agreeToTerms: yup
    .boolean()
    .required('You must agree to the terms and conditions')
    .oneOf([true], 'You must agree to the terms and conditions'),
  agreeToDataProcessing: yup
    .boolean()
    .required('You must agree to data processing')
    .oneOf([true], 'You must agree to data processing to continue'),
});

export const SignUpForm = ({
  onSignUpSuccess,
  strictView,
  loginScreenRequest,
}: {
  onSignUpSuccess: (userId: string, formData: any) => void;
  strictView?: boolean;
  loginScreenRequest?: () => void;
}) => {
  const { setCurrentView, setTempData } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setloading] = useState(false);

  const legal = useSystemSettings().legal;
  const loadingSettings = useSystemSettings().loading;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      agreeToDataProcessing: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const tenantId = Constants.expoConfig?.extra?.TENANTID;

      setloading(true);
      const result = await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            phone_number: `+1${data.phone}`,
            'custom:user_type': 'customer',
            'custom:role': 'admin',
            'custom:tenantId': tenantId,
          },
        },
      });

      if (!result.userId) {
        throw Error('Error sign up');
      }

      await onSignUpSuccess(result.userId, {
        email: data.email,
        phone: data.phone,
      });

      const needsVerification = result.nextStep.signUpStep === 'CONFIRM_SIGN_UP';

      if (needsVerification) {
        setTempData({
          email: data.email,
          password: data.password,
          phone: data.phone,
        });

        setCurrentView(IAuthModuleKeys.verifyEmail);
        setloading(false);
      }

      setloading(false);
    } catch (error) {
      console.log(':::result', error);
      setloading(false);
      Alert.alert('Registration Failed', 'Please try again');
    }
  };

  if (loadingSettings) {
    return <PageLoading />;
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === 'ios' ? 0 : 80}
          keyboardShouldPersistTaps="handled">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <View style={styles.formCard}>
              <View style={styles.form}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      leftIcon={<Icons.Mail size={16} color="#6B7280" />}
                      label="Email"
                      required={true}
                      placeholder="Enter your email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      error={!!errors.email}
                      errorMessage={errors.email?.message}
                      autoCapitalize="none"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      leftIcon={<Icons.Phone size={16} color="#6B7280" />}
                      label="Phone Number"
                      placeholder="e.g. 2345678901"
                      required={true}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                      error={!!errors.phone}
                      errorMessage={errors.phone?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      leftIcon={<Icons.Lock size={16} color="#6B7280" />}
                      label="Password"
                      required={true}
                      placeholder="Create a password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.password}
                      errorMessage={errors.password?.message}
                      secureTextEntry={!showPassword}
                      autoComplete="off"
                      textContentType="none"
                      hint={
                        !errors.password
                          ? 'At least 8 characters with uppercase, lowercase, number, and special character'
                          : ''
                      }
                      rightIcon={
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          style={styles.eyeIcon}>
                          {showPassword ? (
                            <Icons.EyeOff size={16} color="#6B7280" />
                          ) : (
                            <Icons.Eye size={16} color="#6B7280" />
                          )}
                        </TouchableOpacity>
                      }
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      leftIcon={<Icons.Lock size={16} color="#6B7280" />}
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      value={value}
                      required={true}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.confirmPassword}
                      errorMessage={errors.confirmPassword?.message}
                      secureTextEntry={!showConfirmPassword}
                      autoComplete="off"
                      textContentType="none"
                      rightIcon={
                        <TouchableOpacity
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={styles.eyeIcon}>
                          {showConfirmPassword ? (
                            <Icons.EyeOff size={16} color="#6B7280" />
                          ) : (
                            <Icons.Eye size={16} color="#6B7280" />
                          )}
                        </TouchableOpacity>
                      }
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="agreeToTerms"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.termsContainer}>
                      <View style={styles.checkboxContainer}>
                        <TouchableOpacity
                          onPress={() => onChange(!value)}
                          style={[styles.checkbox, value && styles.checkboxChecked]}>
                          {value && <Icons.Check size={16} color="white" />}
                        </TouchableOpacity>
                        <Text style={styles.termsText}>
                          I agree to the{' '}
                          <TermsAndConditions
                            sourceUrl={legal.mvbTemrs}
                            title="Terms and conditions"
                          />
                        </Text>
                      </View>
                      {errors.agreeToTerms && (
                        <Text style={styles.errorText}>{errors.agreeToTerms.message}</Text>
                      )}
                    </View>
                  )}
                />
                <Controller
                  control={control}
                  name="agreeToDataProcessing"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.termsContainer}>
                      <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => onChange(!value)}>
                        <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                          {value && <Icons.Check size={16} color="white" />}
                        </View>
                        <Text style={styles.termsText}>
                          I authorize the app to share my information with{' '}
                          <TermsAndConditions sourceUrl={legal.tuTerms} title="TransUnion" /> for
                          credit and rental application verification purposes.
                        </Text>
                      </TouchableOpacity>
                      {errors.agreeToDataProcessing && (
                        <Text style={styles.errorText}>{errors.agreeToDataProcessing.message}</Text>
                      )}
                    </View>
                  )}
                />
                <PrimaryButton
                  onPress={handleSubmit(onSubmit)}
                  title="Create Account"
                  loading={loading}
                  size={ButtonSize.LARGE}
                />
              </View>
              {!strictView && (
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Already have an account? </Text>
                  <TextButton
                    textStyle={styles.signInLink}
                    title="Sign In"
                    size={ButtonSize.SMALL}
                    onPress={() => {
                      if (loginScreenRequest) {
                        loginScreenRequest();
                      }
                      setCurrentView(IAuthModuleKeys.signIn);
                    }}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  formCard: {
    marginBottom: 24,
  },
  form: {
    paddingHorizontal: 24,
    gap: 8,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  termsContainer: {
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  termsText: {
    fontSize: 14,
    color: '#374151',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  termsLink: {
    color: '#2563EB',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
