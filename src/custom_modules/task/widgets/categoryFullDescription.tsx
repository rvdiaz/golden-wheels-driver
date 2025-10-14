import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import IconButton from '~/codidge_components/UI/button/IconButton';
import { theme } from '~/theme/theme';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';

export const CategoryFullDescription = ({
  taskHtmlDescription,
}: {
  taskHtmlDescription: string;
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  if (!taskHtmlDescription || taskHtmlDescription.trim() === '') {
    return null;
  }

  return (
    <>
      {/* Info Button */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <AlertCircle size={20} color={theme.colors.primary} />
      </TouchableOpacity>
      {/* Description Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Task Description</Text>
              <IconButton
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
                icon={<X size={20} color="#6B7280" />}
              />
            </View>

            {/* Description Content */}
            <ScrollView style={styles.descriptionContainer} showsVerticalScrollIndicator={true}>
              <Text style={styles.descriptionText}>{taskHtmlDescription}</Text>
            </ScrollView>

            {/* Close Button */}
            <View
              style={{
                padding: 14,
                borderTopWidth: 1,
                borderTopColor: theme.colors.borderNeutralColor,
              }}>
              <PrimaryButton onPress={() => setModalVisible(false)} title="Close" />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    backgroundColor: 'transparent',
    padding: 4,
  },
  descriptionContainer: {
    padding: 16,
    maxHeight: 400,
  },
  descriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
