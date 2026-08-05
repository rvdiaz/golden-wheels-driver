import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Wallet, ArrowDownLeft, ArrowUpRight, Receipt } from 'lucide-react-native';

import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { ScreenHeader } from '~/codidge_components/UI/screenHeader';
import { LoadingSpinner } from '~/codidge_components/UI/loading/loadingSpinner';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { typography } from '~/theme/typography';
import { surfaces } from '~/theme/surfaces';
import { TKey, useTranslation } from '~/i18n';
import { userData } from '~/store/user';
import { ENV_Vars } from '~/store/env';
import { formatCurrency, formatMiamiTime } from '~/helpers';
import { TAB_BAR_CLEARANCE } from '~/navigation/bottomBar';

import { getDriverBalanceQuery, getDriverLedgerQuery } from './graphql/queries';
import { DriverBalance, DriverLedgerPage, LedgerEntry } from './interfaces';

const PAGE_SIZE = 25;

const PAYMENT_METHOD_KEY: Record<string, TKey> = {
  cash: 'earnings.methodCash',
  zelle: 'earnings.methodZelle',
  bank_transfer: 'earnings.methodBankTransfer',
  check: 'earnings.methodCheck',
  other: 'earnings.methodOther',
};

const formatDay = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : formatMiamiTime(d, 'date');
};

// ─── Balance hero ─────────────────────────────────────────────────────────────

