import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '~/theme/theme';
import Text from '../text';

export const Slider = ({
  progressPercentage,
  primaryColor = theme.colors.primary, // Default primary color, can be passed as prop
  progressBottomData,
}: {
  progressPercentage: number;
  primaryColor?: string;
  progressBottomData?: string;
}) => {
  // Convert hex to rgba with 20% opacity for track background
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const trackBackgroundColor = hexToRgba(primaryColor, 0.2);

  return (
    <View>
      <View style={[styles.progressTrack, { backgroundColor: trackBackgroundColor }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressPercentage}%`,
              backgroundColor: primaryColor,
            },
          ]}
        />
      </View>
      {progressBottomData && (
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>{Math.round(progressPercentage)}% completed</Text>
          <Text
            style={[
              styles.progressStatus,
              {
                color: primaryColor,
              },
            ]}>
            {progressPercentage >= 80
              ? 'Great job!'
              : progressPercentage >= 50
                ? 'Keep going!'
                : "Let's start!"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    minWidth: 4, // Ensures some visual feedback even at 0%
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  progressStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
});
