import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Clock } from 'lucide-react-native';
import IconButton from '~/codidge_components/UI/button/IconButton';
import { IFollowUp, IsDoneValues } from '../../interfaces';
import * as Icons from 'lucide-react-native';
import { handleCallContact, handleEmailContact, handleSmsContact } from '../../helpers';
import Text from '~/codidge_components/UI/text';

interface FollowUpCardProps {
  followUp: IFollowUp;
  onComplete?: (followUpId: IFollowUp) => void;
  containerStyle?: ViewStyle;
}

// Enhanced date/time formatting function
const formatFollowUpDateTime = (date: string, time: string) => {
  const followUpDate = new Date(date + 'T' + time);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time for date comparison
  const compareDate = new Date(date + 'T00:00:00');
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);

  // Format time (12-hour format with AM/PM)
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formattedTime = formatTime(time);

  // Determine date label
  if (compareDate.getTime() === today.getTime()) {
    return `Today at ${formattedTime}`;
  } else if (compareDate.getTime() === tomorrow.getTime()) {
    return `Tomorrow at ${formattedTime}`;
  } else if (compareDate.getTime() === yesterday.getTime()) {
    return `Yesterday at ${formattedTime}`;
  } else {
    // Format as "Oct 15 at 12:57 PM" for other dates
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = months[followUpDate.getMonth()];
    const day = followUpDate.getDate();
    const year = followUpDate.getFullYear();
    const currentYear = new Date().getFullYear();

    // Include year if different from current year
    if (year !== currentYear) {
      return `${month} ${day}, ${year} at ${formattedTime}`;
    } else {
      return `${month} ${day} at ${formattedTime}`;
    }
  }
};

export const FollowUpCard: React.FC<FollowUpCardProps> = ({
  followUp,
  onComplete,
  containerStyle,
}) => {
  const isCompleted = followUp.isDone === IsDoneValues.done;

  const isOverdue = () => {
    const today = new Date();
    const followUpDateTime = new Date(followUp.date + 'T' + followUp.time);
    return !isCompleted && followUpDateTime < today;
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
      activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={[styles.contactName, isCompleted && styles.completedText]}>
            {followUp.contact.firstName} {followUp.contact.lastName}
          </Text>
          <Text style={[styles.title, isCompleted && styles.completedText]}>{followUp.title}</Text>
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
            {formatFollowUpDateTime(followUp.date as string, followUp.time as string)}
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
