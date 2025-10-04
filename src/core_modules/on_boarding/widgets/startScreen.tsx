import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient'; // or react-native-linear-gradient
import { TermsAndPrivacy } from './termsAndPrivacy';
import { Rocket } from 'lucide-react-native';
import { StepIcon } from './stepIcon';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { FadeTransition } from '~/codidge_components/UI/transitions/fadeIn';
import TextButton from '~/codidge_components/UI/button/TextButton';
import { theme } from '~/theme/theme';
import { AuthFormWrapper } from '~/core_modules/auth/authContainer';
import { SignInForm } from '~/codidge_components/auth/forms/sign_in';
import { getUserQuery } from '~/core_modules/auth/graphql/queries';
import { IUser } from '~/store/interface';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { pushTokenVar } from '~/store/user/pushToken';
import { updateUser } from '~/store/user';
import { signOut } from 'aws-amplify/auth/cognito';
import Background from '~/codidge_components/UI/backgroundImage';

interface StartScreenProps {
  onNext: () => void;
  onSave?: ({ started, timestamp }: { started: boolean; timestamp: string }) => void;
}

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const StartPointScreen = ({ onNext, onSave }: StartScreenProps) => {
  const [showLogin, setshowLogin] = useState(false);
  const [getUserFn] = useLazyQuery<{ getUser: IUser }>(getUserQuery);
  const pushToken = useReactiveVar(pushTokenVar);

  const handleGetStarted = () => {
    if (onSave) {
      onSave({ started: true, timestamp: new Date().toISOString() });
    }
    if (onNext) {
      onNext();
    }
  };

  const handleLoginSuccess = async (userId: string) => {
    try {
      const user = await getUserFn({
        variables: {
          tenant: {
            tenantId,
          },
          token: pushToken,
          userId,
        },
      });

      if (!user.data?.getUser) {
        console.error(user.error);
        throw Error('Error getting user');
      }

      updateUser(user.data?.getUser);
    } catch (error) {
      console.log('::::error getting customer', error);
      await signOut();
    }
  };

  if (showLogin) {
    return (
      <Background>
        <AuthFormWrapper
          header={
            <View style={styles.headerContainer}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={styles.image}
                  source={require('assets/auth.png')}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.mainTitle}>Sign In</Text>
            </View>
          }>
          <SignInForm
            strictView={true}
            onLoginSuccess={handleLoginSuccess}
            back={() => {
              setshowLogin(false);
            }}
          />
        </AuthFormWrapper>
      </Background>
    );
  }

  return (
    <Background>
      <View style={styles.container}>
        {/* Animated Background with Gradient Blobs */}
        {/* <View style={styles.gradientContainer}>
        <LinearGradient
          colors={['#1D0D66', '#2D1B8F', '#1D0D66']}
          style={StyleSheet.absoluteFillObject}
        />
      </View> */}
        <FadeTransition isVisible={true} style={{ flex: 1 }}>
          {/* Main Content Centered */}
          <View style={styles.centerContent}>
            <StepIcon icon={Rocket} />
            <Text style={styles.mainTitle}>Your journey starts here</Text>
            <Text style={styles.subtitle}>
              Share your goals and vision so we can build the perfect plan for you.
            </Text>
            <PrimaryButton
              onPress={handleGetStarted}
              size={ButtonSize.LARGE}
              title="Start now"
              style={styles.buttonStyle}
            />
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TextButton
                textStyle={styles.signInLink}
                title="Sign In"
                size={ButtonSize.SMALL}
                onPress={() => {
                  setshowLogin(true);
                }}
              />
            </View>
          </View>

          {/* Terms & Conditions at the Bottom */}
          <View style={styles.bottomContent}>
            <TermsAndPrivacy />
          </View>
        </FadeTransition>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blobGradient: {
    flex: 1,
    borderRadius: 999,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    zIndex: 1,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 16,
    letterSpacing: -0.5,
    width: '80%',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    marginBottom: 40,
    opacity: 0.9,
  },
  buttonStyle: {
    width: '100%',
  },
  bottomContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 16,
    color: '#FFF',
  },
  signInLink: {
    fontSize: 16,
    color: theme.colors.accent,
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  image: {
    width: 120,
  },
});
