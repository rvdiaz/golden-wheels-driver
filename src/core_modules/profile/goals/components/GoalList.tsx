import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { IGoalProgress } from '../interfaces';
import { GoalItem } from './GoalItem';
import { theme } from '~/theme/theme';
import { Slider } from '~/codidge_components/UI/slider';

// Main GoalList component with loading state
export const GoalList = ({
  goals,
  displayList,
  isLoading = false,
}: {
  goals: IGoalProgress[];
  displayList: IGoalProgress[];
  isLoading?: boolean;
}) => {
  // Show loading skeleton when isLoading is true
  if (isLoading) {
    return <GoalListSkeleton />;
  }

  // Filter only active goals for calculations
  const activeGoals = goals.filter((goal) => goal.active);
  const completedGoals = activeGoals.filter((goal) => goal.completed);
  const totalGoals = activeGoals.length;
  const completedCount = completedGoals.length;

  // Calculate overall progress as average of all active goals
  const overallProgress =
    totalGoals > 0
      ? activeGoals.reduce((sum, goal) => {
          const goalProgress = Math.min((goal.value / goal.targetValue) * 100, 100);
          return sum + goalProgress;
        }, 0) / totalGoals
      : 0;

  return (
    <View style={styles.goalsCard}>
      <View style={styles.goalsHeader}>
        <Text style={styles.goalsTitle}>Active Goals</Text>
        <Text style={styles.goalsDate}>
          {completedCount}/{totalGoals} Complete
        </Text>
      </View>
      <Slider
        progressPercentage={overallProgress}
        primaryColor={theme.colors.primary}
        progressBottomData="overall"
      />
      <View
        style={{
          marginTop: 12,
        }}>
        {displayList.map((goal) => (
          <GoalItem key={goal.progressId} goal={goal} />
        ))}
      </View>
    </View>
  );
};

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

// Skeleton GoalItem component
const GoalItemSkeleton = () => {
  return (
    <View style={styles.goalItemSkeleton}>
      <View style={styles.goalContentSkeleton}>
        <View style={styles.goalHeaderSkeleton}>
          <View style={styles.goalInfoSkeleton}>
            {/* Goal title skeleton */}
            <ShimmerPlaceholder width="75%" height={16} borderRadius={4} />
            {/* Goal description skeleton */}
            <View style={{ marginTop: 8 }}>
              <ShimmerPlaceholder width="90%" height={12} borderRadius={3} />
              <View style={{ marginTop: 4 }}>
                <ShimmerPlaceholder width="65%" height={12} borderRadius={3} />
              </View>
            </View>
          </View>
        </View>

        {/* Progress bar skeleton */}
        <View style={styles.progressBarSkeleton}>
          <ShimmerPlaceholder width="100%" height={8} borderRadius={4} />
        </View>

        <View style={styles.goalMetaSkeleton}>
          {/* Frequency badge skeleton */}
          <ShimmerPlaceholder width={70} height={24} borderRadius={14} />
          <View style={styles.rightFooterSkeleton}>
            {/* Progress text skeleton */}
            <ShimmerPlaceholder width={60} height={12} borderRadius={3} />
            {/* Period skeleton */}
            <ShimmerPlaceholder width={80} height={12} borderRadius={3} />
          </View>
        </View>
      </View>
    </View>
  );
};

// Skeleton GoalList component
const GoalListSkeleton = () => {
  return (
    <View style={styles.goalsCard}>
      <View style={styles.goalsHeader}>
        <ShimmerPlaceholder width={100} height={18} borderRadius={4} />
        <ShimmerPlaceholder width={80} height={14} borderRadius={4} />
      </View>

      {/* Progress bar skeleton */}
      <View style={styles.progressBarMainSkeleton}>
        <ShimmerPlaceholder width="100%" height={8} borderRadius={4} />
        <View style={styles.progressInfoSkeleton}>
          <ShimmerPlaceholder width={90} height={12} borderRadius={3} />
          <ShimmerPlaceholder width={70} height={12} borderRadius={3} />
        </View>
      </View>

      <View>
        {/* Render 3-4 skeleton goal items */}
        {Array.from({ length: 3 }).map((_, index) => (
          <GoalItemSkeleton key={index} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  goalsCard: {
    flex: 2,
    backgroundColor: '#F8FAFC',
    borderRadius: theme.borderRadius.lg,
    padding: 12,
    paddingVertical: 16,
  },
  goalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textColor,
  },
  goalsDate: {
    fontSize: 12,
    color: theme.colors.textColor,
    fontWeight: '400',
  },
  // Shimmer styles
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
  // Skeleton styles
  progressBarMainSkeleton: {
    marginBottom: 20,
  },
  progressInfoSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBarSkeleton: {
    marginBottom: 12,
    marginTop: 8,
  },
  goalItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  goalContentSkeleton: {
    flex: 1,
  },
  goalHeaderSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  goalInfoSkeleton: {
    flex: 1,
    marginRight: 8,
  },
  goalMetaSkeleton: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rightFooterSkeleton: {
    alignItems: 'flex-end',
    gap: 2,
  },
});
