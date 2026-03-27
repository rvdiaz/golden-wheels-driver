import React from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Check, Plus } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { IExtraService } from '~/screens/trips/interfaces';
import { theme } from '~/theme/theme';

export const ServiceCard = ({
  service,
  selected,
  onPress,
}: {
  service: IExtraService;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[card.wrapper, selected && card.wrapperSelected]}>
    {/* Left: icon badge */}
    <View style={[card.iconWrap, selected && card.iconWrapSelected]}>
      {selected ? (
        <Check size={16} color={theme.colors.primary} strokeWidth={2.5} />
      ) : (
        <Plus size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
      )}
    </View>

    {/* Center: name + description */}
    <View style={card.content}>
      <Text style={[card.name, selected && card.nameSelected]}>{service.name}</Text>
      {service.description ? (
        <Text style={card.desc} numberOfLines={2}>
          {service.description}
        </Text>
      ) : null}
    </View>

    {/* Right: price */}
    {service.price != null && (
      <View style={card.priceWrap}>
        <Text style={[card.price, selected && card.priceSelected]}>+${service.price.amount}</Text>
      </View>
    )}

    {/* Gold border when selected */}
    {selected && <View style={card.selectedBorder} pointerEvents="none" />}
  </TouchableOpacity>
);

const card = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    gap: 12,
  },
  wrapperSelected: {
    backgroundColor: 'rgba(212,168,83,0.04)',
    borderColor: 'transparent',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconWrapSelected: {
    backgroundColor: 'rgba(212,168,83,0.1)',
    borderColor: 'rgba(212,168,83,0.3)',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  nameSelected: {
    color: '#111827',
  },
  desc: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 17,
  },
  priceWrap: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  priceSelected: {
    color: theme.colors.primary,
  },
  selectedBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
});
