import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import { useAuthContext } from '../context';
import { IAuthModuleKeys, MfaFormData } from '../interfaces';
import { Card } from '~/codidge_components/UI/card';

export const MfaAuth = () => {
  const { setCurrentView } = useAuthContext();

  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  const isLoading = false;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MfaFormData>({
    defaultValues: {
      code: '',
    },
  });

  const codeValue = watch('code');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const onSubmit = async (data: MfaFormData) => {
    try {
      //await verifyMfa(data.code);
    } catch (error) {
      Alert.alert('Invalid Code', 'Please check your code and try again');
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = codeValue.split('');
    newCode[index] = text;
    const updatedCode = newCode.join('');
    setValue('code', updatedCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !codeValue[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    setCountdown(30);
    setCanResend(false);
    Alert.alert('Code Sent', 'A new verification code has been sent');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icons.Shield size={40} color="#2563EB" />
          </View>
          <Text style={styles.title}>Two-Factor Authentication</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code from your authenticator app</Text>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.form}>
            <Controller
              control={control}
              name="code"
              render={({ field: { value } }) => (
                <View style={styles.codeContainer}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        if (ref) inputRefs.current[index] = ref;
                      }}
                      style={[
                        styles.codeInput,
                        errors.code && styles.codeInputError,
                        value[index] && styles.codeInputFilled,
                      ]}
                      value={value[index] || ''}
                      onChangeText={(text) => handleCodeChange(text, index)}
                      onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                      keyboardType="numeric"
                      maxLength={1}
                      textAlign="center"
                      selectTextOnFocus
                    />
                  ))}
                </View>
              )}
            />
            {errors.code && <Text style={styles.errorText}>{errors.code.message}</Text>}

            <TouchableOpacity
              style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading || codeValue.length !== 6}>
              {isLoading ? (
                <Text style={styles.verifyButtonText}>Verifying...</Text>
              ) : (
                <Text style={styles.verifyButtonText}>Verify Code</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              {canResend ? (
                <TouchableOpacity onPress={handleResendCode}>
                  <Text style={styles.resendText}>Resend Code</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.countdownText}>Resend code in {countdown}s</Text>
              )}
            </View>
          </View>
        </Card>

        <View style={styles.helpContainer}>
          <Icons.HelpCircle size={16} color="#6B7280" />
          <Text style={styles.helpText}>Having trouble? Contact support for assistance</Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setCurrentView(IAuthModuleKeys.signIn);
          }}>
          <Icons.ArrowLeft size={20} color="#6B7280" />
          <Text style={styles.backButtonText}>Back to Sign In</Text>
        </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    backgroundColor: 'white',
  },
  codeInputError: {
    borderColor: '#EF4444',
  },
  codeInputFilled: {
    borderColor: '#2563EB',
    backgroundColor: '#EEF2FF',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  verifyButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  countdownText: {
    fontSize: 16,
    color: '#6B7280',
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
});
