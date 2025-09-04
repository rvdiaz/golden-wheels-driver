import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ITask } from '../interfaces';
import { TaskItem } from './taskItem';
import { theme } from '~/theme/theme';
import { Slider } from '~/codidge_components/UI/slider';

// Main TaskList component with loading state
export const TaskList = ({
  tasks,
  displayList,
  isLoading = false,
}: {
  tasks: ITask[];
  displayList: ITask[];
  isLoading?: boolean;
}) => {
  // Show loading skeleton when isLoading is true
  if (isLoading) {
    return <TaskListSkeleton />;
  }

  const completedTasks = tasks.filter((task) => task.isCompleted);
  const totalTasks = tasks.length;
  const completedCount = completedTasks.length;
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <View style={styles.tasksCard}>
      <View style={styles.tasksHeader}>
        <Text style={styles.tasksTitle}>Today's Tasks</Text>
        <Text style={styles.tasksDate}>
          {completedCount}/{totalTasks} Complete
        </Text>
      </View>
      <Slider progressPercentage={progressPercentage} primaryColor={theme.colors.primary} />
      <View>
        {displayList.map((task) => (
          <TaskItem key={task.id} task={task} />
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

// Skeleton TaskItem component
const TaskItemSkeleton = () => {
  return (
    <View style={styles.taskItemSkeleton}>
      <View style={styles.taskContentSkeleton}>
        <View style={styles.taskHeaderSkeleton}>
          <View style={styles.taskInfoSkeleton}>
            {/* Task title skeleton */}
            <ShimmerPlaceholder width="70%" height={16} borderRadius={4} />
            {/* Task description skeleton */}
            <View style={{ marginTop: 8 }}>
              <ShimmerPlaceholder width="90%" height={12} borderRadius={3} />
              <View style={{ marginTop: 4 }}>
                <ShimmerPlaceholder width="60%" height={12} borderRadius={3} />
              </View>
            </View>
          </View>
          {/* Checkbox skeleton */}
          <ShimmerPlaceholder width={20} height={20} borderRadius={10} />
        </View>

        <View style={styles.taskMetaSkeleton}>
          {/* Category badge skeleton */}
          <ShimmerPlaceholder width={60} height={24} borderRadius={14} />
          <View style={styles.rightFooterSkeleton}>
            {/* Priority icon skeleton */}
            <ShimmerPlaceholder width={16} height={16} borderRadius={4} />
            {/* Time skeleton */}
            <ShimmerPlaceholder width={80} height={12} borderRadius={3} />
          </View>
        </View>
      </View>
    </View>
  );
};

// Skeleton TaskList component
const TaskListSkeleton = () => {
  return (
    <View style={styles.tasksCard}>
      <View style={styles.tasksHeader}>
        <ShimmerPlaceholder width={120} height={18} borderRadius={4} />
        <ShimmerPlaceholder width={80} height={14} borderRadius={4} />
      </View>

      {/* Progress bar skeleton */}
      <View style={styles.progressBarSkeleton}>
        <ShimmerPlaceholder width="100%" height={8} borderRadius={4} />
      </View>

      <View>
        {/* Render 3-4 skeleton task items */}
        {Array.from({ length: 4 }).map((_, index) => (
          <TaskItemSkeleton key={index} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tasksCard: {
    flex: 2,
    backgroundColor: '#F8FAFC',
    borderRadius: theme.borderRadius.lg,
    padding: 12,
    paddingVertical: 16,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tasksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A0A0A',
  },
  tasksDate: {
    fontSize: 12,
    color: '#0A0A0A',
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
  progressBarSkeleton: {
    marginBottom: 16,
  },
  taskItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    marginBottom: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  taskContentSkeleton: {
    flex: 1,
  },
  taskHeaderSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskInfoSkeleton: {
    flex: 1,
    marginRight: 8,
  },
  taskMetaSkeleton: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 21,
  },
  rightFooterSkeleton: {
    alignItems: 'flex-end',
    gap: 2,
  },
});
