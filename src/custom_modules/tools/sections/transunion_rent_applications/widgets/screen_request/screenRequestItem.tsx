import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Card } from '~/codidge_components/UI/card';
import { formatTransunionDate, getApplicantStatus, getRequestStatus } from '../../helpers';
import { IScreeningRequest, IScreeningRequestRenter } from '../../interfaces';
import { theme } from '~/theme/theme';
import { ApplicantReportsModal } from './applicantModal';

interface ReportData {
  providerName: string;
  reportData: string;
}

interface ScreenRequestItemProps {
  item: IScreeningRequest;
}

export const ScreenRequestItem: React.FC<ScreenRequestItemProps> = ({ item }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<IScreeningRequestRenter | null>(null);

  const statusInfo = getRequestStatus(item.screeningRequestRenters);
  const hasApplicants = item.screeningRequestRenters.length > 0;

  // Format creation time to show hour
  const formatCreationTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Generate mock email for demonstration (you'd get this from your API)
  const getApplicantEmail = (firstName: string, lastName: string) => {
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
  };

  const handleRequestPress = (item: IScreeningRequest) => {
    console.log('Navigate to details for:', item.screeningRequestId);
    // navigation.navigate('ScreeningRequestDetails', { requestId: item.screeningRequestId });
  };

  const handleApplicantPress = (applicant: IScreeningRequestRenter, event: any) => {
    // Stop event propagation to prevent triggering the parent TouchableOpacity
    event.stopPropagation();

    // Only allow press if applicant has submitted (ReportsRequested, Complete, or Approved)
    const canViewReport = ['ReportsRequested', 'Complete', 'Approved'].includes(
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
      <TouchableOpacity onPress={() => handleRequestPress(item)} activeOpacity={0.8}>
        <Card style={styles.requestCard}>
          {/* Header with Property Name and Overall Status */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.propertyName} numberOfLines={1}>
                {item.propertyName}
              </Text>
              <Text style={styles.requestId}>ID: #{item.screeningRequestId}</Text>
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
              {item.propertySummaryAddress}
            </Text>
          </View>

          {/* Applicants List */}
          {hasApplicants && (
            <View>
              <Text style={styles.applicantsHeader}>Applicants</Text>
              {item.screeningRequestRenters.map((applicant, index) => {
                const applicantStatus = getApplicantStatus(applicant.renterStatus);
                const canViewReport = ['ReportsRequested', 'Complete', 'Approved'].includes(
                  applicant.renterStatus
                );

                return (
                  <TouchableOpacity
                    key={applicant.screeningRequestRenterId}
                    style={[styles.applicantItem, canViewReport && styles.applicantItemPressable]}
                    onPress={(event) => handleApplicantPress(applicant, event)}
                    activeOpacity={canViewReport ? 0.7 : 1}
                    disabled={!canViewReport}>
                    <View style={styles.applicantContent}>
                      <View style={styles.applicantInfo}>
                        <View style={styles.applicantHeader}>
                          <Text style={styles.applicantName}>
                            {`${applicant.renterFirstName} ${applicant.renterLastName}`}
                          </Text>
                        </View>
                        <Text style={styles.applicantEmail}>
                          {getApplicantEmail(applicant.renterFirstName, applicant.renterLastName)}
                        </Text>
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
                            <Text
                              style={[
                                styles.applicantStatusText,
                                { color: applicantStatus.color },
                              ]}>
                              {applicantStatus.status}
                            </Text>
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
              <Text style={styles.dateText}>{formatTransunionDate(item.createdOn)}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>

      {/* Reports Modal */}
      <ApplicantReportsModal
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
  requestId: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    letterSpacing: 0.3,
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
});
