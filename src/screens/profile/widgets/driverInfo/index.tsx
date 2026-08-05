import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useReactiveVar } from '@apollo/client';
import { BadgeCheck, IdCard, Mail, Phone, ArrowLeft } from 'lucide-react-native';

import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { surfaces } from '~/theme/surfaces';
import { TAB_BAR_CLEARANCE } from '~/navigation/bottomBar';
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
          contentContainerStyle={{ backgroundColor: 'transparent' }}
          titleStyles={{ color: theme.colors.primaryText }}
          leftWidget={
            <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
              <ArrowLeft size={18} color={theme.colors.secondaryText} />
            </TouchableOpacity>
          }
          title={t('account.myProfile')}
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
  // Matches the policy screens' back control.
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.baseGray,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: TAB_BAR_CLEARANCE,
    gap: theme.spacing.lg,
  },
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
