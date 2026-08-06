import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { MapPin, Bell, User, LucideIcon, Home, Wallet } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { surfaces } from '~/theme/surfaces';
import { TKey, useTranslation } from '~/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Declared in the store, so the bar, the navigator and activeTabVar cannot
// disagree about what tabs exist.
import type { TabName } from '~/store/navigationTabs';

// Re-exported for the modules that already import TabName from here.
export type { TabName };

const { width } = Dimensions.get('window');

interface ITAB {
  name: TabName;
  icon: LucideIcon;
  labelKey: TKey;
  /** Renders as the raised centre button instead of a flat icon. */
  featured?: boolean;
}

/**
 * Earnings sits dead centre, and is the one tab drivers open to answer a
 * question they actually care about ("what am I owed?"), so it gets the raised
 * treatment. Account stays rightmost where users reach for it.
 */
const TABS: ITAB[] = [
  { name: 'Home', icon: Home, labelKey: 'tab.dashboard' },
  { name: 'Trips', icon: MapPin, labelKey: 'tab.trips' },
  { name: 'Earnings', icon: Wallet, labelKey: 'tab.earnings', featured: true },
  { name: 'Notifications', icon: Bell, labelKey: 'tab.alerts' },
  { name: 'Account', icon: User, labelKey: 'tab.account' },
];

/**
 * The disc is rendered outside the bar, so it needs its tab's data on its own.
 * Falling back to the last entry keeps this total rather than optional — if the
 * `featured` flag is ever dropped from TABS, the bar still renders.
 */
const FEATURED_TAB = TABS.find((tab) => tab.featured) ?? TABS[TABS.length - 1];
const FeaturedIcon = FEATURED_TAB.icon;

const TAB_COUNT = TABS.length;
const BAR_HEIGHT = 68;
const BAR_WIDTH = width - 32;
const RADIUS = 20;
const BOTTOM_OFFSET = Platform.OS === 'android' ? 16 : 20;

/**
 * Gap between a tab label's baseline and the bottom of the bar.
 *
 * The flat tabs centre icon + label in BAR_HEIGHT, which leaves roughly this
 * much beneath the text. The featured tab can't use the same centring — its
 * disc is pinned to the top — so it reproduces the offset explicitly to keep
 * all five labels on one line.
 */
const LABEL_BASELINE_INSET = 15;

/**
 * Capped at 58, but never wider than its slot: five tabs across a 320pt screen
 * leave 57.6pt each, so a fixed 58 spills into its neighbours on an iPhone SE.
 * The -8 keeps a little air on both sides at every width.
 */
const FAB_SIZE = Math.min(58, Math.floor(BAR_WIDTH / TAB_COUNT) - 8);
/**
 * How far the centre button rises above the bar's top edge.
 *
 * The lift is bought by making the whole touch row that much taller rather than
 * letting the button spill out of its parent: on Android a child rendered
 * outside its parent's bounds still draws, but stops receiving touches. So the
 * row is BAR_HEIGHT + FAB_LIFT tall, the bar is painted at the bottom of it,
 * and the button lives inside the row the whole time.
 */
const FAB_LIFT = 22;
const ROW_HEIGHT = BAR_HEIGHT + FAB_LIFT;

/**
 * Bottom padding a tab screen must leave so the floating bar never covers its
 * last row or call to action.
 *
 * Measured from the top of the raised centre button, not the bar, so nothing
 * scrolls under the part of it that overhangs. The chrome's top edge sits at
 * max(insets.bottom, BOTTOM_OFFSET) + ROW_HEIGHT above the window, while
 * PageSafeContainer only ends content at insets.bottom. Worst case (no inset at
 * all) that leaves BOTTOM_OFFSET + ROW_HEIGHT covered, plus breathing room.
 *
 * Every scrolling tab screen and every sub-page rendered beneath the bar should
 * use this rather than a hand-picked number — Alerts and Account were at 32 and
 * 40 and had content hidden under the bar.
 */
