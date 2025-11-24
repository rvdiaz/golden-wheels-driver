import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '~/codidge_components/UI/text';
import * as Icons from 'lucide-react-native';
import { theme } from '~/theme/theme';

interface AudioContentItemProps {
  item: any;
}

export const AudioContentItem: React.FC<AudioContentItemProps> = ({ item }) => {
  const handlePlayAudio = () => {
    // TODO: Implement audio playback logic
    console.log('Play audio:', item.url);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null;
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(1)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <View style={styles.container}>
      {item.description && <Text style={styles.description}>{item.description}</Text>}

      {/* Audio Player Card */}
      <View style={styles.audioCard}>
        <View style={styles.waveformContainer}>
          {/* Decorative waveform */}
          <View style={styles.waveform}>
            {[...Array(20)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.waveBar,
                  {
                    height: Math.random() * 30 + 10,
                    opacity: 0.3 + Math.random() * 0.4,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.audioControls}>
          <TouchableOpacity style={styles.playButton} onPress={handlePlayAudio} activeOpacity={0.8}>
            <Icons.Play size={24} color="#FFFFFF" fill="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.audioInfo}>
            <Text style={styles.audioTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.audioMeta}>
              {item.estimatedDuration && (
                <View style={styles.metaItem}>
                  <Icons.Clock size={12} color="#8B5CF6" />
                  <Text style={styles.metaText}>{item.estimatedDuration}</Text>
                </View>
              )}
              {item.fileSize && (
                <View style={styles.metaItem}>
                  <Icons.HardDrive size={12} color="#8B5CF6" />
                  <Text style={styles.metaText}>{formatFileSize(item.fileSize)}</Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <Icons.MoreVertical size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Additional Audio Info */}
      {(item.url || item.mimeType) && (
        <View style={styles.additionalInfo}>
          {item.mimeType && (
            <View style={styles.infoRow}>
              <Icons.FileType size={14} color="#6B7280" />
              <Text style={styles.infoText}>
                {item.mimeType.split('/').pop()?.toUpperCase() || 'AUDIO'}
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
  audioCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  waveformContainer: {
    height: 80,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  waveBar: {
    width: 3,
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B21B6',
    marginBottom: 4,
  },
  audioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#7C3AED',
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
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
