import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Check, X } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { surfaces } from '~/theme/surfaces';
import { useTranslation } from '~/i18n';
import { TranslationKey } from '~/i18n/translations';

const REMOVED: TranslationKey[] = [
  'account.deleteRemovedAccess',
  'account.deleteRemovedTrips',
  'account.deleteRemovedDevices',
];

const KEPT: TranslationKey[] = [
  'account.deleteKeptRecord',
  'account.deleteKeptBalance',
  'account.deleteKeptLogin',
];

const Group = ({
  title,
  items,
  icon,
}: {
  title: string;
  items: TranslationKey[];
  icon: React.ReactNode;
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {items.map((key) => (
        <View key={key} style={styles.row}>
          <View style={styles.icon}>{icon}</View>
          <Text style={styles.text}>{t(key)}</Text>
        </View>
      ))}
    </View>
  );
};

/** What deleting the account takes away, and what the operator keeps. */
export const DeletionSummary = () => {
  const { t } = useTranslation();

  return (
    <>
      <Group
        title={t('account.deleteRemovedTitle')}
        items={REMOVED}
        icon={<X size={16} color={theme.colors.danger} strokeWidth={2.2} />}
      />
      <Group
        title={t('account.deleteKeptTitle')}
        items={KEPT}
        icon={<Check size={16} color={theme.colors.success} strokeWidth={2.2} />}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    ...surfaces.card,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primaryText,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md },
  icon: { marginTop: 3 },
  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    color: theme.colors.secondaryText,
  },
});
