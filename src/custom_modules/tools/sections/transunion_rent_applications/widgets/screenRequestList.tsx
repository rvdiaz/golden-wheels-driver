import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { getScreenRequestQuery } from '~/custom_modules/tools/api/queries';
import { IScreeningRequest } from '../interfaces';
import { Card } from '~/codidge_components/UI/card';
import { FloatingMenu } from '~/codidge_components/UI/button/FloatingMenu';
import { ScreenRequestForm } from './screenRequestForm';
import { formatTransunionDate, getRequestStatus } from '../helpers';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';

export const ScreenRequestList = () => {
  const user = useReactiveVar(userData);
  const [modalVisible, setModalVisible] = useState(false);

  const { loading, error, data, refetch } = useQuery(getScreenRequestQuery, {
    variables: { userId: user?.id },
  });

  const handleRequestPress = (item: IScreeningRequest) => {
    // Navigate to details screen
    console.log('Navigate to details for:', item.screeningRequestId);
    // navigation.navigate('ScreeningRequestDetails', { requestId: item.screeningRequestId });
  };

  const renderScreeningRequest = ({ item }: { item: IScreeningRequest }) => {
    const statusInfo = getRequestStatus(item.screeningRequestRenters);
    const hasApplicants = item.screeningRequestRenters.length > 0;
    const firstApplicant = hasApplicants ? item.screeningRequestRenters[0] : null;

    return (
      <TouchableOpacity onPress={() => handleRequestPress(item)} activeOpacity={0.7}>
        <Card style={styles.requestCard}>
          <View style={styles.header}>
            <Text style={styles.propertyName} numberOfLines={1}>
              {item.propertyName}
            </Text>
            <View style={styles.headerRight}>
              <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
                <Text style={[styles.statusText, { color: statusInfo.color }]}>
                  {statusInfo.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Conditional display based on applicants */}
          {hasApplicants ? (
            <Text style={styles.applicantInfo} numberOfLines={1}>
              {`${firstApplicant?.renterFirstName} ${firstApplicant?.renterLastName}`}
              {firstApplicant?.renterRole && ` (${firstApplicant.renterRole})`}
            </Text>
          ) : (
            <Text style={styles.address} numberOfLines={1}>
              {item.propertySummaryAddress}
            </Text>
          )}

          {/* Always show address as secondary info if we're showing applicant name */}
          {hasApplicants && (
            <Text style={styles.secondaryInfo} numberOfLines={1}>
              {item.propertySummaryAddress}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.leftFooter}>
              <Text style={styles.applicantCount}>
                {item.screeningRequestRenters.length} applicant
              </Text>
            </View>
            <Text style={styles.dateInfo}>Submitted {formatTransunionDate(item.createdOn)}</Text>
          </View>
          <Text style={styles.tapHint}>Tap for details →</Text>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return (
      <View style={styles.errorState}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Unable to load screening requests</Text>
        <Text style={styles.errorSubtitle}>Please check your connection and try again</Text>
      </View>
    );
  }

  if (!data?.getScreeningRequest || data.getScreeningRequest.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No screening requests found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data.getScreeningRequest}
        renderItem={renderScreeningRequest}
        keyExtractor={(item) => item.screeningRequestId.toString()}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={loading}
        contentContainerStyle={styles.listContainer}
      />
      <FloatingMenu
        title="Screen Tenant"
        icon="Plus"
        onPress={() => {
          setModalVisible(true);
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ScreenRequestForm
            disposeModalHandler={() => {
              setModalVisible(false);
            }}
            onAddScreenView={() => {
              refetch();
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  requestCard: {
    marginBottom: 12,
    padding: 16,
    marginHorizontal: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  propertyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  address: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  applicantCount: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  tapHint: {
    fontSize: 12,
    color: '#0066cc',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  errorState: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 64,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc3545',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  applicantInfo: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  secondaryInfo: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  leftFooter: {
    flex: 1,
  },
  dateInfo: {
    fontSize: 12,
    color: '#999',
  },
});
