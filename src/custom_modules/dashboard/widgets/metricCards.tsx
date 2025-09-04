import React, { ReactNode, useEffect, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet, Animated } from 'react-native';
import { theme } from '~/theme/theme';

const screenWidth = Dimensions.get('window').width;

export interface IMetric {
  label: string;
  value: string;
  subLabel: string;
  iconName: ReactNode;
  iconColor?: string;
  iconBackgroundColor?: string;
  cardBackgroundColor?: string;
  valueColor?: string;
  subLabelColor?: string;
  labelColor?: string;
  width?: number;
  isLoading?: boolean;
}

// Shimmer loading component
const ShimmerPlaceholder = ({
  width,
  height,
  borderRadius = 4,
}: {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
}) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => shimmer());
    };

    shimmer();
  }, [shimmerAnimation]);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View
      style={[
        styles.shimmerContainer,
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E5E7EB',
        },
      ]}>
      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

// Loading state component
const TaskMetricsCardSkeleton = ({
  width = (screenWidth - 48) / 2,
  cardBackgroundColor = '#F9FAFB',
}: {
  width?: number;
  cardBackgroundColor?: string;
}) => {
  return (
    <View
      style={[
        styles.metricCard,
        {
          backgroundColor: cardBackgroundColor,
          width: width,
        },
      ]}>
      <View style={styles.metricContent}>
        <View style={styles.metricInfo}>
          {/* Label skeleton */}
          <ShimmerPlaceholder width="60%" height={16} borderRadius={4} />

          <View style={styles.metricFooter}>
            {/* Value skeleton */}
            <ShimmerPlaceholder width={40} height={28} borderRadius={4} />
            {/* SubLabel skeleton */}
            <ShimmerPlaceholder width={60} height={16} borderRadius={4} />
          </View>
        </View>

        {/* Icon skeleton */}
        <View style={styles.metricIconSkeleton}>
          <ShimmerPlaceholder width={20} height={20} borderRadius={6} />
        </View>
      </View>
    </View>
  );
};

export const TaskMetricsCard = ({
  label,
  value,
  subLabel,
  iconName,
  iconBackgroundColor = '#86EFAC',
  cardBackgroundColor = '#F0FDF4',
  valueColor = '#0A0A0A',
  subLabelColor = '#166534',
  labelColor = '#0A0A0A',
  width = (screenWidth - 48) / 2,
  isLoading = false,
}: IMetric) => {
  // Show loading skeleton when isLoading is true
  if (isLoading) {
    return <TaskMetricsCardSkeleton width={width} cardBackgroundColor={cardBackgroundColor} />;
  }

  return (
    <View
      style={[
        styles.metricCard,
        {
          backgroundColor: cardBackgroundColor,
          width: width,
        },
      ]}>
      <View style={styles.metricContent}>
        <View style={styles.metricInfo}>
          <Text style={[styles.metricLabel, { color: labelColor }]}>{label}</Text>
          <View style={styles.metricFooter}>
            <Text style={[styles.metricValue, { color: valueColor }]}>{value}</Text>
            <Text style={[styles.metricSubLabel, { color: subLabelColor }]}>{subLabel}</Text>
          </View>
        </View>
        <View style={[styles.metricIcon, { backgroundColor: iconBackgroundColor }]}>
          {iconName}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  metricCard: {
    marginHorizontal: 8,
    marginBottom: 16,
    borderRadius: theme.borderRadius.lg,
    padding: 14,
  },
  metricContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metricInfo: {
    flex: 1,
  },
  metricFooter: {
    flexDirection: 'row',
    marginTop: 22,
    alignItems: 'center',
    gap: 5,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricSubLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricIconSkeleton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shimmerContainer: {
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: '30%',
  },
});
