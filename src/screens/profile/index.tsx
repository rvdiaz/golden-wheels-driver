import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { User, LockKeyhole, MessageCircleQuestion, LogOut } from 'lucide-react-native';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { LogoutButton } from '~/codidge_components/auth/widgets/logoutButton';
import { theme } from '~/theme/theme';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import { ProfileNavigationSection } from '~/codidge_components/UI/navigationButtons';
import { PageTransition } from '~/codidge_components/UI/pageTransition';
import { PrivacyPolicyScreen } from './widgets/termsAndConditions';
import { AccountDeletionScreen } from './widgets/userDeletion';
import { PersonalInfo } from './widgets/personalInfo';
import { ContactSubmissionsScreen } from './widgets/contact';

// ─── Color tokens ─────────────────────────────────────────────────────────────

const GOLD = theme.colors.primary;
const GOLD_10 = 'rgba(218,192,114,0.10)';
const GOLD_18 = 'rgba(218,192,114,0.18)';
const GOLD_30 = 'rgba(218,192,114,0.30)';

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
  const user = useReactiveVar(userData);
  const [screen, setScreen] = useState<'personal-info' | 'terms' | 'feedback' | 'delete' | null>();

  let targetComponent = <View></View>;

  switch (screen) {
    case 'terms':
      targetComponent = (
        <PrivacyPolicyScreen
          onBack={() => {
            setScreen(null);
          }}
        />
      );
      break;
    case 'delete':
      targetComponent = (
        <AccountDeletionScreen
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
        <PersonalInfo
          onBack={() => {
            setScreen(null);
          }}
        />
      );
      break;

    default:
      targetComponent = <View></View>;

      break;
  }

  return (
    <>
      <PageSafeContainer>
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
            <Text style={styles.profileName}>{user?.name ?? 'Your Profile'}</Text>
            {user?.email ? <Text style={styles.profileEmail}>{user.email}</Text> : null}
          </View>

          {/* ── Navigation sections ── */}
          <View style={styles.sectionsWrap}>
            <ProfileNavigationSection
              sections={[
                {
                  title: 'Personal',
                  items: [
                    {
                      id: 'personal-info',
                      label: 'Personal Info',
                      icon: <User />,
                      onClick: () => {
                        setScreen('personal-info');
                        // navigation.navigate('PersonalInfo');
                      },
                    },
                    {
                      id: 'Terms And Conditions',
                      label: 'Terms And Conditions',
                      icon: <LockKeyhole />,
                      onClick: () => {
                        setScreen('terms');
                        // navigation.navigate('PrivacyPolicy');
                      },
                    },
                  ],
                },
                {
                  title: 'Support',
                  items: [
                    {
                      id: 'feedback',
                      label: 'Send Feedback',
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
                      id: 'delete',
                      label: 'Delete Account',
                      icon: <LogOut />,
                      onClick: () => {
                        setScreen('delete');
                      },
                    },
                    {
                      id: 'logout',
                      label: 'Sign Out',
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
      <PageTransition isVisible={!!screen}>{targetComponent}</PageTransition>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Profile header ──
  profileHeader: {
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: 6,
  },
  avatarRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
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
    borderRadius: 32,
    backgroundColor: 'rgba(218,192,114,0.15)',
    borderWidth: 0.5,
    borderColor: GOLD_18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '500',
    color: GOLD,
    letterSpacing: 0.5,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.88)',
    letterSpacing: 0.2,
  },
  profileEmail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
  },

  // ── Sections ──
  sectionsWrap: {
    paddingHorizontal: theme.spacing.lg,
  },
});
