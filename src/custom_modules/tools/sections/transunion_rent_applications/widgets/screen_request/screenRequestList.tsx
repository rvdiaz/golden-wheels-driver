import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { getRentApplications } from '~/custom_modules/tools/api/queries';
import { FloatingMenu } from '~/codidge_components/UI/button/FloatingMenu';
import { ScreenRequestForm } from './screenRequestForm';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import { IRentApplication } from '../../interfaces';
import { ScreenRequestItem } from './screenRequestItem';

export const ScreenRequestList = () => {
  const user = useReactiveVar(userData);
  const [modalVisible, setModalVisible] = useState(false);

  const { loading, error, data, refetch } = useQuery<{
    getUserRentApplications: {
      items: IRentApplication[];
      lastKey: any;
    };
  }>(getRentApplications, {
    variables: {
      userId: user?.id,
    },
  });

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

  const rentApplicationsList = data?.getUserRentApplications?.items ?? [];

  if (!rentApplicationsList || rentApplicationsList.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No screening requests found</Text>
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
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rentApplicationsList}
        renderItem={({ item }) => <ScreenRequestItem rentApp={item} />}
        keyExtractor={(item) => item.rentApplicationId}
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
  address: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
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
});
