import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Icons from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH * 0.85;
const IMAGE_HEIGHT = 800;

interface ComingSoonModalProps {
  visible: boolean;
  onClose: () => void;
  toolName: string;
  toolDescription: string;
  toolIcon?: string;
  toolColor?: string;
  screenshots: string[];
  comingSoonLabel?: string;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  visible,
  onClose,
  toolName,
  toolColor = theme.colors.primary,
  screenshots = [],
  comingSoonLabel = 'Coming Soon',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / IMAGE_WIDTH);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const adjustColorOpacity = (color: string, opacity: number): string => {
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return `rgba(0, 0, 0, ${opacity})`;
  };

  const renderScreenshot = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.screenshotContainer}>
      <View style={styles.phoneFrame}>
        {/* Screenshot image */}
        <Image source={{ uri: item }} style={styles.screenshot} resizeMode="cover" />

        {/* Phone home indicator */}
        <View style={styles.phoneIndicator} />
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <LinearGradient
            colors={[toolColor, adjustColorOpacity(toolColor, 0.8)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, left: 10, right: 10 }}>
              <Icons.X size={24} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <Text style={styles.toolNameText}>{toolName}</Text>

              <View style={styles.comingSoonBadge}>
                <Icons.Clock size={14} color="#FFF" />
                <Text style={styles.comingSoonBadgeText}>{comingSoonLabel}</Text>
              </View>
            </View>
          </LinearGradient>
          {/* Screenshots Carousel */}
          {screenshots.length > 0 ? (
            <View style={styles.carouselSection}>
              <FlatList
                ref={flatListRef}
                data={screenshots}
                renderItem={renderScreenshot}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={1}
                snapToInterval={IMAGE_WIDTH}
                decelerationRate="fast"
                keyExtractor={(item, index) => `screenshot-${index}`}
                getItemLayout={(data, index) => ({
                  length: IMAGE_WIDTH,
                  offset: IMAGE_WIDTH * index,
                  index,
                })}
              />
            </View>
          ) : (
            <View style={styles.noScreenshotsContainer}>
              <Icons.Image size={48} color="#9CA3AF" />
              <Text style={styles.noScreenshotsText}>
                Preview screenshots will be available soon
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: SCREEN_HEIGHT,
    overflow: 'hidden',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 0,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  comingSoonBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  carouselSection: {
    height: IMAGE_HEIGHT * 0.82,
    marginTop: 16,
  },
  screenshotContainer: {
    width: IMAGE_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  phoneFrame: {
    width: IMAGE_WIDTH * 0.9,
    height: IMAGE_HEIGHT * 0.8,
    backgroundColor: '#1F2937',
    borderRadius: 32,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  screenshot: {
    flex: 1,
    width: '100%',
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    objectFit: 'cover',
  },
  phoneIndicator: {
    width: 120,
    height: 4,
    backgroundColor: '#FFF',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 0,
  },
  noScreenshotsContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  noScreenshotsText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
  descriptionSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 24,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  notifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
