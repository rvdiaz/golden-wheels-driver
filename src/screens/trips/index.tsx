import React from 'react';
import { View } from 'react-native';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import Text from '~/codidge_components/UI/text';

import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { ChevronLeft } from 'lucide-react-native';

export const TripsScreen = () => {
  return (
    <BodyWrapper gradientCoverage={0.45}>
      <Text>Tripe</Text>
    </BodyWrapper>
  );
};

export const GlassBackButton = ({
  onPress,
  size = 42,
  iconSize = 20,
}: {
  onPress: () => void;
  size?: number;
  iconSize?: number;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}>
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={40}
          tint="dark"
          style={[StyleSheet.absoluteFill, { borderRadius: size / 2, overflow: 'hidden' }]}>
          <ChevronLeft color="rgba(255,255,255,0.9)" size={iconSize} />
        </BlurView>
      ) : (
        <ChevronLeft color="rgba(255,255,255,0.9)" size={iconSize} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
