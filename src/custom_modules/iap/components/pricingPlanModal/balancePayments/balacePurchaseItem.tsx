import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { formatPrice } from '~/custom_modules/tools/sections/mls_listing/helpers';
import { theme } from '~/theme/theme';

interface BalancePurchaseOption {
  productId: string;
  name: string;
  description: string;
  price: number;
  balanceAmount: number;
  badge?: string;
  bonusPercentage?: number;
  features?: string[];
  isPopular?: boolean;
}

interface BalancePurchaseItemProps {
  option: BalancePurchaseOption;
  product?: any;
  requestPurchase: (sku: string) => void;
}

export const BalancePurchaseItem = (props: BalancePurchaseItemProps) => {
  const { option, product, requestPurchase } = props;

  const [expanded, setExpanded] = useState(false);

  const productPrice = useMemo(() => {
    return product?.price || option.price;
  }, [product, option.price]);

  const totalBalance = useMemo(() => {
    const bonus = option.bonusPercentage
      ? option.balanceAmount * (option.bonusPercentage / 100)
      : 0;
    return option.balanceAmount + bonus;
  }, [option.balanceAmount, option.bonusPercentage]);

  return (
    <View
      style={[
        styles.optionCard,
        {
          borderColor: option.isPopular ? '#4F46E5' : theme.colors.primaryBodyBackground,
          borderWidth: option.isPopular ? 2 : 1,
        },
      ]}>
      {/* Popular Badge */}
      {option.isPopular && (
        <View style={styles.popularBadge}>
          <Ionicons name="star" size={12} color="#FFFFFF" />
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}

      <View
        style={[
          styles.optionHeader,
          {
            marginTop: option.isPopular ? 8 : 0,
          },
        ]}>
        <View style={styles.optionHeaderLeft}>
          <View style={styles.optionNameRow}>
            <Text style={styles.optionName}>{option.name}</Text>
            {option.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{option.badge}</Text>
              </View>
            )}
          </View>
        </View>
        {option.bonusPercentage && option.bonusPercentage > 0 && (
          <View style={styles.bonusBadge}>
            <Ionicons name="gift" size={14} color="#059669" />
            <Text style={styles.bonusText}>+{option.bonusPercentage}% Bonus</Text>
          </View>
        )}
      </View>
      <Text style={styles.optionDescription}>{option.description}</Text>
      {/* Balance and Price Display */}
      <View style={styles.valueContainer}>
        <View style={styles.balanceDisplay}>
          <View style={styles.balanceRow}>
            <Ionicons name="cash" size={28} color="#10B981" />
            <View style={styles.balanceTextContainer}>
              <Text style={styles.balanceValue}>${totalBalance.toFixed(2)}</Text>
              <Text style={styles.balanceLabel}>Balance Added</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceDisplay}>
          <Text style={styles.price}>{formatPrice(productPrice, 2)}</Text>
          <Text style={styles.oneTimeText}>One-time payment</Text>
        </View>
      </View>

      {/* Value Banner (optional) */}
      {option.bonusPercentage && option.bonusPercentage >= 20 && (
        <View style={styles.valueBanner}>
          <Ionicons name="information-circle" size={16} color="#7C3AED" />
          <Text style={styles.valueText}>
            Best value! Get an extra $
            {(option.balanceAmount * (option.bonusPercentage / 100)).toFixed(2)} free
          </Text>
        </View>
      )}

      {/* Features Section */}
      {option.features && option.features.length > 0 && (
        <>
          <TouchableOpacity
            style={styles.whatsIncludedHeader}
            onPress={() => setExpanded(!expanded)}>
            <Text style={styles.whatsIncludedText}>Benefits</Text>
            <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#4F46E5" />
          </TouchableOpacity>

          {expanded && (
            <View style={styles.featuresContainer}>
              {option.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      {/* Purchase Button */}
      <TouchableOpacity
        onPress={() => requestPurchase(option.productId)}
        style={[styles.purchaseButton, option.isPopular && styles.purchaseButtonPopular]}>
        <Text
          style={[styles.purchaseButtonText, option.isPopular && styles.purchaseButtonTextPopular]}>
          Add to Balance
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 1,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  optionHeaderLeft: {
    flex: 1,
  },
  optionNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  optionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  badge: {
    backgroundColor: '#FBBF24',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#78350F',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  balanceDisplay: {
    flex: 1,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceTextContainer: {
    flex: 1,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10B981',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  bonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginLeft: 44,
  },
  bonusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  priceDisplay: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  oneTimeText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  valueBanner: {
    backgroundColor: '#F5F3FF',
    borderLeftWidth: 3,
    borderLeftColor: '#7C3AED',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    fontSize: 13,
    color: '#6B21A8',
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  whatsIncludedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
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
  purchaseButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  purchaseButtonPopular: {
    backgroundColor: '#4F46E5',
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  purchaseButtonTextPopular: {
    color: '#FFFFFF',
  },
});
