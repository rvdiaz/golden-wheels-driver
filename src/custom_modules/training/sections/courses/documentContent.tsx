import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '~/codidge_components/UI/text';
import * as Icons from 'lucide-react-native';
import { theme } from '~/theme/theme';

interface DocumentContentItemProps {
  item: any;
}

export const DocumentContentItem: React.FC<DocumentContentItemProps> = ({ item }) => {
  const handleOpenDocument = () => {
    // TODO: Implement document opening logic
    console.log('Open document:', item.url);
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

  const getDocumentIcon = (mimeType?: string) => {
    if (mimeType?.includes('pdf')) {
      return { icon: Icons.FileText, color: '#DC2626' };
    } else if (mimeType?.includes('word') || mimeType?.includes('document')) {
      return { icon: Icons.FileText, color: '#2563EB' };
    } else if (mimeType?.includes('sheet') || mimeType?.includes('excel')) {
      return { icon: Icons.Sheet, color: '#059669' };
    } else if (mimeType?.includes('presentation') || mimeType?.includes('powerpoint')) {
      return { icon: Icons.Presentation, color: '#EA580C' };
    }
    return { icon: Icons.FileText, color: '#3B82F6' };
  };

  const { icon: DocIcon, color: docColor } = getDocumentIcon(item.mimeType);

  return (
    <View style={styles.container}>
      {item.description && <Text style={styles.description}>{item.description}</Text>}

      {/* Document Preview Card */}
      <TouchableOpacity
        style={styles.documentCard}
        onPress={handleOpenDocument}
        activeOpacity={0.8}>
        <View style={[styles.documentIcon, { backgroundColor: docColor + '20' }]}>
          <DocIcon size={32} color={docColor} />
        </View>

        <View style={styles.documentInfo}>
          <Text style={styles.documentTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.documentMeta}>
            {item.fileSize && (
              <View style={styles.metaItem}>
                <Icons.HardDrive size={12} color="#6B7280" />
                <Text style={styles.metaText}>{formatFileSize(item.fileSize)}</Text>
              </View>
            )}
            {item.mimeType && (
              <View style={styles.metaItem}>
                <Icons.FileType size={12} color="#6B7280" />
                <Text style={styles.metaText}>
                  {item.mimeType.split('/').pop()?.toUpperCase() || 'DOC'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.openButton}>
          <Icons.ExternalLink size={20} color={theme.colors.primary} />
        </View>
      </TouchableOpacity>

      {item.url && (
        <View style={styles.urlContainer}>
          <Icons.Link size={14} color="#6B7280" />
          <Text style={styles.urlText} numberOfLines={1}>
            {item.url}
          </Text>
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
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  documentIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  documentMeta: {
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
    color: '#6B7280',
  },
  openButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
  },
  urlText: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1,
  },
});
