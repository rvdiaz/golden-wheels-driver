import React from 'react';
import { View, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { Camera } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
const GOLD = theme.colors.primary;

// ─── Avatar ───────────────────────────────────────────────────────────────────

export const Avatar = ({
  imageUrl,
  name,
  uploading,
  onPress,
}: {
  imageUrl?: string | null;
  name?: string;
  uploading: boolean;
  onPress: () => void;
}) => {
  const initials =
    name
      ?.split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ?? '?';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={av.wrapper}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={av.image} />
      ) : (
        <View style={av.placeholder}>
          <Text style={av.initials}>{initials}</Text>
        </View>
      )}

      {/* Camera badge */}
      <View style={av.badge}>
        {uploading ? (
          <ActivityIndicator size="small" color={GOLD} />
        ) : (
          <Camera size={14} color={GOLD} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const av = StyleSheet.create({
  wrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: 'center',
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: 'rgba(212,168,83,0.4)',
  },
  placeholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(212,168,83,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(212,168,83,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 32,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 1,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(2,6,23,0.85)',
    borderWidth: 2,
    borderColor: 'rgba(212,168,83,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
