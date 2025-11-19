import { TouchableOpacity, View, StyleSheet, Platform, Linking } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { formatPrice } from '~/custom_modules/tools/sections/mls_listing/helpers';
import { SubscriptionPlan } from '../interfaces';
import { ProductSubscription, ProductSubscriptionAndroid, ProductSubscriptionIOS } from 'expo-iap';
import { Badge } from '~/codidge_components/UI/badge';
import TextButton from '~/codidge_components/UI/button/TextButton';
import { theme } from '~/theme/theme';
import { ButtonSize } from '~/codidge_components/UI/button/types';

interface PricingPlanItemProps {
  plan: SubscriptionPlan;
  subscription?: ProductSubscription;
  isCurrentPlan?: boolean;
  requestPurchase: (sku: string) => void;
}

export const PricingPlanItem = (props: PricingPlanItemProps) => {
  const { plan, subscription, isCurrentPlan, requestPurchase } = props;

  const [expanded, setExpanded] = useState(false);

  const openSubscriptionManagement = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('itms-apps://apps.apple.com/account/subscriptions');
    } else if (Platform.OS === 'android') {
      Linking.openURL('https://play.google.com/store/account/subscriptions');
    }
  };

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
    <View
      key={plan.productId}
      style={[
        styles.planCard,
        {
          borderColor: isCurrentPlan ? '#4F46E5' : theme.colors.primaryBodyBackground,
        },
      ]}>
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
        {isCurrentPlan && (
          <Badge
            style={{
              marginHorizontal: 'auto',
            }}
            type="success"
            displayIcon={false}>
            Current Plan
          </Badge>
        )}
      </View>

      {!!data.price && (
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {plan.hasTrial ? formatPrice(0, 2) : formatPrice(data.price, 2)}
            </Text>
            <View
              style={{
                marginBottom: 5,
              }}>
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

      {!isCurrentPlan ? (
        <TouchableOpacity
          onPress={() => requestPurchase(plan.productId)}
          style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Subscribe Now</Text>
        </TouchableOpacity>
      ) : (
        <TextButton
          onPress={() => {
            openSubscriptionManagement();
          }}
          title="Unsubscribe"
          size={ButtonSize.LARGE}
          textStyle={{
            color: theme.colors.danger,
          }}
        />
      )}
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
  continueButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});