const BalanceCard = ({ balance }: { balance?: DriverBalance }) => {
  const { t } = useTranslation();
  const currency = balance?.currencyCode ?? 'USD';

  return (
    <View style={heroStyles.card}>
      <View style={heroStyles.labelRow}>
        <Wallet size={14} color={theme.colors.primaryTextAccent} />
        <Text style={heroStyles.label}>{t('earnings.balanceLabel')}</Text>
      </View>

      <Text style={heroStyles.amount}>{formatCurrency(balance?.balance ?? 0, currency)}</Text>

      {!!balance?.lastEntryAt && (
        <Text style={heroStyles.caption}>
          {t('earnings.lastActivity', { date: formatDay(balance.lastEntryAt) })}
        </Text>
      )}

      <View style={heroStyles.divider} />

      <View style={heroStyles.statsRow}>
        <View style={heroStyles.stat}>
          <Text style={heroStyles.statLabel}>{t('earnings.totalEarned')}</Text>
          <Text style={heroStyles.statValue}>
            {formatCurrency(balance?.totalEarned ?? 0, currency)}
          </Text>
        </View>
        <View style={heroStyles.statSeparator} />
        <View style={heroStyles.stat}>
          <Text style={heroStyles.statLabel}>{t('earnings.totalPaid')}</Text>
          <Text style={heroStyles.statValue}>
            {formatCurrency(balance?.totalPaid ?? 0, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ─── Ledger row ───────────────────────────────────────────────────────────────

const LedgerRow = ({ entry }: { entry: LedgerEntry }) => {
  const { t } = useTranslation();

  // Keyed off the sign rather than the type string, so an entry type this build
  // has never heard of still renders with the right direction and colour.
  const isCredit = entry.amount >= 0;
  const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;
  const accent = isCredit ? theme.colors.success : theme.colors.primaryTextAccent;

  const methodKey = entry.paymentMethod ? PAYMENT_METHOD_KEY[entry.paymentMethod] : undefined;

  const title = isCredit
    ? (entry.bookingCode ?? t('earnings.typeEarning'))
    : t('earnings.typePayment');

  const subtitle = !isCredit && methodKey ? t('earnings.paidVia', { method: t(methodKey) }) : null;

  return (
    <View style={rowStyles.row}>
      <View style={[rowStyles.iconWrap, { backgroundColor: accent + '14' }]}>
        <Icon size={15} color={accent} />
      </View>

      <View style={rowStyles.text}>
        <Text style={rowStyles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={rowStyles.date}>
          {formatDay(entry.occurredAt)}
          {subtitle ? ` · ${subtitle}` : ''}
        </Text>
        {!!entry.paymentReference && (
          <Text style={rowStyles.reference} numberOfLines={1}>
            {entry.paymentReference}
          </Text>
        )}
      </View>

      <Text style={[rowStyles.amount, { color: accent }]}>
        {isCredit ? '+' : '−'}
        {formatCurrency(Math.abs(entry.amount), entry.currencyCode)}
      </Text>
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export const EarningsScreen = () => {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const userInfo = useReactiveVar(userData);

  const skip = !userInfo?.id;

  const { data: balanceData, refetch: refetchBalance } = useQuery<{
    getDriverBalance: DriverBalance;
  }>(getDriverBalanceQuery, {
    variables: { tenant: ENV_Vars.tenant },
    fetchPolicy: 'network-only',
    skip,
  });

  const {
    data: ledgerData,
    loading,
    refetch: refetchLedger,
    fetchMore,
  } = useQuery<{ getDriverLedger: DriverLedgerPage }>(getDriverLedgerQuery, {
    variables: { tenant: ENV_Vars.tenant, limit: PAGE_SIZE },
    fetchPolicy: 'network-only',
    // Without this, `loading` stays false during fetchMore and the footer
    // spinner never appears.
    notifyOnNetworkStatusChange: true,
    skip,
  });

  const balance = balanceData?.getDriverBalance;
  const entries = ledgerData?.getDriverLedger?.items ?? [];
  const nextToken = ledgerData?.getDriverLedger?.nextToken;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchBalance(), refetchLedger()]);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = async () => {
    if (!nextToken || loading) return;

    await fetchMore({
      variables: { tenant: ENV_Vars.tenant, limit: PAGE_SIZE, nextToken },
      // Pages are appended by hand: the default would replace the list, and the
      // cache cannot merge them itself because the page type carries no id.
      updateQuery: (previous, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previous;
        return {
          getDriverLedger: {
            ...fetchMoreResult.getDriverLedger,
            items: [
              ...(previous.getDriverLedger?.items ?? []),
              ...fetchMoreResult.getDriverLedger.items,
            ],
          },
        };
      },
    });
  };

  const showInitialSpinner = loading && !refreshing && entries.length === 0;

  return (
    <PageSafeContainer style={styles.page}>
      <ScreenHeader title={t('earnings.title')} subtitle={t('earnings.subtitle')} />

      {showInitialSpinner ? (
        <View style={styles.center}>
          <LoadingSpinner />
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.entryId}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <BalanceCard balance={balance} />
              {entries.length > 0 && (
                <Text style={styles.sectionTitle}>{t('earnings.historyTitle')}</Text>
              )}
            </View>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => <LedgerRow entry={item} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Receipt size={28} color={theme.colors.borderNeutralColor} />
              <Text style={styles.emptyText}>{t('earnings.empty')}</Text>
            </View>
          }
          ListFooterComponent={
            loading && entries.length > 0 ? (
              <View style={styles.footer}>
                <LoadingSpinner />
              </View>
            ) : null
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}
    </PageSafeContainer>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: TAB_BAR_CLEARANCE,
    paddingTop: theme.spacing.md,
  },
  header: { gap: theme.spacing.lg, marginBottom: theme.spacing.md },
  sectionTitle: {
    fontSize: typography.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: theme.colors.textColor,
  },
  separator: { height: 1, backgroundColor: theme.colors.cardBorder },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 40,
  },
  emptyText: {
    fontSize: typography.md,
    color: theme.colors.textColor,
    textAlign: 'center',
  },
  footer: { paddingVertical: theme.spacing.lg },
});

const heroStyles = StyleSheet.create({
  card: {
    ...surfaces.floating,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: {
    fontSize: typography.xs,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: theme.colors.textColor,
  },
  amount: {
    fontSize: 34,
    fontWeight: '700',
    color: theme.colors.primaryText,
    marginTop: 6,
  },
  caption: { fontSize: typography.xs, color: theme.colors.textColor, marginTop: 2 },
  divider: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
    marginVertical: theme.spacing.md,
  },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, gap: 2 },
  statSeparator: {
    width: 1,
    height: 28,
    backgroundColor: theme.colors.cardBorder,
    marginHorizontal: theme.spacing.md,
  },
  statLabel: { fontSize: typography.xs, color: theme.colors.textColor },
  statValue: {
    fontSize: typography.md,
    fontWeight: '700',
    color: theme.colors.primaryText,
  },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 1 },
  title: {
    fontSize: typography.md,
    fontWeight: '600',
    color: theme.colors.primaryText,
  },
  date: { fontSize: typography.xs, color: theme.colors.textColor },
  reference: { fontSize: typography.xs, color: theme.colors.secondaryText },
  amount: { fontSize: 15, fontWeight: '700' },
});
