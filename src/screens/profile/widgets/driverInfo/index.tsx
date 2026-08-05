import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { useReactiveVar } from '@apollo/client';
import { BadgeCheck, IdCard, Mail, Phone } from 'lucide-react-native';

import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { updateUser, userData } from '~/store/user';
import { useUser } from '~/screens/auth/hooks/useUser';
import { ENV_Vars } from '~/store/env';

const Row = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) => (
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
  const user = useReactiveVar(userData);
  const { updateDriverFn, loadingUpdate } = useUser();
  const [available, setAvailable] = useState(!!user?.available);

  const toggleAvailability = async (next: boolean) => {
    // Optimistic — the switch should feel instant, and we roll back on failure.
    setAvailable(next);
    try {
      await updateDriverFn({
        variables: {
          tenant: ENV_Vars.tenant,
          driverId: user!.id,
          driver: { available: next },
        },
      });
      updateUser({ ...user!, available: next });
    } catch (error: any) {
      setAvailable(!next);
      Alert.alert(
        'Could not update availability',
        error?.message ?? 'Please try again.'
      );
    }
  };

  return (
    <BodyWrapper>
      <PageSafeContainer>
        <Header title="My profile" onBack={onBack} />
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.availabilityRow}>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Available for trips</Text>
                <Text style={styles.availabilityHint}>
                  {available
                    ? 'You can be assigned and can claim open trips.'
                    : 'You will not receive new trips.'}
                </Text>
              </View>
              <Switch
                value={available}
                disabled={loadingUpdate}
                onValueChange={toggleAvailability}
                trackColor={{
                  false: theme.colors.borderNeutralColor,
                  true: theme.colors.primaryAlpha[50],
                }}
                thumbColor={
                  available ? theme.colors.primary : theme.colors.textColor
                }
              />
            </View>
          </View>

          <View style={styles.card}>
            <Row
              icon={<BadgeCheck size={18} color={theme.colors.primary} />}
              label="Name"
              value={user?.name}
            />
            <Row
              icon={<Mail size={18} color={theme.colors.primary} />}
              label="Email"
              value={user?.email}
            />
            <Row
              icon={<Phone size={18} color={theme.colors.primary} />}
              label="Phone"
              value={user?.phone}
            />
            <Row
              icon={<IdCard size={18} color={theme.colors.primary} />}
              label="Licence number"
              value={user?.licenseNumber}
            />
          </View>

          <Text style={styles.footnote}>
            Need something here changed? Contact your operator.
          </Text>
        </ScrollView>
      </PageSafeContainer>
    </BodyWrapper>
  );
};

const styles = StyleSheet.create({
  content: { padding: theme.spacing.lg, gap: theme.spacing.lg },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  availabilityHint: {
    fontSize: 12,
    color: theme.colors.textColor,
    marginTop: 2,
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
  rowLabel: { fontSize: 13, color: theme.colors.textColor },
  rowValue: {
    fontSize: 15,
    color: theme.colors.primaryText,
    fontWeight: '600',
    marginTop: 1,
  },
  footnote: {
    fontSize: 12,
    color: theme.colors.textColor,
    textAlign: 'center',
  },
});
