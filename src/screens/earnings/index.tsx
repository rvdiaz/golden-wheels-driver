import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useQuery, useReactiveVar } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';
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

import { BalanceCardSkeleton, LedgerListSkeleton } from '~/components/loadingSkeletons';

import {
  getDriverBalanceQuery,
  getDriverLedgerQuery,
  toDriverBalance,
  toLedgerItems,
  RawDriverBalance,
  RawDriverLedgerPage,
} from './graphql/queries';
import { DriverBalance, LedgerEntry } from './interfaces';
import { LedgerDetailModal } from './components/ledgerDetailModal';
import { EarningsChart } from './components/earningsChart';

const PAGE_SIZE = 25;
/**
 * The chart's own window. It reads its own page rather than the list's because
 * the list pages 25 at a time — a driver with a busy month would have every
 * earlier month render as a false zero until they happened to scroll far
 * enough. One wider read keeps the six months honest regardless of scrolling.
 */
const CHART_WINDOW = 200;

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

const LedgerRow = ({
  entry,
  first,
  last,
  balanceAfter,
  onPress,
}: {
  entry: LedgerEntry;
  first: boolean;
  last: boolean;
  /** Running balance the moment this entry landed. */
  balanceAfter?: number;
  onPress: () => void;
}) => {
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
    <TouchableOpacity
      style={[rowStyles.row, first && rowStyles.rowFirst, last && rowStyles.rowLast]}
      activeOpacity={0.6}
      onPress={onPress}>
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
      </View>

      <View style={rowStyles.amounts}>
        <Text style={[rowStyles.amount, { color: accent }]}>
          {isCredit ? '+' : '−'}
          {formatCurrency(Math.abs(entry.amount), entry.currencyCode)}
        </Text>
        {balanceAfter !== undefined && (
          <Text style={rowStyles.running} numberOfLines={1}>
            {t('earnings.runningBalance', {
              amount: formatCurrency(balanceAfter, entry.currencyCode),
            })}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export const EarningsScreen = () => {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const userInfo = useReactiveVar(userData);

  const skip = !userInfo?.id;

  const { data: balanceData, refetch: refetchBalance } = useQuery<{
    getDriverBalance: RawDriverBalance;
  }>(getDriverBalanceQuery, {
    variables: { tenantID: ENV_Vars.TENANT_ID },
    fetchPolicy: 'network-only',
    skip,
  });

  const {
    data: ledgerData,
    loading,
    refetch: refetchLedger,
    fetchMore,
  } = useQuery<{ getDriverLedger: RawDriverLedgerPage }>(getDriverLedgerQuery, {
    variables: { tenantID: ENV_Vars.TENANT_ID, limit: PAGE_SIZE },
    fetchPolicy: 'network-only',
    // Without this, `loading` stays false during fetchMore and the footer
    // spinner never appears.
    notifyOnNetworkStatusChange: true,
    skip,
  });

  const { data: chartData, refetch: refetchChart } = useQuery<{
    getDriverLedger: RawDriverLedgerPage;
  }>(getDriverLedgerQuery, {
    variables: { tenantID: ENV_Vars.TENANT_ID, limit: CHART_WINDOW },
    // Cached months render instantly; the network pass corrects them behind it.
    fetchPolicy: 'cache-and-network',
    skip,
  });

  // Codidge returns `Prices` objects; the cards and rows below read flat numbers.
  // Reconciled once, at the boundary — see the normalizers in ./graphql/queries.
  const balance = useMemo(
    () => toDriverBalance(balanceData?.getDriverBalance),
    [balanceData]
  );
  const entries = useMemo(() => toLedgerItems(ledgerData?.getDriverLedger), [ledgerData]);
  const chartEntries = useMemo(() => toLedgerItems(chartData?.getDriverLedger), [chartData]);
  const nextToken = ledgerData?.getDriverLedger?.nextToken;

  const [selected, setSelected] = useState<LedgerEntry | null>(null);

  /**
   * Balance the moment each entry landed, so the driver can follow the total
   * accumulating down the list rather than only seeing today's figure.
   *
   * Derived rather than stored: the ledger SK is `TXN#{createdAt}#{entryId}`
   * read with ScanIndexForward:false, so entries are strictly newest-first and
   * the newest one's "after" balance *is* the current balance. Walking down and
   * subtracting each amount recovers every earlier balance exactly, and the
   * chain continues correctly across pages because they append in order.
   */
  const balanceAfterById = useMemo(() => {
    const map: Record<string, number> = {};
    if (balance?.balance === undefined) return map;

    let running = balance.balance;
    for (const entry of entries) {
      map[entry.entryId] = running;
      running -= entry.amount;
    }
    return map;
  }, [entries, balance?.balance]);

  /**
   * Payments are recorded by the owner in the admin panel, so the driver's
   * money can change while this screen is mounted with nothing to tell it.
   * The tab navigator keeps screens mounted, so network-only alone only ever
   * fetches once — refetching on focus is what makes a payment show up without
   * the driver knowing to pull down.
   */
  useFocusEffect(
    useCallback(() => {
      if (skip) return;
      refetchBalance();
      refetchLedger();
      refetchChart();
    }, [skip, refetchBalance, refetchLedger, refetchChart])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchBalance(), refetchLedger(), refetchChart()]);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = async () => {
    if (!nextToken || loading) return;

    await fetchMore({
      variables: { tenantID: ENV_Vars.TENANT_ID, limit: PAGE_SIZE, nextToken },
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

  // `skip` is included on purpose: while the user is still hydrating from
  // storage Apollo reports loading:false, which used to flash the "no earnings
  // yet" empty state before the first request had even been sent.
  const showSkeleton = skip || (loading && !refreshing && entries.length === 0);

  return (
    <PageSafeContainer style={styles.page}>
      <ScreenHeader title={t('earnings.title')} subtitle={t('earnings.subtitle')} />

      {showSkeleton ? (
        <View style={styles.skeleton}>
          <BalanceCardSkeleton />
          <LedgerListSkeleton />
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
              <EarningsChart
                entries={chartEntries}
                currencyCode={balance?.currencyCode ?? 'USD'}
              />
              {entries.length > 0 && (
                <Text style={styles.sectionTitle}>{t('earnings.historyTitle')}</Text>
              )}
            </View>
          }
          ItemSeparatorComponent={() => (
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
            </View>
          )}
          renderItem={({ item, index }) => (
            <LedgerRow
              entry={item}
              first={index === 0}
              last={index === entries.length - 1}
              balanceAfter={balanceAfterById[item.entryId]}
              onPress={() => setSelected(item)}
            />
          )}
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

      <LedgerDetailModal
        entry={selected}
        balanceAfter={selected ? balanceAfterById[selected.entryId] : undefined}
        onClose={() => setSelected(null)}
      />
    </PageSafeContainer>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  skeleton: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.xl,
  },
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
  /**
   * The divider between two rows *inside* the ledger card, so it carries the
   * card's fill and side borders too — otherwise the gradient shows through the
   * seam and the card looks sliced apart.
   */
  separator: {
    backgroundColor: theme.colors.cardBackground,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  // Inset past the icon so it aligns with the text, the usual list treatment.
  separatorLine: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
    marginLeft: 32 + theme.spacing.md + theme.spacing.lg,
  },
  empty: {
    ...surfaces.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 40,
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
    ...surfaces.card,
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
  /**
   * The rows collectively *are* the card — one continuous fill with only the
   * two ends rounded, rather than a card per row. A ledger is one record, not N
   * independent objects, and 25 separately-shadowed views would both read as
   * noise and cost 25 elevation layers on Android.
   */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.cardBackground,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  rowFirst: {
    borderTopWidth: 1,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  rowLast: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
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
  amounts: { alignItems: 'flex-end', gap: 2 },
  amount: { fontSize: 15, fontWeight: '700' },
  // Subordinate to the entry's own amount — it is context, not the headline.
  running: { fontSize: typography.xxs, color: theme.colors.textMuted },
});
