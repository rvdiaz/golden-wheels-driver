import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface INavigationItem {
  id: string;
  label: string;
  icon: ReactNode;
  replacementWidget?: ReactNode;
  danger?: boolean;
  onClick: () => void;
}

export interface INavigationSection {
  title: string;
  items: INavigationItem[];
}

// ─── Color tokens ─────────────────────────────────────────────────────────────

const GOLD = theme.colors.primary;
const GOLD_10 = theme.colors.primaryAlpha[10];
const GOLD_18 = theme.colors.primaryAlpha[20];
const GLASS_BG = 'rgba(255,255,255,0.07)';
const WHITE_10 = 'rgba(255,255,255,0.10)';

// ─── Navigation Item ──────────────────────────────────────────────────────────

interface NavItemProps {
  item: INavigationItem;
  isFirst: boolean;
  isLast: boolean;
}

const NavItem = ({ item, isFirst, isLast }: NavItemProps) => {
  const isDanger = item.danger === true;

  if (item.replacementWidget) {
    return <View key={item.id}>{item.replacementWidget}</View>;
  }

  return (
    <TouchableOpacity onPress={item.onClick} activeOpacity={0.75} style={styles.item}>
      {/* Glass highlight on top edge for first item */}

      {/* Icon */}
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: isDanger ? 'rgba(220,38,38,0.08)' : GOLD_10,
            borderColor: isDanger ? 'rgba(220,38,38,0.2)' : GOLD_18,
          },
        ]}>
        {/* Clone icon with brand color */}
        <View style={{ opacity: isDanger ? 0.7 : 1 }}>
          {React.isValidElement(item.icon)
            ? React.cloneElement(item.icon as React.ReactElement<any>, {
                size: 16,
                color: isDanger ? '#f87171' : GOLD,
                strokeWidth: 1.8,
              })
            : item.icon}
        </View>
      </View>

      {/* Label */}
      <Text style={[styles.itemLabel, isDanger && styles.itemLabelDanger]}>{item.label}</Text>

      {/* Chevron */}
      <ChevronRight
        size={15}
        color={isDanger ? 'rgba(248,113,113,0.4)' : 'rgba(218,192,114,0.35)'}
        strokeWidth={1.8}
      />

      {/* Divider — not on last item */}
      {!isLast && <View style={styles.divider} />}
    </TouchableOpacity>
  );
};

// ─── Profile Navigation Section ───────────────────────────────────────────────

export const ProfileNavigationSection = ({ sections }: { sections: INavigationSection[] }) => {
  return (
    <View style={styles.container}>
      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          {/* Section label */}
          {section.title ? <Text style={styles.sectionTitle}>{section.title}</Text> : null}

          {/* Card group */}
          <View style={styles.card}>
            {/* Card top shimmer */}
            <View style={styles.cardShimmer} />
            {/* Card glass highlight */}

            {section.items.map((item, index) => (
              <NavItem
                key={item.id}
                item={item}
                isFirst={index === 0}
                isLast={index === section.items.length - 1}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 6,
  },

  // ── Section ──
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(218,192,114,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 4,
    paddingBottom: 8,
    paddingTop: 4,
  },

  // ── Card group ──
  card: {
    backgroundColor: GLASS_BG,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.09)',
    overflow: 'hidden',
  },
  cardShimmer: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: 1,
    backgroundColor: 'rgba(218,192,114,0.22)',
    borderRadius: 1,
  },

  // ── Item ──
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 13,
    gap: 12,
    position: 'relative',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.78)',
  },
  itemLabelDanger: {
    color: '#f87171',
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: 60,
    right: 0,
    height: 0.5,
    backgroundColor: WHITE_10,
  },
});
