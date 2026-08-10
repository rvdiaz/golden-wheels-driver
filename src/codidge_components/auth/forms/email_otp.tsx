import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as Icons from 'lucide-react-native';
import { confirmSignIn, signIn, signOut } from 'aws-amplify/auth/cognito';
import { useAuthContext } from '../context';
import { IAuthModuleKeys } from '../interfaces';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import TextButton from '~/codidge_components/UI/button/TextButton';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import Text from '~/codidge_components/UI/text';
import { ButtonSize } from '~/codidge_components/UI/button/types';

/**
 * The second half of passwordless sign-in: the driver types the code Cognito just emailed.
 *
 * There is no session or credential to carry from the sign-in screen — Amplify holds the
 * challenge internally, so this screen only needs the code. That also means the code is only
 * valid for the attempt started on the previous screen; going back and returning invalidates
 * it, which is why "Use a different email" restarts the flow rather than navigating.
 */

const schema = yup.object({
  code: yup
    .string()
    .required('Enter the code we emailed you')
    .matches(/^\d+$/, 'The code is digits only'),
});

interface OtpFormData {
  code: string;
}

export const EmailOtpForm = ({
  email,
  onSuccess,
}: {
  email: string;
  onSuccess: () => void | Promise<void>;
}) => {
  const { setCurrentView } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: { code: '' },
  });

  const onSubmit = async (data: OtpFormData) => {
    try {
      setLoading(true);
      const result = await confirmSignIn({ challengeResponse: data.code.trim() });

      if (result.isSignedIn) {
        await onSuccess();
        setLoading(false);
        return;
      }

      // Cognito wants something further. Nothing else is wired up on this pool, so say so
      // instead of leaving the driver on a screen that no longer does anything.
      console.warn('Unhandled signInStep after OTP:', result.nextStep?.signInStep);
      setLoading(false);
      Alert.alert(
        'Additional step required',
        'Your account needs an extra step this app cannot complete. Please contact your operator.'
      );
      await signOut().catch(() => undefined);
      setCurrentView(IAuthModuleKeys.signIn);
    } catch (error: any) {
      console.log(':::confirmSignIn error', error);
      setLoading(false);

      // A wrong code is recoverable — stay put so they can retype it. An expired or already
      // consumed challenge is not: Amplify has discarded the session, so the only way forward
      // is a fresh code.
      const expired =
        error?.name === 'NotAuthorizedException' || error?.name === 'UserNotFoundException';

      if (expired) {
        Alert.alert('That code has expired', 'We’ll take you back to request a new one.');
        await signOut().catch(() => undefined);
        setCurrentView(IAuthModuleKeys.signIn);
        return;
      }

      Alert.alert('Incorrect code', 'That code was not right. Check it and try again.');
    }
  };

  // Restart the flow rather than calling a "resend" API: Cognito has no resend for an in-flight
  // USER_AUTH challenge, so a new signIn is what actually produces a new code.
  const resend = async () => {
    try {
      setResending(true);
      await signOut().catch(() => undefined);
      await signIn({
        username: email,
        options: { authFlowType: 'USER_AUTH', preferredChallenge: 'EMAIL_OTP' },
      });
      setResending(false);
      Alert.alert('Code sent', `We emailed a new code to ${email}.`);
    } catch (error) {
      console.log(':::resend error', error);
      setResending(false);
      Alert.alert('Could not resend', 'Please go back and start again.');
    }
  };

  return (
    <View style={styles.keyboardView}>
      <View style={styles.formCard}>
        <Text style={styles.intro}>
          We emailed a code to <Text style={styles.email}>{email}</Text>. Enter it below to
          finish signing in.
        </Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                variant="light"
                leftIcon={<Icons.KeyRound size={16} color="#6B7280" />}
                label="Code"
                placeholder="123456"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                error={!!errors.code}
                errorMessage={errors.code?.message}
                autoCapitalize="none"
                autoComplete="one-time-code"
              />
            )}
          />

          <PrimaryButton
            onPress={handleSubmit(onSubmit)}
            title="Sign in"
            loading={loading}
            size={ButtonSize.XLARGE}
          />
        </View>

        <View style={styles.footer}>
          <TextButton
            title={resending ? 'Sending…' : 'Send a new code'}
            size={ButtonSize.SMALL}
            onPress={resend}
          />
        </View>
        <View style={styles.footer}>
          <TextButton
            title="Use a different email"
            size={ButtonSize.SMALL}
            onPress={async () => {
              await signOut().catch(() => undefined);
              setCurrentView(IAuthModuleKeys.signIn);
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Deliberately NOT flex: 1 — these sit inside AuthFormWrapper's ScrollView.
  //
  // A flex: 1 child pins the content to exactly the viewport height, so the ScrollView never
  // has anything to scroll: content that does not fit is simply clipped. With the keyboard up
  // the viewport is roughly half as tall, which is how the code input ended up off-screen and
  // unreachable on iOS — you could not scroll to it, because as far as the ScrollView was
  // concerned the content already fitted.
  //
  // Left over from when each form carried its own KeyboardAvoidingView (hence the name).
  // AuthFormWrapper owns keyboard avoidance now; these are plain content views and must size
  // to their content so the scroll view can do its job.
  keyboardView: { paddingVertical: 20 },
  formCard: { marginBottom: 24 },
  form: { gap: 8 },
  intro: { fontSize: 15, color: '#4B5563', lineHeight: 22, marginBottom: 16 },
  email: { fontWeight: '600', color: '#111827' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
});
