import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { useAuthContext } from '../context';
import { ChangePasswordFormData, IAuthModuleKeys } from '../interfaces';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import Text from '~/codidge_components/UI/text';
import { confirmSignIn } from 'aws-amplify/auth';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { theme } from '~/theme/theme';

/**
 * Completes Cognito's NEW_PASSWORD_REQUIRED challenge — the last step of the
 * driver invitation flow. The account already exists with a temporary password;
 * the driver is mid-sign-in and simply has to choose a real one.
 *
 * This is NOT the forgot-password flow (that's ResetPassword, which emails a
 * code). There is no code here: the session from signIn() is the credential.
 */
export const ForcePasswordChange = ({
  username,
  onSuccess,
}: {
  username: string;
  onSuccess: () => Promise<void> | void;
}) => {
  const { setCurrentView } = useAuthContext();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
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
    const validationResult = validatePassword(data.newPassword);
    if (validationResult !== true) {
      setError('newPassword', { type: 'manual', message: validationResult });
      return;
    }

    setIsLoading(true);

    try {
      const result = await confirmSignIn({ challengeResponse: data.newPassword });

      if (result.isSignedIn) {
        // Fully authenticated now — load the driver profile before showing the app.
        await onSuccess();
        return;
      }

      // Any further challenge (MFA, etc.) is not something this screen handles.
      Alert.alert(
        'Additional step required',
        'Please sign in again to finish setting up your account.',
        [{ text: 'OK', onPress: () => setCurrentView(IAuthModuleKeys.signIn) }]
      );
    } catch (error: any) {
      console.error('confirmSignIn error:', error);

      let errorMessage = 'Failed to set your password. Please try again.';

      switch (error.name) {
        case 'InvalidPasswordException':
          errorMessage = 'Password does not meet requirements.';
          setError('newPassword', {
            type: 'manual',
            message: error.message || errorMessage,
          });
          break;
        case 'NotAuthorizedException':
        case 'InvalidSessionException':
          // The temporary-password session expired mid-flow.
          errorMessage = 'Your session expired. Please sign in again.';
          setCurrentView(IAuthModuleKeys.signIn);
          break;
        case 'LimitExceededException':
          errorMessage = 'Too many attempts. Please try again later.';
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
    <View style={styles.keyboardView}>
      <View style={styles.scrollContent}>
        <View style={styles.header}>
          <Icons.ShieldCheck size={20} color="#6B7280" />
          <Text style={styles.subtitle}>
            Welcome{username ? `, ${username}` : ''}! Choose a password to finish setting up your
            driver account.
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.form}>
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
                    variant="light"
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
                      <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
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

            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  required: 'Please confirm your password',
                  validate: (value?: string) => value === newPassword || 'Passwords do not match',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    variant="light"
                    containerStyle={{ flex: 1, width: '100%' }}
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showConfirmPassword}
                    leftIcon={<Icons.Lock size={16} color="#6B7280" />}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? (
                          <Icons.EyeOff size={16} color="#6B7280" />
                        ) : (
                          <Icons.Eye size={16} color="#6B7280" />
                        )}
                      </TouchableOpacity>
                    }
                    error={!!errors.confirmPassword}
                    errorMessage={errors?.confirmPassword?.message}
                  />
                )}
              />
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
              title="Set password & continue"
              loading={isLoading}
              size={ButtonSize.LARGE}
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Deliberately NOT flex: 1 — these sit inside AuthFormWrapper's ScrollView. A flex: 1 child
  // pins content to the viewport height, so the ScrollView has nothing to scroll and anything
  // that does not fit is clipped — which with the keyboard up put inputs out of reach on iOS.
  // Left over from when each form had its own KeyboardAvoidingView; the wrapper owns that now.
  keyboardView: {},
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
    fontSize: 15,
    color: theme.colors.primaryText,
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
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  resendButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  resendText: {
    fontSize: 15,
    color: '#4F46E5',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 15,
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
    fontSize: 13,
    fontWeight: '600',
  },
  requirementsContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 15,
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
    fontSize: 15,
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
