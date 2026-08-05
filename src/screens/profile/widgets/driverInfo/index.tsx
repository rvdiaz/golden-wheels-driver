import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useReactiveVar } from '@apollo/client';
import { BadgeCheck, IdCard, Mail, Phone } from 'lucide-react-native';

import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { surfaces } from '~/theme/surfaces';
import { userData } from '~/store/user';
import { useTranslation } from '~/i18n';
import * as Icons from 'lucide-react-native';

const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) => (
  <View style={styles.row}>
    <View style={styles.rowIcon}>{icon}</View>
    <View style={styles.rowText}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || '—'}</Text>
    </View>
  </View>
);

/**
 * Driver's own profile. Read-only on identity fields — the operator owns the
 * roster, so name, email and licence are changed by them, not here. The one
 * thing the driver controls is whether they're taking work right now.
 */
export const DriverInfo = ({ onBack }: { onBack: () => void }) => {
  const { t } = useTranslation();
  const user = useReactiveVar(userData);

  return (
    <BodyWrapper>
      <PageSafeContainer>
        <Header
          title={t('account.myProfile')}
          leftWidget={<Icons.ArrowLeft size={20} color="#000" />}
          onBack={onBack}
          showBack
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Row
              icon={<BadgeCheck size={18} color={theme.colors.primary} />}
              label={t('account.name')}
              value={user?.name}
            />
            <Row
              icon={<Mail size={18} color={theme.colors.primary} />}
              label={t('account.email')}
              value={user?.email}
            />
            <Row
              icon={<Phone size={18} color={theme.colors.primary} />}
              label={t('account.phone')}
              value={user?.phone}
            />
            <Row
              icon={<IdCard size={18} color={theme.colors.primary} />}
              label={t('account.licence')}
              value={user?.licenseNumber}
            />
          </View>
        </ScrollView>
      </PageSafeContainer>
    </BodyWrapper>
  );
};

const styles = StyleSheet.create({
  content: { padding: theme.spacing.lg, gap: theme.spacing.lg },
  card: {
    ...surfaces.card,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryAlpha[10],
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 14, color: theme.colors.textColor },
  rowValue: {
    fontSize: 16,
    color: theme.colors.primaryText,
    fontWeight: '600',
    marginTop: 1,
  },
});
