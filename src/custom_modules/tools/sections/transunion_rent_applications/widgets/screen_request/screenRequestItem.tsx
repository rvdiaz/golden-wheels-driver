import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Text from '~/codidge_components/UI/text';
import React, { useState } from 'react';
import * as Icons from 'lucide-react-native';
import {
  formatAddress,
  formatTransunionDate,
  getApplicantStatus,
  getRequestStatus,
} from '../../helpers';
import { IExtendedRenterInput, IRentApplication } from '../../interfaces';
import { theme } from '~/theme/theme';
import { PdfReportModal } from './applicantPdfViewer';
import { Badge } from '~/codidge_components/UI/badge';
import IconButton from '~/codidge_components/UI/button/IconButton';
import OutlineButton, { ButtonSize } from '~/codidge_components/UI/button/OutlineButton';
import { capitalize } from '~/custom_modules/crm/helpers';
import TextButton from '~/codidge_components/UI/button/TextButton';

export const ScreenRequestItem = ({ rentApp }: { rentApp: IRentApplication }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<IExtendedRenterInput | null>(null);

  const [showApplicants, setShowApplicants] = useState(false);

  const statusInfo = getRequestStatus(rentApp.applicants);
  const hasApplicants = rentApp.applicants.length > 0;

  const { primaryAddress, secondaryAddress } = formatAddress(rentApp.property);

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
      <TouchableOpacity
        onPress={() => {
          setShowApplicants((prev) => !prev);
        }}
        activeOpacity={0.8}>
        <View style={styles.requestCard}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={styles.titleContainer}>
              <Text style={styles.toolTitle}>{primaryAddress}</Text>
              <Text style={styles.toolDescription}>{secondaryAddress}</Text>
            </View>
            <OutlineButton
              title="Applicants"
              size={ButtonSize.SMALL}
              color={theme.colors.info}
              rightWidget={
                showApplicants ? (
                  <Icons.ChevronUp color={theme.colors.info} size={18} />
                ) : (
                  <Icons.ChevronDown color={theme.colors.info} size={18} />
                )
              }
              onPress={() => {
                setShowApplicants((prev) => !prev);
              }}
            />
          </View>

          {/* Applicants List */}
          {showApplicants && hasApplicants && (
            <View
              style={{
                marginTop: 16,
              }}>
              {rentApp.applicants.map((applicant) => {
                const applicantStatus = getApplicantStatus(applicant.renterStatus);
                const canViewReport = !!applicant.reportPdfUrl;
                const IconComponent = applicantStatus.icon;

                if (canViewReport) {
                  return (
                    <TouchableOpacity
                      style={{
                        backgroundColor: theme.colors.baseGray,
                        padding: 20,
                        borderRadius: theme.borderRadius.lg,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}
                      onPress={(event) => handleApplicantPress(applicant, event)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 5,
                        }}>
                        <Icons.Link size={18} color={theme.colors.textColor} />
                        <Text style={[styles.viewReportText, { fontWeight: 700, marginRight: 2 }]}>
                          Report.pdf
                        </Text>
                        <Text style={styles.viewReportText}>
                          {`${applicant.firstName} ${applicant.lastName}`}
                        </Text>
                      </View>
                      <TextButton
                        onPress={() => {
                          const canViewReport = [
                            'ReportsRequested',
                            'completed',
                            'Approved',
                          ].includes(applicant.renterStatus);

                          if (canViewReport) {
                            setSelectedApplicant(applicant);
                            setModalVisible(true);
                          }
                        }}
                        textStyle={{
                          color: theme.colors.info,
                        }}
                        size={ButtonSize.LARGE}
                        title="View"
                      />
                    </TouchableOpacity>
                  );
                }

                return (
                  <TouchableOpacity
                    onPress={(event) => {
                      event.stopPropagation();
                    }}
                    key={applicant.screeningRequestId}
                    style={styles.applicantItem}>
                    <View style={styles.applicantContent}>
                      <View style={styles.applicantInfo}>
                        <Text
                          style={
                            styles.applicantName
                          }>{`${capitalize(applicant.firstName)} ${capitalize(applicant.lastName)}`}</Text>
                      </View>

                      <View style={styles.applicantStatusContainer}>
                        <View
                          style={[
                            styles.applicantStatusBadge,
                            { backgroundColor: applicantStatus.bgColor },
                          ]}>
                          <View style={styles.statusContent}>
                            <Badge
                              displayIcon={false}
                              style={{
                                borderWidth: 0,
                                backgroundColor: applicantStatus.bgColor,
                              }}
                              contentStyle={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 5,
                              }}
                              textStyle={{
                                color: applicantStatus.color,
                              }}>
                              {applicantStatus.status}
                            </Badge>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.footer,
                        {
                          marginTop: 8,
                        },
                      ]}>
                      <View style={styles.applicantInfo}>
                        <Text style={styles.applicantEmail}>{applicant.emailAddress}</Text>
                      </View>
                      <Text style={styles.dateText}>{formatTransunionDate(rentApp.createdAt)}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Footer with Count and Date/Time */}
          <View style={styles.footer}>
            <Badge
              displayIcon={false}
              style={{
                borderWidth: 0,
                backgroundColor: statusInfo.bgColor,
              }}
              textStyle={{
                color: statusInfo.color,
              }}>
              {statusInfo.status}
            </Badge>
            <View>
              <Text style={styles.dateText}>{formatTransunionDate(rentApp.createdAt)}</Text>
            </View>
          </View>
        </View>
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
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    backgroundColor: '#FFF',
  },
  titleContainer: {
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 6,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1B4B',
  },
  toolDescription: {
    fontSize: 14,
    color: '#737373',
  },
  applicantItem: {
    marginBottom: 8,
    padding: 10,
    borderRadius: theme.borderRadius.lg,
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
  footerInfo: {
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
    fontSize: 12,
    color: '#737373',
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
    fontSize: 14,
    color: theme.colors.textColor,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#737373',
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
