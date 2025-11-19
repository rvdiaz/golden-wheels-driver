import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { getRentApplications } from '~/custom_modules/tools/api/queries';
import { ScreenRequestForm } from './screenRequestForm';
import { IRentApplication } from '../../interfaces';
import { ScreenRequestItem } from './screenRequestItem';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';
import * as Icons from 'lucide-react-native';
import IconButton from '~/codidge_components/UI/button/IconButton';
import { theme } from '~/theme/theme';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import { TabHeader } from '~/codidge_components/UI/tabs';
import { getRequestStatus } from '../../helpers';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { FloatingMenu } from '~/codidge_components/UI/button/FloatingMenu';

export const ScreenRequestList = ({ onBack }: { onBack: () => void }) => {
  const user = useReactiveVar(userData);
  const [modalVisible, setModalVisible] = useState(false);

  const [screen, setScreen] = useState('inProgress');

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

  if (error) {
    return (
      <PageSafeContainer>
        <Header
          title="Applications"
          showBack={true}
          onBack={() => {
            onBack();
          }}
          rightWidget={
            <IconButton
              onPress={() => {}}
              icon={<Icons.Plus color={theme.colors.primary} size={18} />}
            />
          }
        />
        <View style={styles.errorState}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Unable to load screening requests</Text>
          <Text style={styles.errorSubtitle}>Please check your connection and try again</Text>
        </View>
      </PageSafeContainer>
    );
  }

  const rentApplicationsList = data?.getUserRentApplications?.items ?? [];

  if (!rentApplicationsList || rentApplicationsList.length === 0) {
    return (
      <PageSafeContainer>
        <Header
          title="Applications"
          showBack={true}
          onBack={() => {
            onBack();
          }}
        />
        {loading ? (
          <PageLoading />
        ) : (
          <View style={styles.centerContainer}>
            <OutlineButton
              onPress={() => {
                setModalVisible(true);
              }}
              size={ButtonSize.LARGE}
              title="Screen Tenant"
              leftWidget={<Icons.Plus color={theme.colors.primary} size={20} />}
            />
            <Text style={styles.emptyText}>No screening requests found</Text>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
              }}>
              <View
                style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <ScreenRequestForm
                  disposeModalHandler={() => {
                    setModalVisible(false);
                  }}
                />
              </View>
            </Modal>
          </View>
        )}
      </PageSafeContainer>
    );
  }

  const sortedRentApps = [...rentApplicationsList].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const appsInProgress = sortedRentApps.filter((rent) => {
    const statusInfo = getRequestStatus(rent.applicants);
    return statusInfo.status !== 'Complete';
  });

  const completedApps = sortedRentApps.filter((rent) => {
    const statusInfo = getRequestStatus(rent.applicants);
    return statusInfo.status === 'Complete';
  });

  return (
    <PageSafeContainer
      style={{
        backgroundColor: theme.colors.surfaceSectionsBackgroundColor,
      }}>
      <Header
        title="Applications"
        showBack={true}
        onBack={() => {
          onBack();
        }}
      />
      {loading ? (
        <PageLoading />
      ) : (
        <View style={styles.container}>
          <TabHeader
            containerStyle={{
              paddingHorizontal: 0,
            }}
            tabs={[
              {
                label: 'In Progress',
                key: 'inProgress',
                Icon: Icons.Hourglass,
                indexNumber: appsInProgress.length,
              },
              {
                label: 'Completed',
                key: 'completed',
                Icon: Icons.CheckCircle,
                indexNumber: completedApps.length,
              },
            ]}
            onTabChange={(tabKey) => {
              setScreen(tabKey);
            }}
          />
          <FlatList
            data={screen !== 'completed' ? appsInProgress : completedApps}
            renderItem={({ item }) => <ScreenRequestItem rentApp={item} />}
            keyExtractor={(item) => item.rentApplicationId}
            showsVerticalScrollIndicator={false}
            onRefresh={refetch}
            refreshing={loading}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />} // <-- gap here
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}>
            <View
              style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <ScreenRequestForm
                disposeModalHandler={() => {
                  setModalVisible(false);
                }}
              />
            </View>
          </Modal>
        </View>
      )}
      <FloatingMenu
        title="Screen Tenant"
        icon="Plus"
        onPress={() => {
          setModalVisible(true);
        }}
        style={{ bottom: 30, right: 30 }}
      />
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 4,
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
    marginTop: 16,
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
