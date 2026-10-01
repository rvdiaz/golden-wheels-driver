import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { Wallet } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { surfaces } from '~/theme/surfaces';
import { ENV_Vars } from '~/store/env';
import { formatCurrency } from '~/helpers';
import { useTranslation } from '~/i18n';
import {
  getDriverBalanceQuery,
  RawDriverBalance,
  toDriverBalance,
} from '~/screens/earnings/graphql/queries';

/**
 * Shown only when the operator still owes the driver money: deleting the account does not
 * settle or forfeit it, and the driver should know that before confirming.
 */
export const BalanceNotice = () => {
  const { t } = useTranslation();
  const { data } = useQuery<{ getDriverBalance: RawDriverBalance }>(getDriverBalanceQuery, {
    variables: { tenantID: ENV_Vars.TENANT_ID },
    fetchPolicy: 'cache-and-network',
  });

  const balance = toDriverBalance(data?.getDriverBalance);
  if (!balance || balance.balance <= 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Wallet size={18} color={theme.colors.primaryTextAccent} />
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>{t('earnings.balanceLabel')}</Text>
        <Text style={styles.amount}>{formatCurrency(balance.balance, balance.currencyCode)}</Text>
        <Text style={styles.note}>{t('account.deleteBalanceNote')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...surfaces.card,
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primaryBodyBackground,
    borderColor: theme.colors.primaryAlpha[35],
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryAlpha[10],
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 2 },
  label: { fontSize: 14, color: theme.colors.textColor },
  amount: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.primaryText,
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.secondaryText,
    marginTop: 4,
  },
});
