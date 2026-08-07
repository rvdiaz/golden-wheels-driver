import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
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

// Passwordless: the driver proves who they are with a code emailed at sign-in time, so the
// only thing this form collects is the address to send it to.
const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setloading(true);

      // USER_AUTH is Cognito's choice-based flow. The participant pool allows PASSWORD and
      // EMAIL_OTP as first factors; an invited driver has no password, so Cognito answers with
      // the email-code challenge directly. Asking for it explicitly means a driver who *does*
      // have a password (they're also a customer) still gets the code rather than a password
      // prompt they'd have to remember.
      const user = await signIn({
        username: data.email,
        options: {
          authFlowType: 'USER_AUTH',
          preferredChallenge: 'EMAIL_OTP',
        },
      });

      // Cognito emailed a code. Hand off to the code screen — the Amplify session is held
      // internally, so nothing sensitive needs carrying between the two views.
      if (user.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE') {
        setTempData({ email: data.email });
        setCurrentView(IAuthModuleKeys.emailOtp);
        setloading(false);
        return;
      }

      if (user.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        setTempData({ email: data.email });
        setCurrentView(IAuthModuleKeys.verifyEmail);
        setloading(false);
        return;
      }

      if (user.isSignedIn) {
        await onLoginSuccess();
        setloading(false);
        return;
      }

      // Anything else (a password challenge, TOTP setup…) isn't handled here. Say so rather
      // than silently doing nothing, which is indistinguishable from a broken app.
      console.warn('Unhandled signInStep:', user.nextStep.signInStep);
      setloading(false);
      Alert.alert(
        'Additional step required',
        'Your account needs an extra verification step that this app cannot complete. Please contact your operator.'
      );
      await signOut();
    } catch (error: any) {
      console.log(':::signIn error', error);
      setloading(false);
      // Deliberately vague: the pool has PreventUserExistenceErrors enabled, and saying
      // "no such driver" here would undo that by letting anyone probe for addresses.
      Alert.alert(
        'Could not sign in',
        "We couldn't start sign-in for that address. Check it and try again."
      );
      await signOut().catch(() => undefined);
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

          <Text style={styles.passwordlessHint}>
            We'll email you a one-time code to sign in.
          </Text>

          <PrimaryButton
            onPress={handleSubmit(onSubmit)}
            title="Send me a code"
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
  passwordlessHint: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 12,
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
