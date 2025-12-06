import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Background from '~/codidge_components/UI/backgroundImage';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import Text from '~/codidge_components/UI/text';
import { FadeTransition } from '~/codidge_components/UI/transitions/fadeIn';
import { welcomeScreen } from './welcomeScreen';
import { userData } from './index';

export const WelcomeScreenModal = () => {
  const visible = useReactiveVar(welcomeScreen);
  const user = useReactiveVar(userData);

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <Background
        style={{
          height: '100%',
          backgroundColor: '#7C3AED', // Purple background
        }}>
        <View style={styles.container}>
          <FadeTransition isVisible={true} style={{ flex: 1 }}>
            <View style={styles.centerContent}>
              <Text style={styles.greeting}>Welcome, {user?.firstName}!</Text>

              <Text style={styles.mainTitle}>🎉 You've Got 1 Month Free!</Text>

              <View style={styles.middleSection}>
                <View style={styles.card}>
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Trial Duration</Text>
                    <Text style={styles.cardValue}>1 Month</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Cost</Text>
                    <Text style={styles.cardValue}>$0</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Access</Text>
                    <Text style={styles.cardValue}>Everything</Text>
                  </View>
                </View>

                <Text style={styles.disclaimer}>
                  You get 1 month of full access for free. No payment required. After your trial,
                  premium features will no longer be available unless you upgrade.
                </Text>
              </View>

              <PrimaryButton
                onPress={() => {
                  welcomeScreen(false);
                }}
                size={ButtonSize.LARGE}
                title="Start My Free Trial"
                style={styles.buttonStyle}
              />
            </View>
          </FadeTransition>
        </View>
      </Background>
    </Modal>
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
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    flex: 1,
    zIndex: 1,
  },
  greeting: {
    fontSize: 30,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonStyle: {
    width: '100%',
    marginTop: 30,
  },
  middleSection: {
    alignItems: 'center',
    gap: 16,
    justifyContent: 'center',
    width: '100%',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: -10,
    letterSpacing: -1,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    marginTop: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 8,
  },
  disclaimer: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.75,
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
});
