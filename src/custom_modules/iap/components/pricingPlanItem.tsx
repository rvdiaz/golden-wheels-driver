import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { formatPrice } from '~/custom_modules/tools/sections/mls_listing/helpers';
import { SubscriptionPlan } from '../interfaces';
import { ProductSubscription, ProductSubscriptionAndroid, ProductSubscriptionIOS } from 'expo-iap';

interface PricingPlanItemProps {
  plan: SubscriptionPlan;
  subscription?: ProductSubscription;
  isSelected: boolean;
  setSelected: (productId: string) => void;
}

export const PricingPlanItem = (props: PricingPlanItemProps) => {
  const { plan, subscription, isSelected, setSelected } = props;
  const [expanded, setExpanded] = useState(false);

  const firstBillingDate = useMemo(() => {
    const date = new Date();
    const days = plan.hasTrial && plan.trialPeriodDays ? plan.trialPeriodDays : 0;
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }, [plan.trialPeriodDays, plan.hasTrial]);

  const data = useMemo(() => {
    if (subscription?.platform === 'ios') {
      const iosProductSubscription = subscription as ProductSubscriptionIOS;

      const hasTrial =
        !!iosProductSubscription?.introductoryPricePaymentModeIOS &&
        iosProductSubscription?.introductoryPricePaymentModeIOS !== 'empty';

      const priceDifference = !!iosProductSubscription?.price
        ? plan.price - iosProductSubscription.price
        : 0;

      const discount =
        priceDifference > 0 ? `Save ${((priceDifference / plan.price) * 100).toFixed(0)}%` : '';

      return {
        price: iosProductSubscription?.price || plan.price,
        hasTrial,
        discount,
      };
    }

    const androidProductSubscription = subscription as ProductSubscriptionAndroid;

    return {
      price: androidProductSubscription?.price || plan.price,
      hasTrial: plan.hasTrial,
      discount: plan.discount || '',
    };
  }, [subscription, plan]);

  return (
    <View key={plan.productId} style={[styles.planCard, isSelected && styles.planCardSelected]}>
      <View style={styles.planHeader}>
        <View style={styles.planHeaderLeft}>
          <View style={styles.planNameRow}>
            <Text style={styles.planName}>{plan.name}</Text>
            {plan.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{plan.badge}</Text>
              </View>
            )}
          </View>
          <Text style={styles.planDescription}>{plan.description}</Text>
        </View>
        {isSelected && <Ionicons name="checkmark-circle" size={24} color="#4F46E5" />}
      </View>

      {!!data.price && (
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {plan.hasTrial ? formatPrice(0, 2) : formatPrice(data.price, 2)}
            </Text>
            <View>
              {plan.hasTrial && (
                <Text style={styles.trialText}>then {formatPrice(data.price, 2)}</Text>
              )}
              {plan.billingPeriod && (
                <Text style={styles.billingPeriod}>
                  billed {plan.billingPeriod === 'monthly' ? 'monthly' : 'annually'}
                  {plan.hasTrial && `, starting on ${firstBillingDate}`}
                </Text>
              )}
            </View>
          </View>
          {data.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{data.discount}</Text>
            </View>
          )}
        </View>
      )}

      {plan.features.length > 0 && (
        <>
          <TouchableOpacity
            style={styles.whatsIncludedHeader}
            onPress={() => setExpanded(!expanded)}>
            <Text style={styles.whatsIncludedText}>What&apos;s included</Text>
            <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#4F46E5" />
          </TouchableOpacity>

          {expanded && (
            <View style={styles.featuresContainer}>
              {plan.features.map((feature) => (
                <View key={feature.id} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.featureText}>{feature.label}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      <TouchableOpacity
        onPress={() => setSelected(plan.productId)}
        style={styles.selectProductButton}>
        <Text style={styles.purchaseButtonText}>Select {plan.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardSelected: {
    borderColor: '#4F46E5',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planHeaderLeft: {
    flex: 1,
  },
  planNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  badge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  planDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  priceContainer: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1F2937',
  },
  trialText: {
    fontSize: 14,
    color: '#4F46E5',
    marginBottom: 2,
  },
  billingPeriod: {
    fontSize: 14,
    color: '#6B7280',
  },
  discountBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  whatsIncludedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  whatsIncludedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  selectProductButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