export const TAB_BAR_CLEARANCE = BOTTOM_OFFSET + ROW_HEIGHT + 16;

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

  // The disc is rendered outside the TABS loop, so it can't read `isActive`
  // from there.
  const isFeaturedActive = activeTab === FEATURED_TAB.name;

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
      <View style={styles.stack} pointerEvents="box-none">
        {/*
          Every tab lives INSIDE the bar. An earlier version painted the bar and
          the tab row as siblings so the raised button could overlap the bar
          without being clipped — but Android composites siblings by `elevation`,
          not tree order, so the bar's elevation of 12 drew straight over a
          transparent row and the whole bar came up blank. Children of the bar
          draw with the bar, so there is no ordering left to get wrong.
        */}
        <View style={styles.bar}>
          {TABS.map((tab) => {
            const { name, icon: Icon, labelKey, featured } = tab;
            const isActive = activeTab === name;

            // The disc itself is rendered outside the bar, below — this slot
            // holds its label and keeps the touch target the same width as
            // every other tab.
            if (featured) {
              return (
                <TouchableOpacity
                  key={name}
                  onPress={() => switchScreenHandler(tab)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  style={styles.featuredSlot}>
                  <Text
                    numberOfLines={1}
                    style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
                    {t(labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={name}
                onPress={() => switchScreenHandler(tab)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                style={styles.tab}>
                {isActive && <View style={styles.activePill} />}
                <Icon
                  size={20}
                  color={isActive ? theme.colors.primaryDark : theme.colors.menuItemInactive}
                  strokeWidth={isActive ? 2.2 : 1.6}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
                  {t(labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/*
          The raised disc: a DIRECT sibling of the bar, with no wrapper view.
          It is opaque and carries its own elevation, which is what lets Android
          composite it above the bar — the same lift applied to a transparent
          container is what blanked the bar before. Last in the tree, so iOS
          orders it correctly too.
        */}
        <TouchableOpacity
          onPress={() => switchScreenHandler(FEATURED_TAB)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityState={{ selected: isFeaturedActive }}
          accessibilityLabel={t(FEATURED_TAB.labelKey)}
          style={[
            styles.fabRing,
            isFeaturedActive ? styles.fabRingActive : styles.fabRingInactive,
          ]}>
          <LinearGradient
            colors={theme.colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fab}>
            <FeaturedIcon size={24} color="#FFFFFF" strokeWidth={isFeaturedActive ? 2.4 : 2} />
          </LinearGradient>
        </TouchableOpacity>
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
  stack: {
    width: BAR_WIDTH,
    height: ROW_HEIGHT,
  },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
  /**
   * Holds the disc's label and reserves its slot. Bottom-aligned with the same
   * inset the flat tabs' centring produces, so all five labels share a baseline
   * even though this one has no icon above it.
   */
  featuredSlot: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: LABEL_BASELINE_INSET,
  },
  fabRing: {
    position: 'absolute',
    top: 0,
    /*
      Centred by arithmetic rather than alignSelf: both operands are known at
      module load, and an exact offset cannot be thrown off by how Yoga aligns
      an absolutely positioned child. The middle of five equal tabs is the
      middle of the bar, so this lands the disc over its own slot.
    */
    left: (BAR_WIDTH - FAB_SIZE) / 2,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    // Opaque: the ring separates the gold disc from the bar it overlaps, and
    // gives Android a real outline to composite the elevation against.
    // Clear of the bar's elevation, so the disc lands on top of it, not under.
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    elevation: 20,
    zIndex: 2,
  },
  /**
   * Selected state for the centre button.
   *
   * The disc is gold in both states — it is the one tab that always looks
   * filled — so selection is carried by the ring around it instead: white and
   * flat reads as a gap, pale gold behind a gold hairline reads as part of the
   * button. The scale is deliberately small; the disc already overhangs the
   * bar, and anything larger makes the whole row look like it shifted.
   *
   * borderWidth insets content, so the padding drops by the same 1 to keep the
   * gold disc exactly FAB_SIZE - 6 across in both states — otherwise switching
   * tabs visibly resizes the icon.
   */
  fabRingActive: {
    padding: 2,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.gradientTop,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    transform: [{ scale: 1.06 }],
  },
  fabRingInactive: {
    padding: 3,
    backgroundColor: theme.colors.cardBackground,
    shadowOpacity: 0.28,
    shadowRadius: 9,
  },
  fab: {
    flex: 1,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /**
   * Backdrop for the selected flat tab. It had no fill or radius, so it painted
   * nothing and selection was carried by icon colour alone — too quiet next to
   * the raised centre button.
   *
   * Each tab is BAR_WIDTH/5 wide — about 58px on a 360pt screen but only ~52 on
   * a 320pt one, so the pill stays under that or it spills into its neighbours.
   */
  activePill: {
    position: 'absolute',
    width: 48,
    height: 46,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryAlpha[10],
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    // Five tabs leave little room; a wrapped label would push the row taller
    // and shift every icon.
    textAlign: 'center',
  },
  labelActive: {
    color: theme.colors.primaryDark,
  },
  labelInactive: {
    color: theme.colors.menuItemInactive,
  },
});
