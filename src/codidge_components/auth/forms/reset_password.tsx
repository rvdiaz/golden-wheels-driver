import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { IAuthModuleKeys, ResetPasswordFormData } from '../interfaces';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import Text from '~/codidge_components/UI/text';
import { resetPassword } from 'aws-amplify/auth';
import { ResetPasswordWithCode } from './reset_password_with_code';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import TextButton from '~/codidge_components/UI/button/TextButton';
import { useAuthContext } from '../context';

export const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState('');

  const { setCurrentView } = useAuthContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      const output = await resetPassword({
        username: data.email,
      });

      const { nextStep } = output;

      switch (nextStep.resetPasswordStep) {
        case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
          const codeDeliveryDetails = nextStep.codeDeliveryDetails;
          setEmailSent(data.email);

          Alert.alert(
            'Code Sent',
            `A verification code was sent to ${codeDeliveryDetails.deliveryMedium === 'EMAIL' ? 'your email' : 'your phone'}: ${codeDeliveryDetails.destination}`
          );
          break;
        case 'DONE':
          Alert.alert('Success', 'Password reset completed.');
          break;
      }
    } catch (error: any) {
      console.log(':::error', error);

      let errorMessage = 'Failed to send reset email. Please try again.';

      switch (error.name) {
        case 'UserNotFoundException':
          errorMessage = 'No account found with this email address.';
          break;
        case 'LimitExceededException':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        case 'InvalidParameterException':
          errorMessage = error.message || 'Invalid email format.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const email = getValues('email');
    if (email) {
      setIsLoading(true);
      try {
        const output = await resetPassword({
          username: email,
        });

        Alert.alert('Success', 'Reset code sent again!');
      } catch (error: any) {
        let errorMessage = 'Failed to resend email. Please try again.';

        if (error.name === 'LimitExceededException') {
          errorMessage = 'Too many attempts. Please wait before trying again.';
        }

        Alert.alert('Error', errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (emailSent) {
    return (
      <View style={styles.content}>
        <ResetPasswordWithCode username={emailSent} onResendCode={handleResendEmail} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Icons.Lock size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a code to reset your password
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Please enter a valid email address',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  variant="dark"
                  containerStyle={{
                    marginBottom: 16,
                  }}
                  label="Email Address"
                  placeholder="your.email@example.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={!!errors.email}
                  errorMessage={errors.email?.message}
                  leftIcon={<Icons.Mail size={16} color="#6B7280" />}
                />
              )}
            />
            <View
              style={{
                gap: 6,
              }}>
              <PrimaryButton
                size={ButtonSize.LARGE}
                title="Send Reset Code"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={isLoading}
              />
              <TextButton
                onPress={() => {
                  setCurrentView(IAuthModuleKeys.signIn);
                }}
                size={ButtonSize.LARGE}
                title="Back"
              />
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  formCard: {
    marginBottom: 12,
  },
  form: {
    marginBottom: 12,
  },
});
