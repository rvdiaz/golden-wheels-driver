import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { IExtendedRenterInput, IRentApplication } from '../../interfaces';
import { theme } from '~/theme/theme';
import { useQuery } from '@apollo/client';
import { getApplicantReportQuery } from '~/custom_modules/tools/api/queries';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import { CompactTabHeader } from '~/codidge_components/UI/tabs';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

interface ReportData {
  renterReportItems: {
    providerName: string;
    reportData: string;
  }[];
  fileUrl: string;
}

interface ApplicantReportsModalProps {
  visible: boolean;
  onClose: () => void;
  applicant: IExtendedRenterInput | null;
  rentApp: IRentApplication;
}

export const ApplicantReportsModal: React.FC<ApplicantReportsModalProps> = ({
  visible,
  onClose,
  applicant,
  rentApp,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const pdfReport = applicant?.reportPdfUrl;

  const {
    data: reportsData,
    loading,
    error,
    refetch,
  } = useQuery<{ getApplicantReport: ReportData }>(getApplicantReportQuery, {
    variables: {
      screeningRequestRenterId: applicant?.screeningRequestRenterId,
      rentApplicationId: rentApp.rentApplicationId,
      aplicantID: applicant?.emailAddress,
    },
    skip: !visible || !applicant?.screeningRequestRenterId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const reports = reportsData?.getApplicantReport.renterReportItems || [];

  // Set default selected provider when reports load
  useEffect(() => {
    if (reports.length > 0 && !selectedProvider) {
      setSelectedProvider(reports[0]?.providerName);
    }
  }, [reports, selectedProvider]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setSelectedProvider(null);
    }
  }, [visible]);

  const selectedReport = reports.find((r) => r.providerName === selectedProvider);

  const getProviderDisplayName = (providerName: string) => {
    const providerMap: { [key: string]: string } = {
      Credit: 'Credit',
      Criminal: 'Criminal',
      Eviction: 'Evictions',
      Employment: 'Employment Verification',
      Income: 'Income Verification',
    };
    return providerMap[providerName] || providerName;
  };

  const getProviderIcon = (providerName: string) => {
    const iconMap: { [key: string]: string } = {
      Credit: '💳',
      Criminal: '⚖️',
      Eviction: '🏠',
      Employment: '💼',
      Income: '💰',
    };
    return iconMap[providerName] || '📄';
  };

  const handleRetry = () => {
    if (refetch) {
      refetch();
    }
  };

  const formatReportForMobile = (htmlContent: string, reportType: string) => {
    if (!htmlContent) return '';

    // Inject mobile CSS

    // Clean up the HTML and inject our styles
    let formattedHTML = htmlContent
      // Remove existing stylesheets
      .replace(/<link[^>]*rel="stylesheet"[^>]*>/gi, '')
      // Remove inline styles that interfere
      .replace(/style="[^"]*"/gi, '')
      // Add our mobile CSS
      .replace(
        /<head[^>]*>/i,
        `<head><meta name="viewport" content="width=device-width, initial-scale=1.0">`
      )
      // If no head tag, add it
      .replace(
        /<body[^>]*>/i,
        `<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>`
      );

    // If still no head tag, wrap everything
    if (!formattedHTML.includes('<head>')) {
      formattedHTML = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${formattedHTML}</body></html>`;
    }

    return formattedHTML;
  };

  const renderContent = () => {
    if (loading) {
      return <PageLoading />;
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{'Failed to fetch reports. Please try again.'}</Text>
          <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (reports.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No reports available</Text>
          <Text style={styles.emptySubtext}>Reports will appear here once they're ready</Text>
        </View>
      );
    }

    // Transform your reports data into the format expected by ScrollableTabHeader
    const tabsData = reports.map((report) => ({
      key: report.providerName,
      label: getProviderDisplayName(report.providerName),
      Icon: () => <Text style={styles.tabIcon}>{getProviderIcon(report.providerName)}</Text>,
      // If you have any indexNumber/badge data, add it here:
      // indexNumber: report.someCount || undefined
    }));

    return (
      <View style={styles.content}>
        {/* Provider Tabs */}
        {reports.length > 1 && (
          <CompactTabHeader
            tabs={tabsData}
            initialTabKey={selectedProvider!}
            onTabChange={(providerName) => setSelectedProvider(providerName)}
            containerStyle={styles.tabsContainer} // Optional: use your existing container style
          />
        )}

        {/* Report Content */}
        {selectedReport && (
          <View style={styles.reportContainer}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>
                {getProviderDisplayName(selectedReport.providerName)}
              </Text>
            </View>

            <WebView
              source={{
                html: formatReportForMobile(selectedReport.reportData, selectedReport.providerName),
              }}
              style={styles.webview}
              scalesPageToFit={false}
              showsVerticalScrollIndicator={true}
              showsHorizontalScrollIndicator={false}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsInlineMediaPlayback={false}
              mediaPlaybackRequiresUserAction={true}
              scrollEnabled={true}
              bounces={true}
              contentInsetAdjustmentBehavior="automatic"
              renderLoading={() => (
                <View style={styles.webviewLoading}>
                  <ActivityIndicator size="small" color={theme.colors?.primary || '#0066CC'} />
                  <Text style={styles.webviewLoadingText}>Loading report...</Text>
                </View>
              )}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
              }}
              injectedJavaScript={`
                // Additional mobile optimizations
                document.addEventListener('DOMContentLoaded', function() {
                  // Prevent zoom on input focus
                  const viewport = document.querySelector('meta[name=viewport]');
                  if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                  }
                  
                  // Smooth scrolling
                  document.body.style.webkitOverflowScrolling = 'touch';
                  
                  // Hide elements that are too small to be useful on mobile
                  const smallElements = document.querySelectorAll('[style*="font-size: 8px"], [style*="font-size: 9px"]');
                  smallElements.forEach(el => {
                    if (el.textContent.trim().length < 3) {
                      el.style.display = 'none';
                    }
                  });
                });
                true;
              `}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <PageSafeContainer style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Screening Reports</Text>
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
      </PageSafeContainer>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#0066CC',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
  content: {
    flex: 1,
  },
  tabsContainer: {
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tabsContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minWidth: 120,
    maxWidth: width * 0.4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeTab: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
    shadowColor: '#0066CC',
    shadowOpacity: 0.2,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666666',
    flex: 1,
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  reportContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  reportHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FAFBFC',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
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
  webviewLoadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666666',
  },
});
