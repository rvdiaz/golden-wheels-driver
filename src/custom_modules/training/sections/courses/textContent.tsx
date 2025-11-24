import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '~/codidge_components/UI/text';
import * as Icons from 'lucide-react-native';
import { theme } from '~/theme/theme';

interface TextContentItemProps {
  item: any;
}

export const TextContentItem: React.FC<TextContentItemProps> = ({ item }) => {
  const handleReadText = () => {
    // TODO: Implement text reading/viewing logic
    console.log('Read text:', item);
  };

  const estimateReadingTime = (text?: string) => {
    if (!text) return null;
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <View style={styles.container}>
      {/* Text Preview Card */}
      <View style={styles.textCard}>
        <View style={styles.textHeader}>
          <View style={styles.textIconContainer}>
            <Icons.BookOpen size={24} color="#6B7280" />
          </View>
          <View style={styles.textInfo}>
            <Text style={styles.textTitle}>{item.title}</Text>
            {item.estimatedDuration && (
              <View style={styles.readingTime}>
                <Icons.Clock size={12} color="#9CA3AF" />
                <Text style={styles.readingTimeText}>{item.estimatedDuration}</Text>
              </View>
            )}
          </View>
        </View>

        {item.description && (
          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>Preview</Text>
            <Text style={styles.previewText} numberOfLines={4}>
              {item.description}
            </Text>
            <View style={styles.fadeOverlay} />
          </View>
        )}

        <TouchableOpacity style={styles.readButton} onPress={handleReadText} activeOpacity={0.8}>
          <Icons.BookOpen size={18} color={theme.colors.primary} />
          <Text style={styles.readButtonText}>Read Article</Text>
          <Icons.ChevronRight size={18} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Additional Metadata */}
      {(item.url || item.mimeType || item.fileSize) && (
        <View style={styles.metadataContainer}>
          {item.mimeType && (
            <View style={styles.metadataRow}>
              <Icons.FileType size={14} color="#6B7280" />
              <Text style={styles.metadataText}>Text Content</Text>
            </View>
          )}
          {item.url && (
            <View style={styles.metadataRow}>
              <Icons.Link size={14} color="#6B7280" />
              <Text style={styles.metadataText} numberOfLines={1}>
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
  textCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textInfo: {
    flex: 1,
  },
  textTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  readingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readingTimeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  previewSection: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  readButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  metadataContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metadataText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
});
