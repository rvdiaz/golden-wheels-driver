import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Clock } from 'lucide-react-native';
import IconButton from '~/codidge_components/UI/button/IconButton';
import { IFollowUp, IsDoneValues } from '../../interfaces';
import * as Icons from 'lucide-react-native';
import {
  formatFollowUpDate,
  handleCallContact,
  handleEmailContact,
  handleSmsContact,
} from '../../helpers';

interface FollowUpCardProps {
  followUp: IFollowUp;
  onPress?: (followUp: IFollowUp) => void;
  onComplete?: (followUpId: IFollowUp) => void;
  onCall?: (phone: string) => void;
  containerStyle?: ViewStyle;
}

export const FollowUpCard: React.FC<FollowUpCardProps> = ({
  followUp,
  onPress,
  onComplete,
  containerStyle,
}) => {
  const isCompleted = followUp.isDone === IsDoneValues.done;

  const isOverdue = () => {
    const today = new Date();
    const followUpDate = new Date(followUp.date + 'T' + followUp.date);
    return !isCompleted && followUpDate < today;
  };

  const overdue = isOverdue();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isCompleted && styles.completedCard,
        overdue && styles.overdueCard,
        containerStyle,
      ]}
      onPress={() => onPress?.(followUp)}
      activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={[styles.contactName, isCompleted && styles.completedText]}>
            {followUp.contact.firstName} {followUp.contact.lastName}
          </Text>
          <Text style={[styles.title, isCompleted && styles.completedText]}>{followUp.notes}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.contactActions}>
          <IconButton
            onPress={() => handleCallContact(followUp.contact.phone ?? '')}
            icon={<Icons.Phone size={16} />}
          />
          <IconButton
            onPress={() => handleSmsContact(followUp.contact.phone ?? '')}
            icon={<Icons.MessageCircle size={16} />}
          />
          <IconButton
            onPress={() => handleEmailContact(followUp.contact.email ?? '')}
            icon={<Icons.Mail size={16} />}
          />
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.dateContainer}>
          <Clock size={14} color={overdue ? '#EF4444' : '#6B7280'} />
          <Text
            style={[
              styles.dateText,
              overdue && styles.overdueText,
              isCompleted && styles.completedText,
            ]}>
            {formatFollowUpDate(followUp.date)}
          </Text>
        </View>

        {!isCompleted && (
          <TouchableOpacity style={styles.completeButton} onPress={() => onComplete?.(followUp)}>
            <Text style={styles.completeButtonText}>Mark Done</Text>
          </TouchableOpacity>
        )}

        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>✓ Done</Text>
          </View>
        )}
      </View>

      {followUp.notes && (
        <Text style={[styles.notes, isCompleted && styles.completedText]} numberOfLines={2}>
          {followUp.notes}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  completedCard: {
    backgroundColor: '#F9FAFB',
    opacity: 0.8,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardLeft: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    color: '#6B7280',
  },
  completedText: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  overdueText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  completeButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  completedBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedBadgeText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  notes: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  contactActions: {
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',
  },
  actionButton: {
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
});
