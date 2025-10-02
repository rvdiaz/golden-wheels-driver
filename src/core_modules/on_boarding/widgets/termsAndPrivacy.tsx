import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { privacyContent, termsContent } from '../core';

// Modal Component for Terms and Privacy
const InfoModal = ({ visible, onClose, title, content }: any) => (
  <Modal
    visible={visible}
    animationType="slide"
    presentationStyle="pageSheet"
    onRequestClose={onClose}>
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{title}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.modalText}>{content}</Text>
      </ScrollView>
    </View>
  </Modal>
);

export const TermsAndPrivacy = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
      <View style={styles.legalContainer}>
        <Text style={styles.legalText}>
          By clicking Get Started, you agree to our{' '}
          <Text style={styles.linkText} onPress={() => setShowTermsModal(true)}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text style={styles.linkText} onPress={() => setShowPrivacyModal(true)}>
            Privacy Policy
          </Text>
        </Text>
      </View>
      {/* Terms Modal */}
      <InfoModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Terms of Service"
        content={termsContent}
      />

      {/* Privacy Modal */}
      <InfoModal
        visible={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy Policy"
        content={privacyContent}
      />
    </>
  );
};

const styles = StyleSheet.create({
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#F8F9FA',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    paddingBottom: 40,
  },
  // Legal Text Styles
  legalContainer: {
    paddingHorizontal: 16,
  },
  legalText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
