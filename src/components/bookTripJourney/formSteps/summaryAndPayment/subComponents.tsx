import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

const GOLD = theme.colors.primary;

// ─── Sub-components ───────────────────────────────────────────────────────────

export const SummaryReviewRow = ({
  icon,
  label,
  value,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) => (
  <View style={[row.wrapper, last && { borderBottomWidth: 0 }]}>
    <View style={row.iconWrap}>{icon}</View>
    <View style={row.content}>
      <Text style={row.label}>{label}</Text>
      <Text style={row.value} numberOfLines={2}>
        {value || '—'}
      </Text>
    </View>
  </View>
);

export const SummarySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={sec.wrapper}>
    <Text style={sec.title}>{title}</Text>
    <View style={sec.card}>{children}</View>
  </View>
);

export const SummaryPriceRow = ({
  label,
  value,
  bold,
  gold,
}: {
  label: string;
  value: string;
  bold?: boolean;
  gold?: boolean;
}) => (
  <View style={priceS.row}>
    <Text style={[priceS.label, bold && priceS.bold]}>{label}</Text>
    <Text style={[priceS.value, bold && priceS.bold, gold && priceS.gold]}>{value}</Text>
  </View>
);

// ─── Trust banner ─────────────────────────────────────────────────────────────

export const SummaryTrustBanner = () => (
  <View style={trust.wrapper}>
    <View style={trust.iconWrap}>
      <ShieldCheck size={20} color={GOLD} strokeWidth={1.8} />
    </View>
    <View style={trust.content}>
      <Text style={trust.title}>No charge until confirmed</Text>
      <Text style={trust.body}>
        Your card will only be charged once a driver is assigned and your trip is confirmed. We save
        your payment method securely via Stripe.
      </Text>
    </View>
  </View>
);

const row = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)', // dark divider
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(212,168,83,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, gap: 4 },
  label: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)', // muted white
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)', // bright white
    lineHeight: 19,
  },
});

const sec = StyleSheet.create({
  wrapper: { gap: 8 },
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: theme.colors.primary,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
});

const priceS = StyleSheet.create({
  wrapper: { gap: 8 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 14,
    gap: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '400',
  },
  value: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  bold: {
    fontWeight: '700',
    fontSize: 16,
    color: '#ffffff',
  },
  gold: { color: '#D4A853' },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 2,
  },
});

const trust = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(212,168,83,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.18)',
    borderRadius: 14,
    padding: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(212,168,83,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: { flex: 1, gap: 4 },
  title: { fontSize: 13, fontWeight: '700', color: '#ffffff' },
  body: { fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 18 },
});
