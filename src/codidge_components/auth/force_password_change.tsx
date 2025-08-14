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
import * as Icons from 'lucide-react-native';
import { Card } from '../../components/Card';
import { ChangePasswordFormData, IAuthModuleKeys } from './interfaces';
import { useAuthContext } from './context';

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
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setCurrentView(IAuthModuleKeys.signIn);
        }}>
        <Icons.ArrowLeft size={24} color="#374151" />
      </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Icons.Lock size={40} color="#F59E0B" />
            </View>
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.subtitle}>
              Your password has expired. Please create a new secure password.
            </Text>
          </View>

          <Card style={styles.formCard}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Password</Text>
                <Controller
                  control={control}
                  name="currentPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <Icons.Lock size={20} color="#6B7280" style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, errors.currentPassword && styles.inputError]}
                        placeholder="Enter current password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showCurrentPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                        style={styles.eyeIcon}>
                        {showCurrentPassword ? (
                          <Icons.EyeOff size={20} color="#6B7280" />
                        ) : (
                          <Icons.Eye size={20} color="#6B7280" />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.currentPassword && (
                  <Text style={styles.errorText}>{errors.currentPassword.message}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <Icons.Lock size={20} color="#6B7280" style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, errors.newPassword && styles.inputError]}
                        placeholder="Create new password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showNewPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        style={styles.eyeIcon}>
                        {showNewPassword ? (
                          <Icons.EyeOff size={20} color="#6B7280" />
                        ) : (
                          <Icons.Eye size={20} color="#6B7280" />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.newPassword && (
                  <Text style={styles.errorText}>{errors.newPassword.message}</Text>
                )}

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
                <Text style={styles.label}>Confirm New Password</Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <Icons.Lock size={20} color="#6B7280" style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, errors.confirmPassword && styles.inputError]}
                        placeholder="Confirm new password"
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
                  <Icons.Check
                    size={16}
                    color={/[A-Z]/.test(newPassword) ? '#10B981' : '#D1D5DB'}
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      /[A-Z]/.test(newPassword) && styles.requirementMet,
                    ]}>
                    One uppercase letter
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <Icons.Check
                    size={16}
                    color={/[a-z]/.test(newPassword) ? '#10B981' : '#D1D5DB'}
                  />
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
                    style={[
                      styles.requirementText,
                      /\d/.test(newPassword) && styles.requirementMet,
                    ]}>
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

              <TouchableOpacity
                style={[styles.changeButton, isLoading && styles.changeButtonDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}>
                {isLoading ? (
                  <Text style={styles.changeButtonText}>Changing Password...</Text>
                ) : (
                  <Text style={styles.changeButtonText}>Change Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </Card>
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 8,
    zIndex: 1,
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
    backgroundColor: '#FFFBEB',
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
    lineHeight: 24,
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
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  changeButtonDisabled: {
    opacity: 0.6,
  },
  changeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
