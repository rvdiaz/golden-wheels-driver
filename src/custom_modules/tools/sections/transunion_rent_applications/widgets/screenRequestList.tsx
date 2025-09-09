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

  const renderScreeningRequest = ({ item }: { item: IScreeningRequest }) => (
    <TouchableOpacity onPress={() => handleRequestPress(item)} activeOpacity={0.7}>
      <Card style={styles.requestCard}>
        <View style={styles.header}>
          <Text style={styles.propertyName} numberOfLines={1}>
            {item.propertyName}
          </Text>
          <Text style={styles.requestId}>#{item.screeningRequestId}</Text>
        </View>

        <Text style={styles.address} numberOfLines={1}>
          {item.propertySummaryAddress}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.applicantCount}>
            {item.screeningRequestRenters.length} applicant
            {item.screeningRequestRenters.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.tapHint}>Tap for details →</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading screening requests...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading data: {error.message}</Text>
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  requestId: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    fontWeight: '500',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
});
