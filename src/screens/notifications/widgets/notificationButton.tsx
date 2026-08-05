import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GetUserNotificationsResponse } from '../interfaces';
import { getUserNotificationsQuery } from '../graphql/queries';
import { userData } from '~/store/user';
import Text from '~/codidge_components/UI/text';
import { getUserNotificationsVariables } from '../helpers';

interface NotificationButtonProps {
  navigation: any;
  showBadge?: boolean;
  badgeColor?: string;
  iconColor?: string;
  iconSize?: number;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({
  showBadge = true,
  badgeColor = '#EF4444', // Red color
  iconColor = '#fff',
  iconSize = 22,
}) => {
  const user = useReactiveVar(userData);

  // Don't show badge if count is 0 or showBadge is false
  const { data } = useQuery<GetUserNotificationsResponse>(getUserNotificationsQuery, {
    variables: getUserNotificationsVariables(user?.id),
    fetchPolicy: 'cache-and-network', // Keep badge updated
  });

  // Count only UNREAD notifications
  const unreadCount = data?.getUserNotifications?.items?.filter((n) => !n.read).length ?? 0;

  const shouldShowBadge = showBadge && unreadCount > 0;
  const badgeText = unreadCount > 99 ? '99+' : unreadCount.toString();

  return (
    <TouchableOpacity onPress={() => {}} style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    padding: 10, // Add some padding for better touch area
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
    fontSize: 11,
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
