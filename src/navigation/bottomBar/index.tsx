import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Car, MapPin, Bell, User, LucideIcon } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { updateAuthenticateStateUser } from '~/store/user/authSessionState';
import { postLoginRedirectVar } from '~/store/config/tabs';

const { width } = Dimensions.get('window');

export type TabName = 'Home' | 'Trips' | 'Notifications' | 'Account';

interface ITAB {
  name: TabName;
  icon: LucideIcon;
  label: string;
  authRequired?: boolean;
}

const TABS: ITAB[] = [
  { name: 'Home', icon: Car, label: 'Dashboard' },
  { name: 'Trips', icon: MapPin, label: 'Trips', authRequired: true },
  { name: 'Notifications', icon: Bell, label: 'Alerts', authRequired: true },
  { name: 'Account', icon: User, label: 'Account', authRequired: true },
];

const BAR_HEIGHT = 68;
const BAR_WIDTH = width - 32;
const RADIUS = 20;
const BOTTOM_OFFSET = Platform.OS === 'android' ? 16 : 20;

export const CustomTabBar = ({
  activeTab,
  onTabPress,
}: {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}) => {
  const userInfo = useReactiveVar(userData);
  const redirectTab = useReactiveVar(postLoginRedirectVar);

  useEffect(() => {
    if (userInfo && redirectTab) {
      onTabPress(redirectTab);
      postLoginRedirectVar(null);
    }
  }, [userInfo, redirectTab]);

  const switchScreenHandler = (tab: ITAB) => {
    if (tab.authRequired && !userInfo) {
      postLoginRedirectVar(tab.name);
      updateAuthenticateStateUser(true);
      return;
    }
    onTabPress(tab.name);
  };

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const { name, icon: Icon, label } = tab;
          const isActive = activeTab === name;
          return (
            <TouchableOpacity
              key={name}
              onPress={() => switchScreenHandler(tab)}
              activeOpacity={0.7}
              style={styles.tab}>
              {isActive && <View style={styles.activePill} />}
              <Icon
                size={20}
                color={isActive ? theme.colors.primary : theme.colors.menuItemInactive}
                strokeWidth={isActive ? 2.2 : 1.6}
              />
              <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: BOTTOM_OFFSET,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  bar: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: RADIUS,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.borderNeutralColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  tab: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  activePill: {
    position: 'absolute',
    width: 58,
    height: 46,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryAlpha[10],
    borderWidth: 1,
    borderColor: theme.colors.primaryAlpha[20],
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  labelActive: {
    color: theme.colors.primary,
  },
  labelInactive: {
    color: theme.colors.menuItemInactive,
  },
});
