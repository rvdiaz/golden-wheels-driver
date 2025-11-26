import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import { Mail, Share2, X } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  onEmailShare: () => void;
  onNativeShare: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  onEmailShare,
  onNativeShare,
}) => {
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleOptionPress = (action: () => void) => {
    action();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ translateY: slideAnim }],
                },
              ]}>
              {/* Handle Bar */}
              <View style={styles.handleBar} />

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Share Results</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Share Options */}
              <View style={styles.optionsContainer}>
                {/* Email Report */}
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleOptionPress(onEmailShare)}
                  activeOpacity={0.7}>
                  <View style={[styles.iconContainer, styles.emailIconContainer]}>
                    <Mail size={24} color="#3b82f6" />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Email Report</Text>
                    <Text style={styles.optionDescription}>Send detailed report via email</Text>
                  </View>
                </TouchableOpacity>

                {/* Native Share */}
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleOptionPress(onNativeShare)}
                  activeOpacity={0.7}>
                  <View style={[styles.iconContainer, styles.shareIconContainer]}>
                    <Share2 size={24} color="#8b5cf6" />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Share Summary</Text>
                    <Text style={styles.optionDescription}>Share text summary via any app</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emailIconContainer: {
    backgroundColor: '#dbeafe',
  },
  shareIconContainer: {
    backgroundColor: '#ede9fe',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
});
