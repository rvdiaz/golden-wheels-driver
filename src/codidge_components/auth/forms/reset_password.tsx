import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { useAuthContext } from '../context';
import { IAuthModuleKeys, ResetPasswordFormData } from '../interfaces';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import InputField from '~/codidge_components/UI/form/inputs/inputField';

export const ResetPassword = ({
  onSignUpSuccess,
}: {
  onSignUpSuccess: (userId: string, formData: any) => void;
}) => {
  const { setCurrentView } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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
      // await resetPassword(data.email);
      setEmailSent(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const email = getValues('email');
    if (email) {
      setIsLoading(true);
      try {
        //await resetPassword(email);
        Alert.alert('Success', 'Reset email sent again!');
      } catch (error) {
        Alert.alert('Error', 'Failed to resend email. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (emailSent) {
    return (
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setCurrentView(IAuthModuleKeys.signIn);
          }}>
          <Icons.ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>

        <View style={styles.successContainer}>
          <View style={styles.iconContainer}>
            <Icons.Mail size={48} color="#10B981" />
          </View>
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successMessage}>
            We've sent a password reset link to your email address. Please check your inbox and
            follow the instructions to reset your password.
          </Text>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendEmail}
            disabled={isLoading}>
            <Text style={styles.resendButtonText}>{isLoading ? 'Sending...' : 'Resend Email'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => {
              setCurrentView(IAuthModuleKeys.signIn);
            }}>
            <Text style={styles.backToLoginText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Icons.HelpCircle size={16} color="#6B7280" />
          <Text style={styles.subtitle}>
            Your password has expired. Please create a new secure password.
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Email Address"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={!!errors.email}
                  errorMessage={errors.email?.message}
                  rightIcon={<Icons.Mail size={16} color="#6B7280" />}
                />
              )}
            />
            <PrimaryButton
              size={ButtonSize.LARGE}
              title="Send Reset Link"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <TouchableOpacity
            onPress={() => {
              setCurrentView(IAuthModuleKeys.signIn);
            }}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
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
    paddingVertical: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 8,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    gap: 5,
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
    marginBottom: 12,
  },
  form: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
  signInLink: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  resendButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  resendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLoginButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backToLoginText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
});
