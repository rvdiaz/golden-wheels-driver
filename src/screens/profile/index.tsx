import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Icons from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { LogoutButton } from '~/codidge_components/auth/widgets/logoutButton';
import { Header } from '~/codidge_components/UI/header';
import { theme } from '~/theme/theme';
import { ProfileNavigationSection } from '~/codidge_components/UI/navigationButtons';
import TextButton from '~/codidge_components/UI/button/TextButton';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const user = useReactiveVar(userData);
  const [showEditionForm, setshowEditionForm] = useState(false);

  return (
    <PageSafeContainer>
      <Header
        title={'My Profile'}
        showBack={true}
        contentContainerStyle={{
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
        }}
        contentStyle={{
          paddingVertical: 0,
        }}
        titleStyles={{ color: '#fff' }}
        leftWidget={
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Icons.ChevronLeftIcon />
          </TouchableOpacity>
        }
      />
      <View style={styles.container}>
        {/* <Header title="Profile" showBack onBack={() => navigation.goBack()} /> */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Icons.User size={28} color="#FFF" />
              <View
                style={{
                  position: 'absolute',
                  bottom: -3,
                  right: -3,
                  backgroundColor: theme.colors.success,
                  borderRadius: '50%',
                  padding: 2,
                }}>
                <Icons.BadgeCheck size={18} color="#fff" />
              </View>
            </View>

            <TextButton
              leftWidget={
                <Icons.Edit size={16} style={{ marginRight: 8 }} color={theme.colors.primary} />
              }
              textStyle={{
                color: theme.colors.primary,
              }}
              onPress={() => {
                setshowEditionForm(true);
              }}
              title="Edit Profile"
            />
          </View>

          <ProfileNavigationSection
            sections={[
              {
                title: 'Personal',
                items: [
                  {
                    id: 'income',
                    label: 'Income',
                    icon: <Icons.HandCoins />,
                    onClick: () => {
                      //navigation.navigate(ModuleKeys.income as never);
                    },
                  },
                  {
                    id: 'privacy',
                    label: 'Privacy Policy',
                    icon: <Icons.LockIcon />,
                    onClick: () => {
                      //navigation.navigate(ModuleKeys.privacyPolicy as never);
                    },
                  },
                ],
              },
              {
                title: 'Account',
                items: [
                  {
                    id: 'delete',
                    label: 'Account Deletion',
                    icon: <Icons.UserX />,
                    onClick: () => {},
                  },
                ],
              },
              {
                title: 'App',
                items: [
                  {
                    id: 'feedback',
                    label: 'Send Feedback',
                    icon: <Icons.MessageCircleQuestionMark />,
                    onClick: () => {},
                  },
                  {
                    id: 'logout',
                    label: 'Logout',
                    replacementWidget: <LogoutButton />,
                    icon: <Icons.HandCoins />,
                    onClick: () => {},
                  },
                ],
              },
            ]}
          />
        </ScrollView>
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={showEditionForm}
          onRequestClose={() => {
            setshowEditionForm(false);
          }}>
          <ProfileEditionForm
            onClose={() => {
              setshowEditionForm(false);
            }}
            user={user!}
          />
        </Modal> */}
      </View>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingVertical: 5,
  },
  content: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 62,
    height: 62,
    borderRadius: 40,
    backgroundColor: '#2B7FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#DBEAFE',
    position: 'relative',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  statsCard: {
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  mainStat: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 16,
  },
  mainStatLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  mainStatValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  miniStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  miniStat: {
    alignItems: 'center',
  },
  miniStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  miniStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressCircleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  menuCard: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500',
  },
});
