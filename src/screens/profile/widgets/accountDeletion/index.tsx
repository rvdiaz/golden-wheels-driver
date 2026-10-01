import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Trash2 } from 'lucide-react-native';

import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { TAB_BAR_CLEARANCE } from '~/navigation/bottomBar';
import { useTranslation } from '~/i18n';
import { DeletionSummary } from './components/deletionSummary';
import { BalanceNotice } from './components/balanceNotice';
import { useAccountDeletion } from './hooks/useAccountDeletion';

/**
 * "Delete account" for a driver. It removes their access to this organization's driver app
 * and nothing else: the sign-in is shared with their customer account and with any other
 * organization they drive for, and money still owed to them stays with the operator to settle.
 */
export const AccountDeletionScreen = ({
  onBack,
  onDeleted,
}: {
  onBack: () => void;
  onDeleted?: () => void;
}) => {
  const { t } = useTranslation();
  const { confirmAndDelete, deleting } = useAccountDeletion({ onDeleted });

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
          title={t('account.deleteAccount')}
          onBack={onBack}
          showBack
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>{t('account.deleteIntro')}</Text>
          <BalanceNotice />
          <DeletionSummary />
          <OutlineButton
            title={t('account.deleteAccount')}
            size={ButtonSize.XLARGE}
            color={theme.colors.danger}
            leftWidget={<Trash2 size={18} color={theme.colors.danger} />}
            loading={deleting}
            onPress={confirmAndDelete}
          />
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
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.secondaryText,
  },
});
