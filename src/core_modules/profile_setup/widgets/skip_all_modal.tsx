import { AlertCircle, X } from 'lucide-react-native';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

interface SkipModalProps {
  showSkipModal: boolean;
  dismiss: () => void;
  handleSkipAll: () => void;
  isSkipping: boolean;
}

export const SkipAllModal = ({
  showSkipModal,
  dismiss,
  handleSkipAll,
  isSkipping,
}: SkipModalProps) => {
  return (
    <Modal
      visible={showSkipModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => dismiss()}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => dismiss()}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>

          <View style={styles.modalIconContainer}>
            <AlertCircle size={48} color={theme.colors.primary} />
          </View>

          <Text style={styles.modalTitle}>Skip All Setup Tasks?</Text>
          <Text style={styles.modalDescription}>
            These are very important steps to build yur real estate career, this is the foundation.
            Are you sure you want to skip these steps?
          </Text>

          <View style={styles.modalButtons}>
            <OutlineButton title="Cancel" onPress={() => dismiss()} style={styles.modalButton} />
            <PrimaryButton
              style={{
                backgroundColor: theme.colors.primary,
                ...styles.modalButton,
              }}
              loading={isSkipping}
              onPress={handleSkipAll}
              title="Yes, Skip All"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  modalIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
