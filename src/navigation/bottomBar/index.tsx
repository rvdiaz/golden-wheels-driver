import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { MapPin, Bell, User, LucideIcon, Home } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { surfaces } from '~/theme/surfaces';
import { TKey, useTranslation } from '~/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

/**
 * Bottom padding a tab screen must leave so the floating bar never covers its
 * last row or call to action.
 *
 * The bar's top edge sits at max(insets.bottom, BOTTOM_OFFSET) + BAR_HEIGHT
 * above the window, while PageSafeContainer only ends content at insets.bottom.
 * Worst case (no inset at all) that leaves BOTTOM_OFFSET + BAR_HEIGHT covered,
 * plus a little breathing room. Every scrolling tab screen and every sub-page
 * rendered beneath the bar should use this rather than a hand-picked number —
 * Alerts and Account were at 32 and 40 and had content hidden under the bar.
 */
export const TAB_BAR_CLEARANCE = BOTTOM_OFFSET + BAR_HEIGHT + 16;

export const CustomTabBar = ({
  activeTab,
  onTabPress,
}: {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // No per-tab auth check: nothing renders this bar unless a driver is signed
  // in, so every tab is always reachable.
  const switchScreenHandler = (tab: ITAB) => onTabPress(tab.name);

  return (
    <View
      style={[
        styles.wrapper,
        /*
          Expo SDK 54 draws Android edge-to-edge, so the system navigation bar
          (back / home / recents) overlays the bottom of the window. A fixed
          offset put the tab bar underneath it. Clearing the inset also lifts
          the bar off the iOS home indicator.
        */
        { bottom: Math.max(insets.bottom, BOTTOM_OFFSET) },
      ]}
      pointerEvents="box-none">
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
