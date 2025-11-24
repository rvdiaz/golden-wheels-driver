import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '~/codidge_components/UI/text';
import * as Icons from 'lucide-react-native';

interface InteractiveContentItemProps {
  item: any;
}

export const InteractiveContentItem: React.FC<InteractiveContentItemProps> = ({ item }) => {
  const handleStartInteractive = () => {
    // TODO: Implement interactive content launch logic
    console.log('Start interactive:', item.url);
  };

  return (
    <View style={styles.container}>
      {item.description && <Text style={styles.description}>{item.description}</Text>}

      {/* Interactive Preview Card */}
      <View style={styles.interactiveCard}>
        <View style={styles.iconSection}>
          <View style={styles.largeIcon}>
            <Icons.Gamepad2 size={48} color="#F59E0B" />
          </View>
          <Text style={styles.cardTitle}>Interactive Learning</Text>
          <Text style={styles.cardSubtitle}>Hands-on experience</Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Icons.MousePointerClick size={16} color="#D97706" />
            <Text style={styles.featureText}>Interactive Experience</Text>
          </View>

          {item.estimatedDuration && (
            <View style={styles.featureItem}>
              <Icons.Clock size={16} color="#D97706" />
              <Text style={styles.featureText}>{item.estimatedDuration}</Text>
            </View>
          )}

          <View style={styles.featureItem}>
            <Icons.Award size={16} color="#D97706" />
            <Text style={styles.featureText}>Progress Tracked</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.launchButton}
          onPress={handleStartInteractive}
          activeOpacity={0.8}>
          <Icons.Rocket size={20} color="#FFFFFF" />
          <Text style={styles.launchButtonText}>Launch Activity</Text>
          <Icons.ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Additional Info */}
      {(item.url || item.mimeType) && (
        <View style={styles.additionalInfo}>
          {item.mimeType && (
            <View style={styles.infoRow}>
              <Icons.FileType size={14} color="#6B7280" />
              <Text style={styles.infoText}>
                {item.mimeType.split('/').pop()?.toUpperCase() || 'INTERACTIVE'}
              </Text>
            </View>
          )}
          {item.url && (
            <View style={styles.infoRow}>
              <Icons.Link size={14} color="#6B7280" />
              <Text style={styles.infoText} numberOfLines={1}>
                {item.url}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  interactiveCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  largeIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#D97706',
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '500',
  },
  launchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#F59E0B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  launchButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  additionalInfo: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
});
