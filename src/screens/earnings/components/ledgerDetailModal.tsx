import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { typography } from '~/theme/typography';
import { TKey, useTranslation } from '~/i18n';
import { formatCurrency, formatMiamiTime } from '~/helpers';

import { LedgerEntry } from '../interfaces';

const PAYMENT_METHOD_KEY: Record<string, TKey> = {
  cash: 'earnings.methodCash',
  zelle: 'earnings.methodZelle',
  bank_transfer: 'earnings.methodBankTransfer',
  check: 'earnings.methodCheck',
  other: 'earnings.methodOther',
};

const Field = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
};

export const LedgerDetailModal = ({
  entry,
  balanceAfter,
  onClose,
}: {
  /** Null closes the modal — the caller holds the selected entry, not a flag. */
  entry: (LedgerEntry & { balanceAfter?: number }) | null;
  balanceAfter?: number;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Hooks must run on every render, so the null guard comes after them.
  const isCredit = (entry?.amount ?? 0) >= 0;
  const accent = isCredit ? theme.colors.success : theme.colors.primaryTextAccent;
  const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;

  if (!entry) return null;

  const methodKey = entry.paymentMethod ? PAYMENT_METHOD_KEY[entry.paymentMethod] : undefined;
  const after = balanceAfter ?? entry.balanceAfter;

  return (
    /**
     * A transparent modal gets its own window, but on Android that window is
     * only as tall as the content area unless it is told otherwise — the tab
     * bar sits at elevation 20 and Android composites siblings by elevation
     * rather than tree order, so it drew straight over the sheet. These two
     * flags let the modal own the full screen, status bar and system nav
     * included, which is what puts it above the bar.
     */
    <Modal
      visible
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {/* Tapping outside dismisses, matching the trip detail modal. */}
        <TouchableOpacity style={styles.backdropFill} activeOpacity={1} onPress={onClose} />

        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, theme.spacing.lg) }]}>
          <View style={styles.grabber} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('earnings.detailTitle')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color={theme.colors.secondaryText} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.amountBlock}>
              <View style={[styles.iconWrap, { backgroundColor: accent + '14' }]}>
                <Icon size={20} color={accent} />
              </View>
              <Text style={[styles.amount, { color: accent }]}>
                {isCredit ? '+' : '−'}
                {formatCurrency(Math.abs(entry.amount), entry.currencyCode)}
              </Text>
              <Text style={styles.typeLabel}>
                {isCredit ? t('earnings.detailEarning') : t('earnings.detailPayment')}
              </Text>
            </View>

            <View style={styles.fields}>
              <Field
                label={t('earnings.fieldDate')}
                value={formatMiamiTime(new Date(entry.occurredAt), 'datetime')}
              />
              <Field
                label={t('earnings.fieldMethod')}
                value={methodKey ? t(methodKey) : entry.paymentMethod}
              />
              <Field label={t('earnings.fieldReference')} value={entry.paymentReference} />
              <Field label={t('earnings.fieldBooking')} value={entry.bookingCode} />
              <Field label={t('earnings.fieldNote')} value={entry.description} />
              <Field
                label={t('earnings.fieldBalanceAfter')}
                value={after === undefined ? null : formatCurrency(after, entry.currencyCode)}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeCta} activeOpacity={0.85} onPress={onClose}>
              <Text style={styles.closeCtaText}>{t('earnings.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(17,24,39,0.45)' },
  backdropFill: { flex: 1 },
  sheet: {
    backgroundColor: theme.colors.cardBackground,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '85%',
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.borderStrong,
    marginTop: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: theme.colors.primaryText,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.lg },

  amountBlock: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: theme.spacing.lg,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  amount: { fontSize: 30, fontWeight: '700' },
  typeLabel: { fontSize: typography.sm, color: theme.colors.textColor },

  fields: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  fieldLabel: { fontSize: typography.sm, color: theme.colors.textColor, flexShrink: 0 },
  fieldValue: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: theme.colors.primaryText,
    flex: 1,
    textAlign: 'right',
  },

  footer: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md },
  closeCta: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
  },
  closeCtaText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: theme.colors.primaryText,
  },
});
