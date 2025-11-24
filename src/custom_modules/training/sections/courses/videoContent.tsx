import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Dimensions,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import Text from '~/codidge_components/UI/text';
import * as Icons from 'lucide-react-native';
import { theme } from '~/theme/theme';
import { ContentItem } from '../../interfaces';

interface VideoContentItemProps {
  item: ContentItem;
}

export const VideoContentItem: React.FC<VideoContentItemProps> = ({ item }) => {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);

  // Create video player
  const player = useVideoPlayer(item.url ?? '', (player) => {
    player.loop = false;
    player.muted = false;
  });

  const handlePlayInline = () => {
    setShowThumbnail(false);
    setIsPlaying(true);
    player.play();
  };

  const handleOpenFullscreen = () => {
    setShowFullscreen(true);
    if (!isPlaying) {
      player.play();
      setIsPlaying(true);
    }
  };

  const handleCloseFullscreen = () => {
    setShowFullscreen(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
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
      {/* Video Preview/Player */}
      <View style={styles.videoPreview}>
        {showThumbnail ? (
          // Show thumbnail with play button
          <TouchableOpacity
            style={styles.thumbnailContainer}
            onPress={handlePlayInline}
            activeOpacity={0.9}>
            <ImageBackground
              source={{
                uri: item.thumbnailUrl || item.url,
              }}
              style={styles.videoBackground}
              imageStyle={styles.videoImage}>
              <View style={styles.overlay}>
                <View style={styles.playButton}>
                  <Icons.Play size={32} color="#FFFFFF" fill="#FFFFFF" />
                </View>
                {item.estimatedDuration && (
                  <View style={styles.durationBadge}>
                    <Icons.Clock size={12} color="#FFFFFF" />
                    <Text style={styles.durationText}>{item.estimatedDuration}</Text>
                  </View>
                )}
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          // Show inline video player
          <View style={styles.inlineVideoContainer}>
            <VideoView
              style={styles.inlineVideo}
              player={player}
              contentFit="contain"
              nativeControls={false}
            />

            {/* Inline Video Controls Overlay */}
            <View style={styles.inlineControlsOverlay}>
              {/* Play/Pause Button */}
              <TouchableOpacity style={styles.inlinePlayPauseButton} onPress={togglePlayPause}>
                {isPlaying ? (
                  <Icons.Pause size={24} color="#FFFFFF" fill="#FFFFFF" />
                ) : (
                  <Icons.Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                )}
              </TouchableOpacity>

              {/* Fullscreen Button */}
              <TouchableOpacity style={styles.fullscreenButton} onPress={handleOpenFullscreen}>
                <Icons.Maximize size={20} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Duration Badge */}
              {item.estimatedDuration && (
                <View style={styles.durationBadge}>
                  <Icons.Clock size={12} color="#FFFFFF" />
                  <Text style={styles.durationText}>{item.estimatedDuration}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Video Metadata */}
      {/* {(item.fileSize || item.mimeType) && (
        <View style={styles.metadataContainer}>
          {item.fileSize && (
            <View style={styles.metadataRow}>
              <Icons.HardDrive size={14} color="#6B7280" />
              <Text style={styles.metadataText}>{formatFileSize(item.fileSize)}</Text>
            </View>
          )}
          {item.mimeType && (
            <View style={styles.metadataRow}>
              <Icons.FileType size={14} color="#6B7280" />
              <Text style={styles.metadataText}>{item.mimeType}</Text>
            </View>
          )}
        </View>
      )} */}

      {/* Fullscreen Video Modal */}
      <Modal
        visible={showFullscreen}
        animationType="fade"
        onRequestClose={handleCloseFullscreen}
        supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.fullscreenContainer}>
          <VideoView
            style={styles.fullscreenVideo}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            contentFit="contain"
          />

          {/* Fullscreen Controls Overlay */}
          <View style={styles.controlsOverlay}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseFullscreen}>
              <Icons.X size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Center Play/Pause for Fullscreen */}
            {!showFullscreen && (
              <TouchableOpacity style={styles.centerPlayPauseButton} onPress={togglePlayPause}>
                {isPlaying ? (
                  <Icons.Pause size={40} color="#FFFFFF" fill="#FFFFFF" />
                ) : (
                  <Icons.Play size={40} color="#FFFFFF" fill="#FFFFFF" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  videoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#000',
  },
  thumbnailContainer: {
    width: '100%',
    height: '100%',
  },
  videoBackground: {
    width: '100%',
    height: '100%',
  },
  videoImage: {
    borderRadius: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inlineVideoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  inlineVideo: {
    width: '100%',
    height: '100%',
  },
  inlineControlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlinePlayPauseButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
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
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenVideo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  centerPlayPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
