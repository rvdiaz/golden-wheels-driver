import React from 'react';
import { paywallVisibility } from '~/store/subscription';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import TextButton from '~/codidge_components/UI/button/TextButton';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // or react-native-linear-gradient
import { theme } from '~/theme/theme';

export const SubscriptionCardButton = () => {

  return (
    <View style={styles.container}>
      <LinearGradient
       colors={[theme.colors.primary, '#6366F1', theme.colors.info]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        {/* Decorative elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        
        <View style={styles.content}>
          {/* Crown Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.crownIcon}>👑</Text>
          </View>
          
          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.subtitle}>
            Unlock all features and get unlimited access
          </Text>
          
          {/* Feature highlights */}
         {/*  <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>Ad-free experience</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>Advanced features</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>Priority support</Text>
            </View>
          </View> */}

          {/* CTA Button */}
          <View style={styles.buttonContainer}>
            <TextButton
              onPress={() => paywallVisibility(true)}
              size={ButtonSize.LARGE}
              title="Get Premium Now"
              style={styles.button}
            />
          </View>          
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    marginHorizontal: 16,
  },
  gradientCard: {
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -40,
    right: -40,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -20,
    left: -20,
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  crownIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  checkmark: {
    fontSize: 18,
    color: '#4ade80',
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    // Override button text color if needed
  },
  
});