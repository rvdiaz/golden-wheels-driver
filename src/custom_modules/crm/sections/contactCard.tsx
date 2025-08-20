import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';
import { ModuleKeys } from '~/store/interface';
import { useNavigation } from '@react-navigation/native';
import { IContact } from '../interfaces';

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'qualified':
      return { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' };
    case 'contacted':
      return { bg: '#FFFBEB', text: '#92400E', border: '#FED7AA' };
    case 'new':
      return { bg: '#EFF6FF', text: '#1E40AF', border: '#DBEAFE' };
    default:
      return { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' };
  }
};

const getTypeColor = (type?: string) => {
  switch (type) {
    case 'buyer':
      return { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' };
    case 'seller':
      return { bg: '#FFF7ED', text: '#9A3412', border: '#FED7AA' };
    case 'investor':
      return { bg: '#F3E8FF', text: '#6B21A8', border: '#DDD6FE' };
    default:
      return { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' };
  }
};

export const ContactCard = ({ item }: { item: IContact }) => {
  const statusColors = getStatusColor(item.leadStatus);
  const typeColors = getTypeColor(item.type);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(ModuleKeys.contactDetals, { contact: item });
      }}
      style={styles.contactCard}>
      <View style={styles.contactRow}>
        <View style={styles.avatarContainer}>
          <Icons.User size={24} color="#6B7280" />
        </View>

        <View style={styles.contactInfo}>
          <View style={styles.contactHeader}>
            <View style={styles.contactNameSection}>
              <Text style={styles.contactName}>
                {item.firstName} {item.lastName}
              </Text>
              <View style={styles.badgeContainer}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: statusColors.bg,
                      borderColor: statusColors.border,
                    },
                  ]}>
                  <Text style={[styles.badgeText, { color: statusColors.text }]}>
                    {item.category}
                  </Text>
                </View>
                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor: typeColors.bg,
                      borderColor: typeColors.border,
                    },
                  ]}>
                  <Text style={[styles.badgeText, { color: typeColors.text }]}>{item.type}</Text>
                </View>
              </View>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Icons.Phone size={16} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icons.Mail size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.contactDetails}>
            <View style={styles.detailRow}>
              <Icons.Mail size={12} color="#6B7280" />
              <Text style={styles.detailText}>{item.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icons.Phone size={12} color="#6B7280" />
              <Text style={styles.detailText}>{item.phone}</Text>
            </View>
            {item.address && (
              <View style={styles.detailRow}>
                <Icons.MapPin size={12} color="#6B7280" />
                <Text style={styles.detailText}>{item.address}</Text>
              </View>
            )}
          </View>

          <Text style={styles.contactNotes}>{item.notes}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contactCard: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contactNameSection: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactDetails: {
    marginBottom: 12,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  contactNotes: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  lastContact: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
});
