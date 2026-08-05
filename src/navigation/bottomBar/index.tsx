import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { MapPin, Bell, User, LucideIcon, Home } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { surfaces } from '~/theme/surfaces';
import { TKey, useTranslation } from '~/i18n';

const { width } = Dimensions.get('window');

export type TabName = 'Home' | 'Trips' | 'Notifications' | 'Account';

interface ITAB {
  name: TabName;
  icon: LucideIcon;
  labelKey: TKey;
}

const TABS: ITAB[] = [
  { name: 'Home', icon: Home, labelKey: 'tab.dashboard' },
  { name: 'Trips', icon: MapPin, labelKey: 'tab.trips' },
  { name: 'Notifications', icon: Bell, labelKey: 'tab.alerts' },
  { name: 'Account', icon: User, labelKey: 'tab.account' },
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
  const { t } = useTranslation();

  // No per-tab auth check: nothing renders this bar unless a driver is signed
  // in, so every tab is always reachable.
  const switchScreenHandler = (tab: ITAB) => onTabPress(tab.name);

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const { name, icon: Icon, labelKey } = tab;
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
                color={isActive ? theme.colors.primaryDark : theme.colors.menuItemInactive}
                strokeWidth={isActive ? 2.2 : 1.6}
              />
              <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
                {t(labelKey)}
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
    ...surfaces.floating,
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
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  labelActive: {
    color: theme.colors.primaryDark,
  },
  labelInactive: {
    color: theme.colors.menuItemInactive,
  },
});
