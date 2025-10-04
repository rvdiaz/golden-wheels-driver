import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Text from '~/codidge_components/UI/text';
import React, { useState } from 'react';
import { Card } from '~/codidge_components/UI/card';
import { formatTransunionDate, getApplicantStatus, getRequestStatus } from '../../helpers';
import { IExtendedRenterInput, IRentApplication } from '../../interfaces';
import { theme } from '~/theme/theme';
import { PdfReportModal } from './applicantPdfViewer';

export const ScreenRequestItem = ({ rentApp }: { rentApp: IRentApplication }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<IExtendedRenterInput | null>(null);

  const statusInfo = getRequestStatus(rentApp.applicants);
  const hasApplicants = rentApp.applicants.length > 0;

  const handleRequestPress = (item: IRentApplication) => {
    console.log('Navigate to details for:');
    // navigation.navigate('ScreeningRequestDetails', { requestId: item.screeningRequestId });
  };

  const handleApplicantPress = (applicant: IExtendedRenterInput, event: any) => {
    // Stop event propagation to prevent triggering the parent TouchableOpacity
    event.stopPropagation();

    // Only allow press if applicant has submitted (ReportsRequested, Complete, or Approved)
    const canViewReport = ['ReportsRequested', 'completed', 'Approved'].includes(
      applicant.renterStatus
    );

    if (canViewReport) {
      setSelectedApplicant(applicant);
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedApplicant(null);
  };

  return (
    <>
      <TouchableOpacity onPress={() => handleRequestPress(rentApp)} activeOpacity={0.8}>
        <Card style={styles.requestCard}>
          {/* Header with Property Name and Overall Status */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.propertyName} numberOfLines={1}>
                {rentApp.property.propertyName}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.status}
              </Text>
            </View>
          </View>

          {/* Property Address */}
          <View style={styles.addressContainer}>
            <Text style={styles.addressIcon}>📍</Text>
            <Text style={styles.address} numberOfLines={2}>
              {rentApp.property.addressLine1}, {rentApp.property.region},{' '}
              {rentApp.property.postalCode}
            </Text>
          </View>

          {/* Applicants List */}
          {hasApplicants && (
            <View>
              <Text style={styles.applicantsHeader}>Applicants</Text>
              {rentApp.applicants.map((applicant) => {
                const applicantStatus = getApplicantStatus(applicant.renterStatus);
                const canViewReport = !!applicant.reportPdfUrl;
                const IconComponent = applicantStatus.icon;

                return (
                  <TouchableOpacity
                    key={applicant.screeningRequestId}
                    style={[styles.applicantItem, canViewReport && styles.applicantItemPressable]}
                    onPress={(event) => handleApplicantPress(applicant, event)}
                    activeOpacity={canViewReport ? 0.7 : 1}
                    disabled={!canViewReport}>
                    <View style={styles.applicantContent}>
                      <View style={styles.applicantInfo}>
                        <Text style={styles.applicantEmail}>{applicant.emailAddress}</Text>
                      </View>

                      <View style={styles.applicantStatusContainer}>
                        {canViewReport ? (
                          <Text style={styles.viewReportText}>View Report →</Text>
                        ) : (
                          <View
                            style={[
                              styles.applicantStatusBadge,
                              { backgroundColor: applicantStatus.bgColor },
                            ]}>
                            <View style={styles.statusContent}>
                              <IconComponent
                                size={16}
                                color={applicantStatus.color}
                                style={styles.statusIcon}
                              />
                              <Text
                                style={[
                                  styles.applicantStatusText,
                                  { color: applicantStatus.color },
                                ]}>
                                {applicantStatus.status}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Footer with Count and Date/Time */}
          <View style={styles.footer}>
            <View style={styles.footerRight}>
              <Text style={styles.dateText}>{formatTransunionDate(rentApp.createdAt)}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
      {/* Reports Modal */}
      <PdfReportModal
        visible={modalVisible}
        onClose={handleCloseModal}
        applicant={selectedApplicant}
      />
    </>
  );
};

const styles = StyleSheet.create({
  requestCard: {
    marginBottom: 16,
    padding: 16,
    marginHorizontal: 4,
    borderRadius: theme.borderRadius.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    lineHeight: 22,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  addressIcon: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 1,
  },
  address: {
    fontSize: 13,
    color: '#4A4A4A',
    lineHeight: 18,
    flex: 1,
  },
  applicantsHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0066CC',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  applicantItem: {
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  applicantItemPressable: {
    backgroundColor: '#F0F8FF',
    borderColor: '#B3D9FF',
  },
  applicantContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicantInfo: {
    flex: 1,
    marginRight: 12,
  },
  applicantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  applicantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 8,
  },
  applicantEmail: {
    fontSize: 11,
    color: '#666666',
    fontStyle: 'italic',
  },
  applicantStatusContainer: {
    alignItems: 'flex-end',
  },
  applicantStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
    marginBottom: 2,
  },
  applicantStatusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  viewReportText: {
    fontSize: 10,
    color: '#0066CC',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIcon: {
    marginRight: 4,
  },
});
