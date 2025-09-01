import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ModuleKeys } from '~/store/interface';

interface NotificationButtonProps {
  navigation: any;
  badgeCount?: number;
  showBadge?: boolean;
  badgeColor?: string;
  iconColor?: string;
  iconSize?: number;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({
  navigation,
  badgeCount = 0,
  showBadge = true,
  badgeColor = '#EF4444', // Red color
  iconColor = '#fff',
  iconSize = 22,
}) => {
  // Don't show badge if count is 0 or showBadge is false
  const shouldShowBadge = showBadge && badgeCount > 0;

  // Format badge text (show 99+ for counts over 99)
  const badgeText = badgeCount > 99 ? '99+' : badgeCount.toString();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(ModuleKeys.notifications)}
      style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="notifications-outline" size={iconSize} color={iconColor} />

        {/* Badge */}
        {shouldShowBadge && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Alternative version with animated badge
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const AnimatedNotificationButton: React.FC<NotificationButtonProps> = ({
  navigation,
  badgeCount = 0,
  showBadge = true,
  badgeColor = '#EF4444',
  iconColor = '#fff',
  iconSize = 22,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shouldShowBadge = showBadge && badgeCount > 0;
  const badgeText = badgeCount > 99 ? '99+' : badgeCount.toString();

  // Animate badge when count changes
  useEffect(() => {
    if (shouldShowBadge) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [badgeCount]);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(ModuleKeys.notifications)}
      style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="notifications-outline" size={iconSize} color={iconColor} />

        {/* Animated Badge */}
        {shouldShowBadge && (
          <Animated.View
            style={[
              styles.badge,
              {
                backgroundColor: badgeColor,
                transform: [{ scale: scaleAnim }],
              },
            ]}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </Animated.View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Version with dot indicator instead of number
export const NotificationButtonWithDot: React.FC<NotificationButtonProps> = ({
  navigation,
  showBadge = true,
  badgeColor = '#EF4444',
  iconColor = '#fff',
  iconSize = 22,
}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(ModuleKeys.notifications)}
      style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="notifications-outline" size={iconSize} color={iconColor} />

        {/* Dot Badge */}
        {showBadge && <View style={[styles.dotBadge, { backgroundColor: badgeColor }]} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4, // Add some padding for better touch area
  },
  iconContainer: {
    position: 'relative',
    width: 24, // Slightly larger than icon to accommodate badge
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
    textAlign: 'center',
  },
  dotBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
