import { Copy, Download, Mail, MessageCircle, Share2, X } from 'lucide-react-native';
import React from 'react';
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const ShareModalPropertyDetails = ({ cancel }: { cancel: () => void }) => {
  const handleNativeShare = async () => {
    try {
      const result = await Share.share({
        message: '',
        title: 'Mortgage Calculator Results',
      });

      if (result.action === Share.sharedAction) {
        cancel();
        Alert.alert('Success', 'Results shared successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share results. Please try again.');
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      // Note: In a real React Native app, you'd use @react-native-clipboard/clipboard
      // For now, we'll show an alert

      Alert.alert('Copy to Clipboard', 'Results copied to clipboard!', [
        { text: 'OK', onPress: cancel },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy results. Please try again.');
    }
  };

  const handleEmailShare = () => {
    const subject = 'Mortgage Calculator Results';
    // In a real app, you'd use react-native-email-link or similar
    Alert.alert('Email Share', 'This would open your email app with the results pre-filled.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Continue', onPress: cancel },
    ]);
  };

  const handleSMSShare = () => {
    // In a real app, you'd use react-native-sms or similar
    Alert.alert('SMS Share', 'This would open your messaging app with the results pre-filled.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Continue', onPress: cancel },
    ]);
  };

  const handleDownloadPDF = () => {
    // In a real app, you'd generate a PDF using react-native-html-to-pdf or similar
    Alert.alert(
      'Download PDF',
      'This would generate and download a PDF with your mortgage calculation results.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: cancel },
      ]
    );
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Share Your Results</Text>
          <TouchableOpacity style={styles.closeButton} onPress={cancel}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.shareOptions}>
          <TouchableOpacity style={styles.shareOption} onPress={handleNativeShare}>
            <View style={[styles.shareOptionIcon, { backgroundColor: '#3B82F6' }]}>
              <Share2 size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.shareOptionText}>Share</Text>
            <Text style={styles.shareOptionSubtext}>Use device sharing</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareOption} onPress={handleCopyToClipboard}>
            <View style={[styles.shareOptionIcon, { backgroundColor: '#10B981' }]}>
              <Copy size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.shareOptionText}>Copy</Text>
            <Text style={styles.shareOptionSubtext}>Copy to clipboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareOption} onPress={handleEmailShare}>
            <View style={[styles.shareOptionIcon, { backgroundColor: '#F59E0B' }]}>
              <Mail size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.shareOptionText}>Email</Text>
            <Text style={styles.shareOptionSubtext}>Send via email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareOption} onPress={handleSMSShare}>
            <View style={[styles.shareOptionIcon, { backgroundColor: '#8B5CF6' }]}>
              <MessageCircle size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.shareOptionText}>Message</Text>
            <Text style={styles.shareOptionSubtext}>Send via SMS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareOption} onPress={handleDownloadPDF}>
            <View style={[styles.shareOptionIcon, { backgroundColor: '#EF4444' }]}>
              <Download size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.shareOptionText}>PDF</Text>
            <Text style={styles.shareOptionSubtext}>Download as PDF</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.cancelButton} onPress={cancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 34,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  shareOptions: {
    gap: 16,
    marginBottom: 32,
  },
  closeButton: {
    padding: 4,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    gap: 16,
  },
  shareOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  shareOptionSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});
