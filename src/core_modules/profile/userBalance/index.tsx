import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Icons from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { formatCurrency } from '~/custom_modules/tools/sections/mortgage_calculator/helpers';
import { BalancePurchasePricingPlanModal } from '~/custom_modules/iap/components/pricingPlanModal/balancePayments';

interface BalanceWidgetProps {
  balance: {
    amount: number;
    currency: string;
  };
}

export const BalanceWidget: React.FC<BalanceWidgetProps> = ({ balance }) => {
  const [balancePurchaseVisible, setBalancePurchaseVisible] = useState(false);

  const handleAddBalance = () => {
    setBalancePurchaseVisible(true);
  };

  const handleBalancePurchaseClose = () => {
    setBalancePurchaseVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.balanceSection}>
          <Text style={styles.label}>Balance</Text>
          <View
            style={{
              gap: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icons.Wallet size={24} />
            <Text style={styles.amount}>{formatCurrency(balance.amount, 2)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBalance} activeOpacity={0.7}>
          <Icons.Plus size={20} color="#2B7FFF" />
        </TouchableOpacity>
      </View>
      {/* Balance Purchase Modal - Handles the purchase flow */}
      <BalancePurchasePricingPlanModal
        visible={balancePurchaseVisible}
        onClose={handleBalancePurchaseClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  balanceSection: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
