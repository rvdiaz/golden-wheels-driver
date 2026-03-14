import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { House, MapPin, Bell, User, LucideIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

const { width } = Dimensions.get('window');

type TabName = 'Home' | 'Trips' | 'Notifications' | 'Account';

const TABS: { name: TabName; icon: LucideIcon; label: string }[] = [
  { name: 'Home', icon: House, label: 'Home' },
  { name: 'Trips', icon: MapPin, label: 'Trips' },
  { name: 'Notifications', icon: Bell, label: 'Alerts' },
  { name: 'Account', icon: User, label: 'Account' },
];

const BAR_HEIGHT = 72;
const BAR_WIDTH = width - 48;
const RADIUS = 32;

export const CustomTabBar = ({
  activeTab,
  onTabPress,
}: {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}) => {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <LinearGradient
        colors={[theme.colors.primaryAlpha[10], theme.colors.primaryAlpha[5]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}>
        <View style={styles.container}>
          {/* Glass background */}
          {Platform.OS === 'ios' ? (
            <BlurView
              intensity={60}
              tint="dark"
              style={[StyleSheet.absoluteFill, styles.blurMask]}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.androidGlass]} />
          )}

          {/* Tab items */}
          {TABS.map(({ name, icon: Icon, label }) => {
            const isActive = activeTab === name;
            return (
              <TouchableOpacity
                key={name}
                onPress={() => onTabPress(name)}
                activeOpacity={0.6}
                style={styles.tab}>
                {isActive && <View style={styles.activePill} />}

                <Icon
                  size={20}
                  color={isActive ? '#dac072' : '#FFF'}
                  strokeWidth={isActive ? 2.2 : 1.6}
                />
                <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  gradientBorder: {
    padding: 1.0,
    borderRadius: RADIUS,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
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

  // ── Tab ──────────────────────────────────────────────────────────────────
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

  // ── Labels ───────────────────────────────────────────────────────────────
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
