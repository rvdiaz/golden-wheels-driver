import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '~/codidge_components/UI/text';
import { paywallVisibility, setPaywallVisibility } from '~/store/subscription';
import { useReactiveVar } from '@apollo/client';
import { theme } from '~/theme/theme';
import { PricingPlanItem } from './pricingPlanItem';
import { useSubscriptionPlanList } from '../hooks/useSubscriptionPlanList';
import type { ProductSubscription } from 'expo-iap';

export interface IPricingPlanModalViewProps {
  subscriptions: ProductSubscription[];
  requestPurchase: (sku: string) => void;
}

export const PricingPlanModalView = (args: IPricingPlanModalViewProps) => {
  const { subscriptions, requestPurchase } = args;

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

  const [selectedPlan, setSelectedPlan] = useState<string>(
    plans.find((plan) => 'monthly' === plan.billingPeriod)?.productId || plans[0]?.productId || ''
  );

  const changeBillingPeriod = (period: 'monthly' | 'annually') => {
    setBillingPeriod(period);
    setSelectedPlan(
      plans.find((plan) => period === plan.billingPeriod)?.productId || plans[0]?.productId || ''
    );
  };

  const isPlanSelected = (planId: string) => selectedPlan === planId;

  useEffect(() => {
    if (selectedPlan) return;
    setSelectedPlan(
      plans.find((plan) => plan.billingPeriod === billingPeriod)?.productId ||
        plans[0]?.productId ||
        ''
    );
  }, [selectedPlan, billingPeriod, plans]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent>
      <StatusBar barStyle="light-content" />
      <View style={styles.modalContainer}>
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
                    isSelected={isPlanSelected(plan.productId)}
                    setSelected={setSelectedPlan}
                  />
                ))}
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.continueButton,
                (!selectedPlan || selectedPlan.startsWith('free-')) && { opacity: 0.6 },
              ]}
              disabled={!selectedPlan || selectedPlan.startsWith('free-')}
              onPress={() => requestPurchase(selectedPlan)}>
              <Text style={styles.continueButtonText}>Continue and pay</Text>
            </TouchableOpacity>
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
    paddingTop: StatusBar.currentHeight || 0,
    marginBottom: 24,
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
    marginBottom: 20,
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
  continueButton: {
    backgroundColor: '#4F46E5',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
