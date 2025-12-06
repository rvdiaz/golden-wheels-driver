import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { WebView } from 'react-native-webview';
import { IExtendedRenterInput } from '../../interfaces';
import Text from '~/codidge_components/UI/text';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';

interface PdfReportModalProps {
  visible: boolean;
  onClose: () => void;
  applicant: IExtendedRenterInput | null;
  isDownloading: boolean;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  visible,
  onClose,
  applicant,
  isDownloading,
}) => {
  const pdfUrl = applicant?.reportPdfUrl;

  const renderContent = () => {
    if (!pdfUrl) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyText}>No PDF Report Available</Text>
          <Text style={styles.emptySubtext}>The PDF report is not ready yet</Text>
        </View>
      );
    }

    return (
      <View style={styles.content}>
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <PrimaryButton
            style={{
              backgroundColor: '#0066CC',
              flex: 1,
            }}
            onPress={async () => {
              try {
                await Share.share({
                  url: pdfUrl, // works on iOS and Android (PDF link)
                  message: `Verichekd report for ${applicant.firstName} ${applicant.lastName}`,
                });
              } catch (error) {
                console.error('Share failed:', error);
              }
            }}
            loading={isDownloading}
            size={ButtonSize.LARGE}
            title="⬇️ Download PDF"
          />
        </View>

        {/* PDF Viewer */}
        <View style={styles.pdfContainer}>
          <WebView
            source={{ uri: pdfUrl }}
            style={styles.webview}
            startInLoadingState={true}
            scalesPageToFit={true}
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
            javaScriptEnabled={true}
            domStorageEnabled={false}
            allowsInlineMediaPlayback={false}
            mediaPlaybackRequiresUserAction={true}
            scrollEnabled={true}
            bounces={true}
            contentInsetAdjustmentBehavior="automatic"
            renderLoading={() => (
              <View style={styles.webviewLoading}>
                <Text style={styles.loadingIcon}>📄</Text>
                <Text style={styles.webviewLoadingText}>Loading PDF...</Text>
              </View>
            )}
            renderError={() => (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>Unable to load PDF preview</Text>
                <Text style={styles.errorSubtext}>You can still download the report</Text>
              </View>
            )}
          />
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>PDF Report</Text>
            {applicant && (
              <Text style={styles.headerSubtitle}>
                {`${applicant.firstName} ${applicant.lastName}`}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {renderContent()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    gap: 12,
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  webviewLoadingText: {
    fontSize: 14,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  errorDownloadButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorDownloadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
