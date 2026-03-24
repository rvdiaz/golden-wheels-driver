import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Icons from 'lucide-react-native';
import {
  confirmSignUp,
  fetchUserAttributes,
  resendSignUpCode,
  signIn,
  signOut,
} from 'aws-amplify/auth/cognito';
import { useAuthContext } from '../context';
import { IAuthModuleKeys, MfaFormData } from '../interfaces';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import TextButton from '~/codidge_components/UI/button/TextButton';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import Text from '~/codidge_components/UI/text';
import { ButtonSize } from '~/codidge_components/UI/button/types';

const EXPIRATION_COGNITO_TOKEN = 180;

export const VerifyEmail = ({
  onVerificationSuccess,
}: {
  onVerificationSuccess: (userId: string) => void;
}) => {
  const { setCurrentView, tempData } = useAuthContext();

  const [loading, setloading] = useState(false);

  const [countdown, setCountdown] = useState(EXPIRATION_COGNITO_TOKEN);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

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
    setloading(true);
    try {
      if (!tempData.email || !tempData.password) {
        throw Error('Please try login again');
      }

      const res = await confirmSignUp({
        username: tempData.email,
        confirmationCode: data.code,
      });

      if (res.isSignUpComplete) {
        const user = await signIn({
          username: tempData.email,
          password: tempData.password,
          options: {
            authFlowType: 'USER_PASSWORD_AUTH',
          },
        });

        if (user.isSignedIn) {
          const att = await fetchUserAttributes();
          const userId = att?.['sub'] || '';

          await onVerificationSuccess(userId);
        }
      }

      setloading(false);
    } catch (error) {
      console.log(':::error', error);
      setloading(false);
      await signOut();
      Alert.alert('Invalid Code', 'Please check your code and try again');
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    // Handle paste: if text is longer than 1 character, it's a paste operation
    if (text.length > 1) {
      // Extract only numeric characters
      const pastedCode = text.replace(/[^0-9]/g, '').slice(0, 6);
      setValue('code', pastedCode);

      // Focus the last input or the next empty one
      const nextIndex = Math.min(pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Handle single character input (normal typing)
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

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({
        username: tempData.email!,
      });
      setCountdown(EXPIRATION_COGNITO_TOKEN);
      setCanResend(false);
      Alert.alert('Code Sent', 'A new verification code has been sent');
    } catch (error) {
      console.log(':::error', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}>
      <View style={styles.content}>
        <View>
          <View style={styles.helpContainer}>
            <Icons.HelpCircle size={16} color="#6B7280" />
            <Text style={styles.subtitle}>A code has being sent to your email</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="code"
              render={({ field: { value } }) => (
                <View style={styles.codeContainer}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputField
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
            <PrimaryButton
              size={ButtonSize.LARGE}
              disabled={codeValue.length !== 6}
              title="Verify Code"
              loading={loading}
              onPress={handleSubmit(onSubmit)}
            />
            <View
              style={[
                styles.resendContainer,
                canResend && {
                  justifyContent: 'space-between',
                },
              ]}>
              <TextButton
                style={{
                  marginVertical: 10,
                }}
                size={ButtonSize.LARGE}
                onPress={() => {
                  setCurrentView(IAuthModuleKeys.signUp);
                }}
                title="Back"
              />
              {canResend && <OutlineButton title="Resend Code" onPress={handleResendCode} />}
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
    paddingTop: 40,
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

  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 16,
    color: '#6B7280',
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});
