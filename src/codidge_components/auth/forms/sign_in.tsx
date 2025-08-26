import React, { useState } from 'react';
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
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as Icons from 'lucide-react-native';
import { fetchUserAttributes, signIn, signOut } from 'aws-amplify/auth/cognito';
import { useAuthContext } from '../context';
import { IAuthModuleKeys, LoginFormData } from '../interfaces';
import { Card } from '~/codidge_components/UI/card';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import TextButton from '~/codidge_components/UI/button/TextButton';
import InputField from '~/codidge_components/UI/form/inputs/inputField';

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const SignInForm = ({ onLoginSuccess }: { onLoginSuccess: (userId: string) => void }) => {
  const { setCurrentView } = useAuthContext();

  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setloading(true);
      const user = await signIn({
        username: data.email,
        password: data.password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH',
        },
      });

      if (user.isSignedIn) {
        const att = await fetchUserAttributes();

        const userId = att?.['sub'] || '';

        await onLoginSuccess(userId);
        setloading(false);
      }
    } catch (error: any) {
      setloading(false);
      Alert.alert('Login Failed', 'Invalid email or password');
      await signOut();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Icons.Home size={40} color="#2563EB" />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your Real Estate Pro account</Text>
          </View>

          <Card style={styles.formCard}>
            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Email"
                    placeholder="Enter your email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    error={!!errors.email}
                    errorMessage={errors.email?.message}
                    autoCapitalize="none"
                    autoComplete="email"
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
                    placeholder="Enter your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    error={!!errors.password}
                    errorMessage={errors.password?.message}
                    autoComplete="password"
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

              <View style={styles.optionsRow}>
                <TextButton
                  textStyle={styles.forgotPassword}
                  title="Forgot Password?"
                  onPress={() => {
                    setCurrentView(IAuthModuleKeys.forcePasswordChange);
                  }}
                />
              </View>

              <PrimaryButton
                onPress={handleSubmit(onSubmit)}
                title="Sign In"
                loading={loading}
                size={ButtonSize.LARGE}
              />
            </View>
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>

            <TextButton
              textStyle={styles.signUpLink}
              title="Sign Up"
              size={ButtonSize.SMALL}
              onPress={() => {
                setCurrentView(IAuthModuleKeys.signUp);
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
    gap: 12,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  testCredentials: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  testTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  testText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
});
