import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { userData } from '~/store/user';

import Constants from 'expo-constants';
import { CompositeKey, OpenHouseVisitRequest, OpenHouseVisitRequestStatus } from '../interfaces';
import { Badge } from './badge';

import { getOpenHouseVisitRequestsQuery } from '../graphql/queries';
import { deleteOpenHouseVisitRequestMutation } from '../graphql/mutations';
import { theme } from '~/theme/theme';
import { Calendar, Send, XCircle } from 'lucide-react-native';
import { LoadingSpinner } from '~/codidge_components/UI/loading/loadingSpinner';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const MyBookings = () => {
  const user = useReactiveVar(userData);

  const [deleteBooking] = useMutation(deleteOpenHouseVisitRequestMutation);
  const { data, fetchMore, networkStatus, updateQuery } = useQuery<{
    getOpenHouseVisitRequests: { items: OpenHouseVisitRequest[]; lastKey?: CompositeKey };
  }>(getOpenHouseVisitRequestsQuery, {
    variables: {
      tenant: {
        tenantId,
      },
      requesterId: user?.id,
    },
    fetchPolicy: 'cache-and-network',
  });

  const loadingInitial = networkStatus === 1 && !data?.getOpenHouseVisitRequests.items.length;
  const myBookings = data?.getOpenHouseVisitRequests.items || [];
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);

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

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteBooking({
        variables: {
          id,
          tenant: {
            tenantId,
          },
          requesterId: user?.id,
        },
      });

      setConfirmingDelete(false);

      updateQuery((prev) => {
        return {
          getOpenHouseVisitRequests: {
            items: prev.getOpenHouseVisitRequests.items.filter((booking) => booking.id !== id),
            lastKey: prev.getOpenHouseVisitRequests.lastKey,
          },
        };
      });

      Alert.alert('Success', 'Booking request deleted successfully.');
    } catch (error) {
      console.error('Error deleting booking:', error);
      Alert.alert('Error', 'Failed to delete booking request. Please try again later.');
    }
    setIsLoading(false);
  };

  if (loadingInitial) {
    return (
      <View style={[styles.card, styles.mt16]}>
        <View style={styles.cardHeader}>
          <Send color={theme.colors.primary} size={20} />
          <Text style={styles.cardTitle}>My Requests</Text>
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
    <View style={[styles.card, styles.mt16]}>
      <View style={styles.cardHeader}>
        <Send color={theme.colors.primary} size={20} />
        <Text style={styles.cardTitle}>My Requests</Text>
      </View>
      <View style={styles.cardContent}>
        {myBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar color="#9ca3af" size={48} />
            <Text style={styles.emptyStateText}>
              You haven&apos;t made any open house visit requests yet.
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Browse available listings to request time slots.
            </Text>
          </View>
        ) : (
          myBookings.map((booking) => (
            <View key={booking.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View>
                  <Text style={styles.requestAddress}>{booking.address}</Text>
                  <Text style={styles.requestMeta}>Property owner: {booking.ownerName}</Text>
                  <Text style={styles.requestMeta}>
                    Requested: {new Date(booking.date).toLocaleDateString()} at {booking.time}
                  </Text>
                </View>
                <View>
                  <Badge
                    text={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    variant={
                      booking.status === OpenHouseVisitRequestStatus.APPROVED
                        ? 'success'
                        : booking.status === OpenHouseVisitRequestStatus.REJECTED
                          ? 'danger'
                          : 'warning'
                    }
                  />
                </View>
              </View>
              {!!booking.message && (
                <View style={styles.messageBox}>
                  <Text style={styles.messageText}>
                    <Text style={styles.bold}>Your message:</Text> {booking.message}
                  </Text>
                </View>
              )}
              {!!booking.response && (
                <View style={styles.responseBox}>
                  <Text style={styles.responseText}>
                    <Text style={styles.bold}>Response:</Text> {booking.response}
                  </Text>
                </View>
              )}
              {!confirmingDelete && booking.status === OpenHouseVisitRequestStatus.PENDING && (
                <TouchableOpacity
                  style={[styles.button, styles.buttonDanger, styles.buttonFlex]}
                  onPress={() => setConfirmingDelete(true)}
                  disabled={isLoading}>
                  <XCircle color="#fff" size={16} />
                  <Text style={styles.buttonText}>Delete Request</Text>
                </TouchableOpacity>
              )}
              {!!confirmingDelete && (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonDanger, styles.buttonFlex]}
                    onPress={() => handleDelete(booking.id)}
                    disabled={isLoading}>
                    <XCircle color="#fff" size={16} />
                    <Text style={styles.buttonText}>Confirm Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonOutline, styles.buttonFlex]}
                    onPress={() => setConfirmingDelete(false)}
                    disabled={isLoading}>
                    <Text style={styles.buttonOutlineText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </View>
      {!!data?.getOpenHouseVisitRequests.lastKey && (
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline, styles.mt16]}
          onPress={fetchMoreResult}>
          <Text style={styles.buttonOutlineText}>Load More Listings</Text>
        </TouchableOpacity>
      )}
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
