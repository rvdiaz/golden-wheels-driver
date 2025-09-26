import React, { useState } from 'react';
import {
  View,
  Text,
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
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import TextButton from '~/codidge_components/UI/button/TextButton';

export const ForcePasswordChange = ({
  onSignUpSuccess,
}: {
  onSignUpSuccess: (userId: string, formData: any) => void;
}) => {
  const { setCurrentView } = useAuthContext();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const isLoading = false;

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

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      //await changePassword(data.currentPassword!, data.newPassword);
      Alert.alert('Success', 'Password changed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please check your current password.');
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icons.HelpCircle size={16} color="#6B7280" />
          <Text style={styles.subtitle}>
            Your password has expired. Please create a new secure password.
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="currentPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    containerStyle={{
                      flex: 1,
                      width: '100%',
                    }}
                    label="Current Password"
                    placeholder="Enter current password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showCurrentPassword}
                    leftIcon={<Icons.Lock size={16} color="#6B7280" />}
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
                    error={!!errors.currentPassword}
                    errorMessage={errors?.currentPassword?.message}
                  />
                )}
              />
            </View>

            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="newPassword"
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

            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    containerStyle={{
                      flex: 1,
                      width: '100%',
                    }}
                    label="Confirm new Password"
                    placeholder="Confirm new password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showNewPassword}
                    leftIcon={<Icons.Lock size={16} color="#6B7280" />}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showNewPassword)}
                        style={styles.eyeIcon}>
                        {showNewPassword ? (
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
              title="Change Password"
              loading={isLoading}
              style={styles.changeButton}
              size={ButtonSize.LARGE}
            />

            <TextButton
              style={{
                marginTop: 5,
              }}
              title="Back to Sign In"
              onPress={() => {
                setCurrentView(IAuthModuleKeys.signIn);
              }}
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
    gap: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
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
  changeButton: {
    backgroundColor: '#F59E0B',
  },
  changeButtonDisabled: {
    opacity: 0.6,
  },
});
