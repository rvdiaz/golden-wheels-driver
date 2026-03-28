import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '~/codidge_components/UI/text';
import { IExtraService } from '~/screens/trips/interfaces';
import { theme } from '~/theme/theme';
import { formatCurrency } from '~/screens/trips/helpers';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const GOLD = theme.colors.primary;

export const ServiceCard = ({
  service,
  selected,
  onPress,
}: {
  service: IExtraService;
  selected: boolean;
  onPress: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const chevronAnim = useRef(new Animated.Value(0)).current;

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
    Animated.timing(chevronAnim, {
      toValue: expanded ? 0 : 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const chevronRotation = chevronAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <LinearGradient
      colors={
        selected
          ? ['rgba(212,168,83,0.13)', 'rgba(212,168,83,0.06)']
          : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.11)']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[card.wrapper, selected && card.wrapperSelected]}>
      {/* ── Main selectable row ── */}
      <TouchableOpacity onPress={onPress} style={card.mainRow}>
        {/* Thumbnail or placeholder */}
        {service.image?.url ? (
          <View style={[card.thumbnail, selected && card.thumbnailSelected]}>
            <Image
              source={{ uri: service.image.url }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              accessibilityLabel={service.image.alt}
            />
          </View>
        ) : (
          <View style={[card.iconWrap, selected && card.iconWrapSelected]} />
        )}

        {/* Name + unavailable label */}
        <View style={card.nameWrap}>
          <Text style={[card.name, selected && card.nameSelected]} numberOfLines={1}>
            {service.name}
          </Text>
          {/* Price */}
          {service.price != null && (
            <View style={card.priceWrap}>
              <Text style={[card.price, selected && card.priceSelected]}>
                {formatCurrency(service.price.amount, service.price.currencyCode)}
              </Text>
            </View>
          )}
        </View>

        {/* Checkbox */}
        <View style={[card.checkbox, selected && card.checkboxSelected]}>
          {selected && <Check size={11} color="#0a0a0a" strokeWidth={3} />}
        </View>
      </TouchableOpacity>

      {/* ── Expandable description (only if present) ── */}
      {!!service.description && (
        <>
          <View style={card.divider} />
          <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.7} style={card.expandRow}>
            <Text style={card.expandLabel}>{expanded ? 'Hide details' : "What's included"}</Text>
            <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
              <ChevronDown size={14} color="rgba(212,168,83,0.6)" />
            </Animated.View>
          </TouchableOpacity>

          {expanded && (
            <View style={card.descWrap}>
              <Text style={card.desc}>{service.description}</Text>
            </View>
          )}
        </>
      )}

      {/* Gold border overlay when selected */}
      {selected && <View style={card.selectedBorder} pointerEvents="none" />}
    </LinearGradient>
  );
};

const card = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  wrapperSelected: {
    borderColor: 'transparent',
  },

  // ── Main row ──────────────────────────────────────────────────────────────
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },

  // ── Thumbnail ─────────────────────────────────────────────────────────────
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexShrink: 0,
    backgroundColor: 'rgba(255,255,255,0.36)',
  },
  thumbnailSelected: {
    borderColor: 'rgba(212,168,83,0.4)',
  },
  thumbnailDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    flexShrink: 0,
  },
  iconWrapSelected: {
    backgroundColor: 'rgba(212,168,83,0.1)',
    borderColor: 'rgba(212,168,83,0.25)',
  },

  // ── Name ──────────────────────────────────────────────────────────────────
  nameWrap: {
    flex: 1,
    gap: 5,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  nameSelected: {
    color: '#ffffff',
  },
  unavailableLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: 'rgba(239,68,68,0.7)',
  },

  // ── Price ─────────────────────────────────────────────────────────────────
  priceWrap: {
    flexShrink: 0,
    gap: 1,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  priceSelected: {
    color: GOLD,
  },

  // ── Checkbox ──────────────────────────────────────────────────────────────
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxSelected: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },

  // ── Expand toggle ─────────────────────────────────────────────────────────
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginHorizontal: 14,
  },
  expandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  expandLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(212,168,83,0.7)',
  },

  // ── Description ───────────────────────────────────────────────────────────
  descWrap: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  desc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 19,
  },

  // ── Selected border ───────────────────────────────────────────────────────
  selectedBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: GOLD,
  },
});
