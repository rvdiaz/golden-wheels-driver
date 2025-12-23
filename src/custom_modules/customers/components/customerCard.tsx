import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ICustomer } from '../interfaces';
import {
  formatCustomerDate,
  getAvatarColor,
  getCustomerFullName,
  getCustomerInitials,
  isRecentCustomer,
} from '../utils';
import { formatPhoneNumber } from '~/codidge_components/helpers';

interface CustomerCardProps {
  customer: ICustomer;
  onEdit: () => void;
  onDelete: () => void;
  onPress?: () => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onEdit,
  onDelete,
  onPress,
}) => {
  const fullName = getCustomerFullName(customer);
  const initials = getCustomerInitials(customer);
  const avatarColor = getAvatarColor(fullName);
  const isRecent = isRecentCustomer(customer);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        {/* Customer Info */}
        <View style={styles.info}>
          <View style={styles.header}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{fullName}</Text>
              {isRecent && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              )}
            </View>
            <Text style={styles.date}>{formatCustomerDate(customer.createdAt)}</Text>
          </View>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📧</Text>
              <Text style={styles.detailText} numberOfLines={1}>
                {customer.email}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📱</Text>
              <Text style={styles.detailText}>{formatPhoneNumber(customer.phone)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={(e) => {
            e.stopPropagation();
            onEdit();
          }}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  header: {
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginRight: 8,
  },
  newBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  date: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  details: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  editButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
