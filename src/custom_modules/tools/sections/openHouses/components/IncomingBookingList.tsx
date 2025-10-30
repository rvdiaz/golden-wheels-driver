import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { userData } from '~/store/user';

import Constants from 'expo-constants';
import { CompositeKey, OpenHouseVisitRequest, OpenHouseVisitRequestStatus } from '../interfaces';
import { Badge } from './badge';

import { getOpenHouseVisitRequestsQuery } from '../graphql/queries';
import { updateOpenHouseVisitRequestStatusMutation } from '../graphql/mutations';
import { theme } from '~/theme/theme';
import { Eye, Send } from 'lucide-react-native';
import { LoadingSpinner } from '~/codidge_components/UI/loading/loadingSpinner';
import { IncomingBooking } from './IncomingBooking';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const IncomingBookingList = () => {
  const user = useReactiveVar(userData);

  const [updateStatus] = useMutation(updateOpenHouseVisitRequestStatusMutation);
  const { data, fetchMore, networkStatus, updateQuery } = useQuery<{
    getOpenHouseVisitRequests: { items: OpenHouseVisitRequest[]; lastKey?: CompositeKey };
  }>(getOpenHouseVisitRequestsQuery, {
    variables: {
      tenant: {
        tenantId,
      },
      ownerId: user?.id,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const loadingInitial = networkStatus === 1 && !data?.getOpenHouseVisitRequests.items.length;
  const incomingRequests = data?.getOpenHouseVisitRequests.items || [];

  const fetchMoreResult = () => {
    if (data?.getOpenHouseVisitRequests.lastKey) {
      fetchMore({
        variables: {
          tenant: {
            tenantId,
          },
          requesterId: user?.id,
          lastKey: data.getOpenHouseVisitRequests.lastKey,
        },
        updateQuery(previousQueryResult, { fetchMoreResult }) {
          if (!fetchMoreResult) return previousQueryResult;

          return {
            getOpenHouseVisitRequests: {
              items: [
                ...previousQueryResult.getOpenHouseVisitRequests.items,
                ...fetchMoreResult.getOpenHouseVisitRequests.items,
              ],
              lastKey: fetchMoreResult.getOpenHouseVisitRequests.lastKey,
            },
          };
        },
      });
    }
  };

  const handleBookingResponse = async (
    bookingId: string,
    status: OpenHouseVisitRequestStatus,
    response: string
  ) => {
    try {
      const updated = await updateStatus({
        variables: {
          tenant: {
            tenantId,
          },
          id: bookingId,
          status,
          response,
          userId: user?.id,
        },
      });

      updateQuery((prev) => {
        const updatedRequest = updated.data.updateOpenHouseVisitRequest;
        const updatedItems = prev.getOpenHouseVisitRequests.items.map((item) =>
          item.id === updatedRequest.id ? updatedRequest : item
        );
        return {
          getOpenHouseVisitRequests: {
            items: updatedItems,
            lastKey: prev.getOpenHouseVisitRequests.lastKey,
          },
        };
      });

      setSelectedBookingId(null);

      return false;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return true;
    }
  };

  if (loadingInitial) {
    return (
      <View style={[styles.card, styles.mt16]}>
        <View style={styles.cardHeader}>
          <Send color={theme.colors.primary} size={20} />
          <Text style={styles.cardTitle}>Incoming Requests</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.emptyState}>
            <LoadingSpinner color="#fff" />
            <Text style={styles.emptyStateText}>Loading...</Text>
            <Text style={styles.emptyStateSubtext}>Please wait.</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Eye color={theme.colors.primary} size={20} />
        <Text style={styles.cardTitle}>Incoming Requests</Text>
        <View>
          <Badge
            text={`${incomingRequests.filter((r) => r.status === OpenHouseVisitRequestStatus.PENDING).length} Pending`}
            variant="warning"
          />
        </View>
      </View>
      <View style={styles.cardContent}>
        {incomingRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Eye color="#9ca3af" size={48} />
            <Text style={styles.emptyStateText}>No incoming requests yet.</Text>
            <Text style={styles.emptyStateSubtext}>
              Requests from other agents will appear here.
            </Text>
          </View>
        ) : (
          incomingRequests.map((request) => (
            <IncomingBooking
              key={request.id}
              request={request}
              handleBookingResponse={handleBookingResponse}
              selected={selectedBookingId === request.id}
              setSelected={setSelectedBookingId}
            />
          ))
        )}
        {!!data?.getOpenHouseVisitRequests.lastKey && (
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline, styles.mt16]}
            onPress={fetchMoreResult}>
            <Text style={styles.buttonOutlineText}>Load More Listings</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  cardContent: {
    padding: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonSuccess: {
    backgroundColor: '#16a34a',
  },
  buttonDanger: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonFlex: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  mt16: {
    marginTop: 16,
  },
  requestCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  requestAddress: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  requestMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  requestMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  messageBox: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 13,
    color: '#4b5563',
  },
  responseBox: {
    backgroundColor: '#f5f3ff',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
  },
  responseText: {
    fontSize: 13,
    color: '#5b21b6',
  },
  bold: {
    fontWeight: '600',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  buttonOutlineText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
