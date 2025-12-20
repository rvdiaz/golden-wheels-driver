import React from 'react';
import { View, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { IModifier } from '../../interface';
import Text from '~/codidge_components/UI/text';

interface ModifierCardProps {
  modifier: IModifier;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
}

export const ModifierCard: React.FC<ModifierCardProps> = ({
  modifier,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  return (
    <View style={[styles.card, !modifier.isActive && styles.cardInactive]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{modifier.name}</Text>
          {modifier.description && <Text style={styles.description}>{modifier.description}</Text>}
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.price}>
            {modifier.price.currencyCode} ${modifier.price.amount.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityLabel}>
            {modifier.isActive ? 'Available' : 'Unavailable'}
          </Text>
          <Switch
            value={modifier.isActive}
            onValueChange={onToggleAvailability}
            trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardInactive: {
    opacity: 0.6,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  headerRight: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EF4444',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
