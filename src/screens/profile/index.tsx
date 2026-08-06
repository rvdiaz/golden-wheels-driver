import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { User, MessageCircleQuestion, LogOut, Shield, BookText } from 'lucide-react-native';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { LogoutButton } from '~/codidge_components/auth/widgets/logoutButton';
import { theme } from '~/theme/theme';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { ScreenHeader } from '~/codidge_components/UI/screenHeader';
import Text from '~/codidge_components/UI/text';
import { ProfileNavigationSection } from '~/codidge_components/UI/navigationButtons';
import { PageTransition } from '~/codidge_components/UI/pageTransition';
import { TermsAndConditions } from './widgets/termsAndConditions';
import { DriverInfo } from './widgets/driverInfo';
import { ContactSubmissionsScreen } from './widgets/contact';
import { PrivacyPolicyScreen } from './widgets/privacyPolicy';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from '~/i18n';
import { TAB_BAR_CLEARANCE } from '~/navigation/bottomBar';

// ─── Color tokens ─────────────────────────────────────────────────────────────

const GOLD = theme.colors.primary;
const GOLD_10 = theme.colors.primaryAlpha[10];
const GOLD_18 = theme.colors.primaryAlpha[20];
const GOLD_30 = theme.colors.primaryAlpha[35];

// ─── Avatar ───────────────────────────────────────────────────────────────────

const getInitials = (name?: string): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// ─── Screen ───────────────────────────────────────────────────────────────────

type Props = {
  onNavigateHome?: () => void;
};

export const ProfileScreen: React.FC<Props> = ({ onNavigateHome }) => {
  const { t } = useTranslation();
  const user = useReactiveVar(userData);
  const [screen, setScreen] = useState<
    'personal-info' | 'privacy-policy' | 'terms' | 'feedback' | null
  >();

  // Reset screen state when component comes into focus
  useFocusEffect(
    useCallback(() => {
      // Optional: reset to main profile view when screen regains focus
      // Remove this if you want to preserve the sub-screen state
      return () => {
        setScreen(null);
      };
    }, [])
  );

  let targetComponent: React.ReactNode = null;

  switch (screen) {
    case 'privacy-policy':
      targetComponent = (
        <PrivacyPolicyScreen
          onBack={() => {
            setScreen(null);
          }}
        />
      );
      break;
    case 'terms':
      targetComponent = (
        <TermsAndConditions
          onBack={() => {
            setScreen(null);
          }}
        />
      );
      break;
    case 'feedback':
      targetComponent = (
        <ContactSubmissionsScreen
          onBack={() => {
            setScreen(null);
          }}
        />
      );
      break;
    case 'personal-info':
      targetComponent = (
        <DriverInfo
          onBack={() => {
            setScreen(null);
          }}
        />
      );
      break;

    default:
      targetComponent = null;
      break;
  }

  return (
    <>
      <PageSafeContainer>
        <ScreenHeader title={t('account.title')} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* ── Avatar + name ── */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>{getInitials(user?.name)}</Text>
              </View>
            </View>
            <Text style={styles.profileName}>{user?.name ?? 'Driver'}</Text>
            {user?.email ? <Text style={styles.profileEmail}>{user.email}</Text> : null}
          </View>

          {/* ── Navigation sections ── */}
          <View style={styles.sectionsWrap}>
            <ProfileNavigationSection
              sections={[
                {
                  title: t('account.personal'),
                  items: [
                    {
                      id: 'personal-info',
                      label: t('account.myProfile'),
                      icon: <User />,
                      onClick: () => {
                        setScreen('personal-info');
                        // navigation.navigate('PersonalInfo');
                      },
                    },
                    {
                      id: 'Terms And Conditions',
                      label: t('account.terms'),
                      icon: <BookText />,
                      onClick: () => {
                        setScreen('terms');
                        // navigation.navigate('PrivacyPolicy');
                      },
                    },
                    {
                      id: 'privacy-policy',
                      label: t('account.privacy'),
                      icon: <Shield />,
                      onClick: () => {
                        setScreen('privacy-policy');
                      },
                    },
                  ],
                },
                {
                  title: t('account.support'),
                  items: [
                    {
                      id: 'feedback',
                      label: t('account.feedback'),
                      icon: <MessageCircleQuestion />,
                      onClick: () => {
                        setScreen('feedback');

                        // navigation.navigate('Feedback');
                      },
                    },
                  ],
                },
                {
                  title: 'Account',
                  items: [
                    {
                      id: 'logout',
                      label: t('account.signOut'),
                      replacementWidget: <LogoutButton onSuccessLogout={onNavigateHome} />,
                      icon: <LogOut />,
                      onClick: () => {},
                    },
                  ],
                },
              ]}
            />
          </View>
        </ScrollView>
      </PageSafeContainer>
      <PageTransition isVisible={!!screen}>{targetComponent && targetComponent}</PageTransition>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: TAB_BAR_CLEARANCE,
  },

  // ── Profile header ──
  profileHeader: {
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    gap: 6,
  },
  avatarRing: {
    width: 76,
    height: 76,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: GOLD_30,
    backgroundColor: GOLD_10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(218,192,114,0.15)',
    borderWidth: 0.5,
    borderColor: GOLD_18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: '500',
    color: theme.colors.primaryTextAccent,
    letterSpacing: 0.5,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.primaryText,
    letterSpacing: 0.2,
  },
  profileEmail: {
    fontSize: 14,
    color: theme.colors.textColor,
  },

  // ── Sections ──
  sectionsWrap: {
    paddingHorizontal: theme.spacing.lg,
  },
});
