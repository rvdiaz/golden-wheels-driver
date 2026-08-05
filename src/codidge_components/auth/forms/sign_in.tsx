import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as Icons from 'lucide-react-native';
import { signIn, signOut } from 'aws-amplify/auth/cognito';
import { useAuthContext } from '../context';
import { IAuthModuleKeys, LoginFormData } from '../interfaces';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import TextButton from '~/codidge_components/UI/button/TextButton';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import Text from '~/codidge_components/UI/text';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { theme } from '~/theme/theme';

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export const SignInForm = ({
  onLoginSuccess,
  strictView,
  back,
  onSignUp,
}: {
  onLoginSuccess: () => void;
  strictView?: boolean;
  back?: () => void;
  onSignUp?: () => void;
}) => {
  const { setCurrentView, setTempData } = useAuthContext();

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

      const needsVerification = user.nextStep.signInStep === 'CONFIRM_SIGN_UP';

      if (needsVerification) {
        setTempData({
          email: data.email,
          password: data.password,
        });

        setCurrentView(IAuthModuleKeys.verifyEmail);
        setloading(false);
        return;
      }

      // An invited driver signs in with the temporary password from their
      // invitation email and has to choose a real one before continuing.
      if (user.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setTempData({ email: data.email });
        setCurrentView(IAuthModuleKeys.forcePasswordChange);
        setloading(false);
        return;
      }

      if (user.isSignedIn) {
        await onLoginSuccess();
        setloading(false);
        return;
      }

      // Anything else (MFA, TOTP setup…) isn't handled here. Say so rather than
      // silently doing nothing, which is indistinguishable from a broken app.
      console.warn('Unhandled signInStep:', user.nextStep.signInStep);
      setloading(false);
      Alert.alert(
        'Additional step required',
        'Your account needs an extra verification step that this app cannot complete. Please contact your operator.'
      );
      await signOut();
    } catch (error: any) {
      console.log(':::result', error);
      setloading(false);
      Alert.alert('Login Failed', 'Invalid email or password');
      await signOut();
    }
  };

  return (
    <View style={styles.keyboardView}>
      <View style={styles.formCard}>
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                variant="light"
                leftIcon={<Icons.Mail size={16} color="#6B7280" />}
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
                variant="light"
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
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
          {!strictView && (
            <View style={styles.optionsRow}>
              <TextButton
                size={ButtonSize.LARGE}
                title="Forgot Password?"
                onPress={() => {
                  setCurrentView(IAuthModuleKeys.forcePasswordChange);
                }}
              />
            </View>
          )}

          <PrimaryButton
            onPress={handleSubmit(onSubmit)}
            title="Sign In"
            loading={loading}
            size={ButtonSize.XLARGE}
          />
        </View>
        {back && (
          <View style={[styles.footer]}>
            <TextButton
              textStyle={styles.signUpLink}
              title="Back"
              size={ButtonSize.SMALL}
              onPress={() => {
                back();
              }}
            />
          </View>
        )}
        {!strictView && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TextButton
              textStyle={styles.signUpLink}
              title="Sign Up"
              size={ButtonSize.SMALL}
              onPress={onSignUp}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
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
    fontSize: 17,
    color: '#6B7280',
    textAlign: 'center',
  },
  formCard: {
    marginBottom: 24,
    flex: 1,
  },
  form: {
    gap: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
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
    fontSize: 15,
    color: '#374151',
  },
  forgotPassword: {
    fontSize: 15,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 17,
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: 17,
  },
  testCredentials: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: theme.borderRadius.sm,
  },
  testTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  testText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
});
