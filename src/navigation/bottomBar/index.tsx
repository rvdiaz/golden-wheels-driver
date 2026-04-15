import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { House, MapPin, Bell, User, LucideIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  { name: 'Home', icon: House, label: 'Home' },
  { name: 'Trips', icon: MapPin, label: 'Trips', authRequired: true },
  { name: 'Notifications', icon: Bell, label: 'Alerts', authRequired: true },
  { name: 'Account', icon: User, label: 'Account', authRequired: true },
];

const BAR_HEIGHT = 72;
const BAR_WIDTH = width - 40;
const RADIUS = 32;
const BOTTOM_OFFSET = Platform.OS === 'android' ? 35 : 24;

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
      onTabPress(redirectTab); // ✅ GO TO SAVED TAB
      postLoginRedirectVar(null); // ✅ CLEAR IT
    }
  }, [userInfo, redirectTab]);

  const switchScreenHandler = (tab: ITAB) => {
    if (tab.authRequired && !userInfo) {
      postLoginRedirectVar(tab.name); // ✅ SAVE TARGET
      updateAuthenticateStateUser(true);
      return;
    }

    onTabPress(tab.name);
  };

  return (
    <>
      <View style={styles.wrapper} pointerEvents="box-none">
        {Platform.OS === 'ios' && (
          <LinearGradient
            colors={['transparent', '#D4A853', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.topBorder}
          />
        )}
        <LinearGradient
          colors={[theme.colors.primaryAlpha[5], theme.colors.primaryAlpha[5]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}>
          <View style={styles.container}>
            {Platform.OS === 'ios' ? (
              <BlurView
                intensity={60}
                tint="dark"
                style={[StyleSheet.absoluteFill, styles.blurMask]}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.androidGlass]} />
            )}

            {TABS.map((tab) => {
              const { name, icon: Icon, label } = tab;
              const isActive = activeTab === name;
              return (
                <TouchableOpacity
                  key={name}
                  onPress={() => switchScreenHandler(tab)}
                  activeOpacity={0.6}
                  style={styles.tab}>
                  {isActive && <View style={styles.activePill} />}
                  <Icon
                    size={20}
                    color={isActive ? '#dac072' : '#FFF'}
                    strokeWidth={isActive ? 2.2 : 1.6}
                  />
                  <Text
                    style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </LinearGradient>
      </View>
    </>
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
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  gradientBorder: {
    padding: 1.0,
    borderRadius: RADIUS,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 7,
  },
  container: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: RADIUS,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  blurMask: {
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
  androidGlass: {
    borderRadius: RADIUS,
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
  },
  tab: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  activePill: {
    position: 'absolute',
    width: 62,
    height: 52,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryAlpha[10],
    borderWidth: 1,
    borderColor: theme.colors.primaryAlpha[20],
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  labelActive: {
    color: theme.colors.primary,
  },
  labelInactive: {
    color: '#FFF',
  },
});
