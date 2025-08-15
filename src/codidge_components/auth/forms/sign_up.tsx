import React, { useState } from 'react';
import Constants from 'expo-constants';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { signUp } from 'aws-amplify/auth/cognito';
import { useAuthContext } from '../context';
import { IAuthModuleKeys, RegisterFormData } from '../interfaces';
import { Card } from '~/codidge_components/UI/card';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import TextButton from '~/codidge_components/UI/button/TextButton';

const schema = yup.object({
  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  agreeToTerms: yup
    .boolean()
    .required('You must agree to the terms and conditions')
    .oneOf([true], 'You must agree to the terms and conditions'),
});

export const SignUpForm = ({
  onSignUpSuccess,
}: {
  onSignUpSuccess: (userId: string, formData: any) => void;
}) => {
  const { setCurrentView, setTempData } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setloading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
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

      const needsVerification = result.nextStep.signUpStep === 'CONFIRM_SIGN_UP';
      if (needsVerification) {
        setTempData({
          email: data.email,
          password: data.password,
          name: data.name,
        });
        setCurrentView(IAuthModuleKeys.verifyEmail);

        return;
      }

      if (!result.userId) {
        throw Error('Error sign up');
      }

      await onSignUpSuccess('userhwreee', {
        email: data.email,
        name: data.name,
        phone: data.phone,
      });
      setloading(false);
    } catch (error) {
      setloading(false);
      Alert.alert('Registration Failed', 'Please try again');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setCurrentView(IAuthModuleKeys.signIn);
              }}>
              <Icons.ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Real Estate Pro today</Text>
          </View>

          <Card style={styles.formCard}>
            <View style={styles.form}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Full Name</Text>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <Icons.User size={20} color="#6B7280" style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, errors.name && styles.inputError]}
                        placeholder="Full name"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="words"
                      />
                    </View>
                  )}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <Icons.Mail size={20} color="#6B7280" style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, errors.email && styles.inputError]}
                        placeholder="Enter your email"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                  )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <Icons.Phone size={20} color="#6B7280" style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, errors.phone && styles.inputError]}
                        placeholder="Enter your phone number"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="phone-pad"
                      />
                    </View>
                  )}
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <Icons.Lock size={20} color="#6B7280" style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, errors.password && styles.inputError]}
                        placeholder="Create a password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}>
                        {showPassword ? (
                          <Icons.EyeOff size={20} color="#6B7280" />
                        ) : (
                          <Icons.Eye size={20} color="#6B7280" />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <Icons.Lock size={20} color="#6B7280" style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, errors.confirmPassword && styles.inputError]}
                        placeholder="Confirm your password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showConfirmPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.eyeIcon}>
                        {showConfirmPassword ? (
                          <Icons.EyeOff size={20} color="#6B7280" />
                        ) : (
                          <Icons.Eye size={20} color="#6B7280" />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                )}
              </View>

              <Controller
                control={control}
                name="agreeToTerms"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.termsContainer}>
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={() => onChange(!value)}>
                      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                        {value && <Icons.Check size={16} color="white" />}
                      </View>
                      <Text style={styles.termsText}>
                        I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                      </Text>
                    </TouchableOpacity>
                    {errors.agreeToTerms && (
                      <Text style={styles.errorText}>{errors.agreeToTerms.message}</Text>
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
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TextButton
              textStyle={styles.signInLink}
              title="Sign In"
              size={ButtonSize.SMALL}
              onPress={() => {
                setCurrentView(IAuthModuleKeys.signIn);
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
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
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  eyeIcon: {
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  termsContainer: {
    marginBottom: 24,
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
    lineHeight: 20,
    flex: 1,
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
    marginTop: 16,
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
