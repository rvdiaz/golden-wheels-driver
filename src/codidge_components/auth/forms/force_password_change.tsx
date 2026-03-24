import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { useAuthContext } from '../context';
import { ChangePasswordFormData, IAuthModuleKeys } from '../interfaces';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import Text from '~/codidge_components/UI/text';
import { confirmResetPassword } from 'aws-amplify/auth';
import { ButtonSize } from '~/codidge_components/UI/button/types';

export const ForcePasswordChange = ({
  username,
  onResendCode,
}: {
  username: string;
  onResendCode?: () => void;
}) => {
  const { setCurrentView } = useAuthContext();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      confirmationCode: '',
      newPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return '#EF4444';
    if (strength <= 3) return '#F59E0B';
    if (strength <= 4) return '#10B981';
    return '#059669';
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  const validatePassword = (password: string): string | true => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return true;
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    // Validate password requirements
    const validationResult = validatePassword(data.newPassword);
    if (validationResult !== true) {
      setError('newPassword', {
        type: 'manual',
        message: validationResult,
      });
      return;
    }

    setIsLoading(true);

    try {
      await confirmResetPassword({
        username: username,
        confirmationCode: data.confirmationCode!,
        newPassword: data.newPassword,
      });

      Alert.alert('Success', 'Password changed successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setCurrentView(IAuthModuleKeys.signIn);
          },
        },
      ]);
    } catch (error: any) {
      console.error('Confirm reset password error:', error);

      let errorMessage = 'Failed to change password. Please try again.';

      switch (error.name) {
        case 'CodeMismatchException':
          errorMessage = 'Invalid verification code. Please check and try again.';
          setError('confirmationCode', {
            type: 'manual',
            message: 'Invalid code',
          });
          break;
        case 'ExpiredCodeException':
          errorMessage = 'Verification code has expired. Please request a new one.';
          setError('confirmationCode', {
            type: 'manual',
            message: 'Code expired',
          });
          break;
        case 'InvalidPasswordException':
          errorMessage = 'Password does not meet requirements.';
          setError('newPassword', {
            type: 'manual',
            message: error.message || errorMessage,
          });
          break;
        case 'LimitExceededException':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        case 'InvalidParameterException':
          errorMessage = error.message || 'Invalid input. Please check your information.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 280 : 0}
      style={styles.keyboardView}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icons.HelpCircle size={20} color="#6B7280" />
          <Text style={styles.subtitle}>
            We sent a verification code to {username}. Enter the code and create a new secure
            password.
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="confirmationCode"
                rules={{
                  required: 'Verification code is required',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    containerStyle={{
                      flex: 1,
                      width: '100%',
                    }}
                    label="Verification Code"
                    placeholder="Enter 6-digit code"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="number-pad"
                    maxLength={6}
                    leftIcon={<Icons.Key size={16} color="#6B7280" />}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                        style={styles.eyeIcon}>
                        {showCurrentPassword ? (
                          <Icons.EyeOff size={16} color="#6B7280" />
                        ) : (
                          <Icons.Eye size={16} color="#6B7280" />
                        )}
                      </TouchableOpacity>
                    }
                    error={!!errors.confirmationCode}
                    errorMessage={errors?.confirmationCode?.message}
                  />
                )}
              />

              {onResendCode && (
                <TouchableOpacity onPress={onResendCode} style={styles.resendButton}>
                  <Text style={styles.resendText}>Didn't receive the code? Resend</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="newPassword"
                rules={{
                  required: 'New password is required',
                  validate: validatePassword,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    containerStyle={{
                      flex: 1,
                      width: '100%',
                    }}
                    label="Create new Password"
                    placeholder="Create new password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showNewPassword}
                    leftIcon={<Icons.Lock size={16} color="#6B7280" />}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        style={styles.eyeIcon}>
                        {showNewPassword ? (
                          <Icons.EyeOff size={16} color="#6B7280" />
                        ) : (
                          <Icons.Eye size={16} color="#6B7280" />
                        )}
                      </TouchableOpacity>
                    }
                    error={!!errors.newPassword}
                    errorMessage={errors?.newPassword?.message}
                  />
                )}
              />

              {newPassword && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    <View
                      style={[
                        styles.strengthFill,
                        {
                          width: `${(passwordStrength / 5) * 100}%`,
                          backgroundColor: getStrengthColor(passwordStrength),
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[styles.strengthText, { color: getStrengthColor(passwordStrength) }]}>
                    {getStrengthText(passwordStrength)}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <View style={styles.requirement}>
                <Icons.Check size={16} color={newPassword.length >= 8 ? '#10B981' : '#D1D5DB'} />
                <Text
                  style={[
                    styles.requirementText,
                    newPassword.length >= 8 && styles.requirementMet,
                  ]}>
                  At least 8 characters
                </Text>
              </View>
              <View style={styles.requirement}>
                <Icons.Check size={16} color={/[A-Z]/.test(newPassword) ? '#10B981' : '#D1D5DB'} />
                <Text
                  style={[
                    styles.requirementText,
                    /[A-Z]/.test(newPassword) && styles.requirementMet,
                  ]}>
                  One uppercase letter
                </Text>
              </View>
              <View style={styles.requirement}>
                <Icons.Check size={16} color={/[a-z]/.test(newPassword) ? '#10B981' : '#D1D5DB'} />
                <Text
                  style={[
                    styles.requirementText,
                    /[a-z]/.test(newPassword) && styles.requirementMet,
                  ]}>
                  One lowercase letter
                </Text>
              </View>
              <View style={styles.requirement}>
                <Icons.Check size={16} color={/\d/.test(newPassword) ? '#10B981' : '#D1D5DB'} />
                <Text
                  style={[styles.requirementText, /\d/.test(newPassword) && styles.requirementMet]}>
                  One number
                </Text>
              </View>
              <View style={styles.requirement}>
                <Icons.Check
                  size={16}
                  color={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? '#10B981' : '#D1D5DB'}
                />
                <Text
                  style={[
                    styles.requirementText,
                    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) && styles.requirementMet,
                  ]}>
                  One special character
                </Text>
              </View>
            </View>

            <PrimaryButton
              onPress={handleSubmit(onSubmit)}
              title="Change Password"
              loading={isLoading}
              size={ButtonSize.LARGE}
              disabled={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 14,
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
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  resendButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  resendText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 4,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  requirementsContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  requirementMet: {
    color: '#10B981',
  },
  changeButtonDisabled: {
    opacity: 0.6,
  },
});
