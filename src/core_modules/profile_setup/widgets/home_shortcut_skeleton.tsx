import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ShimmerPlaceholder } from '~/codidge_components/UI/skeleton/shimmerPlaceholder';

interface ProfileSetupShortcutSkeletonProps {
  size?: number;
  strokeWidth?: number;
}

export const ProfileSetupShortcutSkeleton: React.FC<ProfileSetupShortcutSkeletonProps> = ({
  size = 110,
}) => {
  return (
    <View style={styles.container}>
      {/* Left Side - Text Content Skeleton */}
      <View style={styles.leftContent}>
        {/* Title skeleton */}
        <ShimmerPlaceholder width={80} height={20} borderRadius={4} />

        {/* Description skeleton - 3 lines */}
        <View style={styles.descriptionContainer}>
          <ShimmerPlaceholder width="100%" height={14} borderRadius={4} />
          <ShimmerPlaceholder width="95%" height={14} borderRadius={4} />
          <ShimmerPlaceholder width="70%" height={14} borderRadius={4} />
        </View>

        {/* Button skeleton */}
        <ShimmerPlaceholder width={120} height={40} borderRadius={8} />
      </View>

      {/* Right Side - Progress Ring Skeleton */}
      <View style={styles.rightContent}>
        <View style={[styles.progressContainer, { width: size, height: size }]}>
          {/* Circular progress skeleton */}
          <ShimmerPlaceholder
            width={size}
            height={size}
            borderRadius={size / 2}
            style={styles.circleSkeleton}
          />

          {/* Center content skeleton */}
          <View style={styles.centerContent}>
            <ShimmerPlaceholder width={40} height={24} borderRadius={4} />
            <View style={{ height: 4 }} />
            <ShimmerPlaceholder width={50} height={10} borderRadius={4} />
          </View>
        </View>

        {/* Percentage skeleton */}
        <ShimmerPlaceholder width={35} height={12} borderRadius={4} />
      </View>
    </View>
  );
};

// Enhanced version skeleton
export const EnhancedProfileSetupShortcutSkeleton: React.FC<ProfileSetupShortcutSkeletonProps> = ({
  size = 80,
  strokeWidth = 8,
}) => {
  return (
    <View style={styles.enhancedContainer}>
      {/* Left Side */}
      <View style={styles.leftContent}>
        {/* Title row with badge */}
        <View style={styles.titleRow}>
          <ShimmerPlaceholder width={80} height={20} borderRadius={4} />
          <View style={{ width: 8 }} />
          <ShimmerPlaceholder width={50} height={20} borderRadius={12} />
        </View>

        {/* Description skeleton - 2 lines */}
        <View style={styles.descriptionContainer}>
          <ShimmerPlaceholder width="100%" height={14} borderRadius={4} />
          <ShimmerPlaceholder width="85%" height={14} borderRadius={4} />
        </View>

        {/* Next step preview skeleton */}
        <View style={styles.nextStepPreview}>
          <ShimmerPlaceholder width={35} height={11} borderRadius={4} />
          <View style={{ width: 6 }} />
          <ShimmerPlaceholder width={100} height={12} borderRadius={4} />
        </View>

        {/* Button skeleton */}
        <ShimmerPlaceholder width={150} height={40} borderRadius={8} />
      </View>

      {/* Right Side - Progress Ring Skeleton */}
      <View style={styles.rightContent}>
        <View style={[styles.progressContainer, { width: size, height: size }]}>
          {/* Circular progress skeleton */}
          <ShimmerPlaceholder
            width={size}
            height={size}
            borderRadius={size / 2}
            style={styles.circleSkeleton}
          />

          {/* Center content skeleton */}
          <View style={styles.centerContent}>
            <ShimmerPlaceholder width={30} height={20} borderRadius={4} />
            <View style={{ height: 2 }} />
            <ShimmerPlaceholder width={35} height={8} borderRadius={4} />
          </View>
        </View>

        {/* Percentage skeleton */}
        <ShimmerPlaceholder width={30} height={11} borderRadius={4} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEF2FF',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  enhancedContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
  },
  leftContent: {
    flex: 1,
    paddingRight: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  descriptionContainer: {
    marginTop: 8,
    marginBottom: 12,
    gap: 6,
  },
  nextStepPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
  },
  rightContent: {
    alignItems: 'center',
  },
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  circleSkeleton: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
