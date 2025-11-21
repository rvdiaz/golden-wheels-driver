import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '~/codidge_components/UI/text';
import {
  paywallVisibility,
  setPaywallVisibility,
  subscriptionStatusData,
} from '~/store/subscription';
import { useReactiveVar } from '@apollo/client';
import { theme } from '~/theme/theme';
import { PricingPlanItem } from './pricingPlanItem';
import { useSubscriptionPlanList } from '../hooks/useSubscriptionPlanList';
import type { ProductSubscription } from 'expo-iap';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextButton from '~/codidge_components/UI/button/TextButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { useSystemSettings } from '~/system_setting/customHook';

export interface IPricingPlanModalViewProps {
  subscriptions: ProductSubscription[];
  requestPurchase: (sku: string) => void;
  termsOfUseUrl?: string;
  privacyPolicyUrl?: string;
}

export const PricingPlanModalView = (args: IPricingPlanModalViewProps) => {
  const legal = useSystemSettings().legal;

  const { subscriptions, requestPurchase, termsOfUseUrl, privacyPolicyUrl } = args;
  const { planName, hasActiveSubscription } = useReactiveVar(subscriptionStatusData);

  const insets = useSafeAreaInsets();

  const visible = useReactiveVar(paywallVisibility);
  const onClose = () => setPaywallVisibility(false);

  const { plans: allPlans } = useSubscriptionPlanList();

  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');

  const plans = useMemo(
    () =>
      allPlans.filter(
        (plan) =>
          ['', billingPeriod].includes(plan.billingPeriod ?? '') &&
          (plan.productId === 'free-lifetime' ||
            subscriptions?.some((product) => product.id === plan.productId))
      ),
    [allPlans, subscriptions, billingPeriod]
  );

  const changeBillingPeriod = (period: 'monthly' | 'annually') => {
    setBillingPeriod(period);
  };

  const getSubscriptionForPlan = (planId: string) => {
    return subscriptions.find((sub) => sub.id === planId);
  };

  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent>
      <StatusBar barStyle="light-content" />
      <View
        style={[
          styles.modalContainer,
          {
            paddingTop: insets.top,
            marginBottom: insets.bottom - 40,
          },
        ]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose Your Plan</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          <View style={styles.contentContainer}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  billingPeriod === 'monthly' && styles.toggleButtonActive,
                ]}
                onPress={() => changeBillingPeriod('monthly')}>
                <Text
                  style={[
                    styles.toggleButtonText,
                    billingPeriod === 'monthly' && styles.toggleButtonTextActive,
                  ]}>
                  Monthly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  billingPeriod === 'annually' && styles.toggleButtonActive,
                ]}
                onPress={() => changeBillingPeriod('annually')}>
                <Text
                  style={[
                    styles.toggleButtonText,
                    billingPeriod === 'annually' && styles.toggleButtonTextActive,
                  ]}>
                  Annually
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.plansContainer} showsVerticalScrollIndicator={false}>
              <TouchableOpacity activeOpacity={1}>
                {plans.map((plan) => (
                  <PricingPlanItem
                    key={plan.productId}
                    plan={plan}
                    subscription={getSubscriptionForPlan(plan.productId)}
                    isCurrentPlan={planName === plan.productId}
                    requestPurchase={requestPurchase}
                    allPlans={allPlans}
                  />
                ))}
              </TouchableOpacity>
              {!hasActiveSubscription && (
                <View style={styles.freeOptionContainer}>
                  <TextButton
                    onPress={() => {
                      onClose();
                    }}
                    style={{
                      backgroundColor: '#F3F4F6',
                      marginHorizontal: 16,
                      borderWidth: 1,
                      borderColor: '#E5E7EB',
                    }}
                    textStyle={{
                      fontWeight: '600',
                      color: '#6B7280',
                    }}
                    size={ButtonSize.LARGE}
                    title="Continue for Free"
                  />
                  <Text style={styles.noCardText}>No credit card required</Text>
                </View>
              )}
              {/* Apple Required Legal Text */}
              <View style={styles.legalContainer}>
                <Text style={styles.legalText}>
                  Payment will be charged to your{' '}
                  {Platform.OS === 'ios' ? 'Apple ID' : 'Google Play'} account. Subscription
                  automatically renews unless canceled at least 24 hours before the end of the
                  billing period. You can manage or cancel your subscription in your{' '}
                  {Platform.OS === 'ios' ? 'App Store' : 'Google Play'} account settings.
                </Text>

                <View style={styles.legalLinks}>
                  <TouchableOpacity
                    onPress={() =>
                      openURL(
                        termsOfUseUrl ??
                          legal.mvbTemrsOfUse ??
                          'https://myvirtualboss.com/privacy-policy/'
                      )
                    }>
                    <Text style={styles.legalLinkText}>Terms of Use</Text>
                  </TouchableOpacity>
                  <Text style={styles.legalSeparator}> • </Text>
                  <TouchableOpacity
                    onPress={() =>
                      openURL(
                        privacyPolicyUrl ??
                          legal.mvbPolicy ??
                          'https://myvirtualboss.com/privacy-policy/'
                      )
                    }>
                    <Text style={styles.legalLinkText}>Privacy Policy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: theme.colors.headerBackground,
    flex: 1,
  },
  modalContent: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    width: '100%',
  },
  closeButton: {
    padding: 4,
    position: 'absolute',
    right: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  toggleButtonTextActive: {
    color: '#1F2937',
  },
  plansContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  freeOptionContainer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  noCardText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
    fontWeight: '400',
  },
  legalContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  legalText: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalLinkText: {
    fontSize: 11,
    color: '#4F46E5',
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 11,
    color: '#6B7280',
  },
});
