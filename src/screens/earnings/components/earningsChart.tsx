import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { typography } from '~/theme/typography';
import { surfaces } from '~/theme/surfaces';
import { useTranslation } from '~/i18n';
import { formatCurrency } from '~/helpers';

import { LedgerEntry } from '../interfaces';

const MONTHS = 6;
/** Cap, not a fill: the band's leftover is deliberate air. */
const MAX_BAR_WIDTH = 24;
const CHART_HEIGHT = 132;
const BAR_RADIUS = 4;

interface Bucket {
  key: string;
  label: string;
  amount: number;
  trips: number;
}

/**
 * Earnings per calendar month, oldest first.
 *
 * Only credits count. A PAYMENT is the owner settling what they already owed —
 * it is money moving, not work done, and bucketing it here would both
 * double-count the month and let a big payout look like a great month of
 * driving.
 */
const bucketByMonth = (entries: LedgerEntry[], locale: string): Bucket[] => {
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'short' });
  const buckets: Bucket[] = [];
  const index: Record<string, Bucket> = {};

  // Seed every month in range so a month with no work reads as a real zero
  // rather than collapsing the axis and shifting the others along.
  const now = new Date();
  for (let i = MONTHS - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = { key, label: monthLabel.format(d), amount: 0, trips: 0 };
    index[key] = bucket;
    buckets.push(bucket);
  }

  for (const entry of entries) {
    if (entry.amount <= 0) continue;
    const d = new Date(entry.occurredAt);
    if (isNaN(d.getTime())) continue;

    const bucket = index[`${d.getFullYear()}-${d.getMonth()}`];
    if (!bucket) continue; // older than the window
    bucket.amount += entry.amount;
    bucket.trips += 1;
  }

  return buckets;
};

export const EarningsChart = ({
  entries,
  currencyCode,
}: {
  entries: LedgerEntry[];
  currencyCode: string;
}) => {
  const { t, language } = useTranslation();
  const [width, setWidth] = useState(0);
  // No hover on a phone, so selection is the tooltip: tapping a column moves
  // the read-out above the chart rather than floating a label over the bars.
  const [selected, setSelected] = useState<number | null>(null);

  const buckets = useMemo(
    () => bucketByMonth(entries, language === 'es' ? 'es-ES' : 'en-US'),
    [entries, language]
  );

  const max = Math.max(...buckets.map((b) => b.amount), 0);
  const current = buckets[buckets.length - 1];
  const previous = buckets[buckets.length - 2];
  const shown = selected === null ? current : buckets[selected];

  const delta = useMemo(() => {
    if (!previous || previous.amount <= 0) return null;
    return ((current.amount - previous.amount) / previous.amount) * 100;
  }, [current, previous]);

  if (max <= 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{t('earnings.chartTitle')}</Text>
        <Text style={styles.empty}>{t('earnings.chartEmpty')}</Text>
      </View>
    );
  }

  const band = width > 0 ? width / buckets.length : 0;
  const barWidth = Math.min(MAX_BAR_WIDTH, band * 0.56);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('earnings.chartTitle')}</Text>
      <Text style={styles.subtitle}>{t('earnings.chartSubtitle')}</Text>

      {/* The read-out carries the value, which is why no bar needs a label. */}
      <View style={styles.readout}>
        <Text style={styles.readoutAmount}>{formatCurrency(shown?.amount ?? 0, currencyCode)}</Text>
        <Text style={styles.readoutLabel}>
          {selected === null ? t('earnings.thisMonth') : (shown?.label ?? '')}
          {shown && shown.trips > 0
            ? ` · ${t('earnings.tripsInMonth', { count: shown.trips })}`
            : ''}
        </Text>

        {selected === null && (
          <View style={styles.deltaRow}>
            {delta === null ? (
              <Text style={styles.deltaFlat}>{t('earnings.noLastMonth')}</Text>
            ) : Math.round(delta) === 0 ? (
              <Text style={styles.deltaFlat}>{t('earnings.sameAsLastMonth')}</Text>
            ) : (
              <>
                {delta > 0 ? (
                  <TrendingUp size={13} color={theme.colors.success} />
                ) : (
                  <TrendingDown size={13} color={theme.colors.danger} />
                )}
                <Text
                  style={[
                    styles.delta,
                    { color: delta > 0 ? theme.colors.success : theme.colors.danger },
                  ]}>
                  {t('earnings.vsLastMonth', {
                    percent: `${delta > 0 ? '+' : ''}${Math.round(delta)}`,
                  })}
                </Text>
              </>
            )}
          </View>
        )}
      </View>

      <View style={styles.plot} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 && (
          <Svg width={width} height={CHART_HEIGHT}>
            {/* One hairline baseline. Recessive: the bars are the data. */}
            <Line
              x1={0}
              y1={CHART_HEIGHT - 0.5}
              x2={width}
              y2={CHART_HEIGHT - 0.5}
              stroke={theme.colors.cardBorder}
              strokeWidth={1}
            />
            {buckets.map((b, i) => {
              const h = b.amount > 0 ? Math.max((b.amount / max) * (CHART_HEIGHT - 8), 3) : 0;
              const x = band * i + (band - barWidth) / 2;
              const dim = selected !== null && selected !== i;
              if (h === 0) return null;
              return (
                <Rect
                  key={b.key}
                  x={x}
                  y={CHART_HEIGHT - h}
                  width={barWidth}
                  height={h}
                  rx={BAR_RADIUS}
                  fill={theme.colors.chartSeries}
                  // De-emphasis for the unselected months, so the tapped one
                  // reads as the subject without changing its hue.
                  opacity={dim ? 0.28 : 1}
                />
              );
            })}
          </Svg>
        )}

        {/* Touch targets sit above the SVG and span the full band, so a short
            column is as easy to hit as a tall one. */}
        <View style={styles.hitRow}>
          {buckets.map((b, i) => (
            <TouchableOpacity
              key={b.key}
              style={styles.hit}
              activeOpacity={0.7}
              onPress={() => setSelected(selected === i ? null : i)}
            />
          ))}
        </View>
      </View>

      <View style={styles.axis}>
        {buckets.map((b, i) => (
          <Text key={b.key} style={[styles.axisLabel, selected === i && styles.axisLabelActive]}>
            {b.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...surfaces.card,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: typography.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: theme.colors.textColor,
  },
  subtitle: {
    fontSize: typography.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  empty: {
    fontSize: typography.sm,
    color: theme.colors.textColor,
    marginTop: theme.spacing.sm,
  },

  readout: { marginTop: theme.spacing.md },
  readoutAmount: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.primaryText,
  },
  readoutLabel: { fontSize: typography.xs, color: theme.colors.textColor, marginTop: 1 },
  deltaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  delta: { fontSize: typography.xs, fontWeight: '600' },
  deltaFlat: { fontSize: typography.xs, color: theme.colors.textMuted },

  plot: { marginTop: theme.spacing.md, height: CHART_HEIGHT },
  hitRow: { ...StyleSheet.absoluteFillObject, flexDirection: 'row' },
  hit: { flex: 1 },

  axis: { flexDirection: 'row', marginTop: 6 },
  axisLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.xxs,
    color: theme.colors.textMuted,
  },
  axisLabelActive: { color: theme.colors.primaryText, fontWeight: '700' },
});
