import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Home } from 'lucide-react-native';
import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { userData } from '~/store/user';

import Constants from 'expo-constants';
import { CompositeKey, OpenHouseListing } from './interfaces';
import { getOpenHouseListingsQuery } from './graphql/queries';
import { Badge } from './components/badge';
import { OpenHouseListingCard } from './components/openHouseListing';
import {
  createOpenHouseVisitRequestMutation,
  deleteOpenHouseListingMutation,
} from './graphql/mutations';
import { theme } from '~/theme/theme';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const BrowseListingsTab = () => {
  const user = useReactiveVar(userData);

  const [selectedOpenHouse, setSelectedOpenHouse] = useState<OpenHouseListing | null>(null);
  const { data, fetchMore, networkStatus, updateQuery } = useQuery<{
    getOpenHouseListings: { items: OpenHouseListing[]; lastKey?: CompositeKey };
  }>(getOpenHouseListingsQuery, {
    variables: {
      tenant: {
        tenantId,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const loadingInitial = networkStatus === 1 && !data?.getOpenHouseListings.items.length;

  const fetchMoreListings = () => {
    if (data?.getOpenHouseListings.lastKey) {
      fetchMore({
        variables: {
          tenant: {
            tenantId,
          },
          lastKey: data.getOpenHouseListings.lastKey,
        },
        updateQuery(previousQueryResult, { fetchMoreResult }) {
          if (!fetchMoreResult) return previousQueryResult;

          return {
            getOpenHouseListings: {
              items: [
                ...previousQueryResult.getOpenHouseListings.items,
                ...fetchMoreResult.getOpenHouseListings.items,
              ],
              lastKey: fetchMoreResult.getOpenHouseListings.lastKey,
            },
          };
        },
      });
    }
  };

  const [createOpenHouseVisitRequest] = useMutation(createOpenHouseVisitRequestMutation);
  const [deleteListing] = useMutation(deleteOpenHouseListingMutation);

  const openHouseListings = data?.getOpenHouseListings.items || [];
  const [isLoading, setIsLoading] = useState(false);

  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

  const handleRequestBooking = async (
    listing: OpenHouseListing,
    requestedDate: string,
    requestedTime: string,
    requestMessage: string
  ) => {
    setIsLoading(true);
    let hadError = false;
    try {
      await createOpenHouseVisitRequest({
        variables: {
          input: {
            address: listing.address,
            city: listing.city,
            date: requestedDate,
            time: requestedTime,
            mlsListingId: listing.mlsListingId,
            mlsNumber: listing.mlsNumber,
            openHouseListingId: listing.id,
            requesterId: user?.id || '',
            ownerId: listing.ownerId,
            ownerName: listing.mlsAgentFullName,
            requesterName: fullName,
            state: listing.state,
            zipCode: listing.zipCode,
            message: requestMessage,
          },
          tenant: {
            tenantId,
          },
        },
      });
      Alert.alert('Success', 'Your visit request has been sent.');
      setSelectedOpenHouse(null);
    } catch (error) {
      hadError = true;
      console.error('Error creating open house visit request:', error);
      Alert.alert('Error', 'Failed to send visit request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
    return hadError;
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      const deleted = await deleteListing({
        variables: {
          tenant: {
            tenantId,
          },
          id: listingId,
          ownerId: user?.id,
        },
      });

      Alert.alert('Listing deleted successfully.');

      updateQuery((prev) => {
        const updatedItems = prev.getOpenHouseListings.items.filter(
          (item) => item.id !== listingId
        );
        return {
          getOpenHouseListings: {
            items: updatedItems,
            lastKey: prev.getOpenHouseListings.lastKey,
          },
        };
      });

      return !deleted.data?.deleteOpenHouseListing;
    } catch (error) {
      console.error('Error deleting open house listing:', error);
      Alert.alert('Error', 'Failed to delete listing. Please try again later.');
      return true;
    }
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Available Open House Listings</Text>
        <Badge text={`${openHouseListings.length} Properties`} />
      </View>

      {loadingInitial && (
        <View style={styles.emptyState}>
          <ActivityIndicator color="#fff" size="small" />
          <Text style={styles.emptyStateText}>Loading...</Text>
          <Text style={styles.emptyStateSubtext}>Please wait.</Text>
        </View>
      )}

      {!loadingInitial && openHouseListings.length === 0 && (
        <View style={styles.emptyState}>
          <Home color="#9ca3af" size={48} />
          <Text style={styles.emptyStateText}>No open house listings available yet.</Text>
          <Text style={styles.emptyStateSubtext}>Create the first listing to get started.</Text>
        </View>
      )}

      {!!openHouseListings.length &&
        openHouseListings.map((listing) => (
          <OpenHouseListingCard
            key={listing.id}
            listing={listing}
            selected={selectedOpenHouse === listing}
            setSelected={setSelectedOpenHouse}
            onRequestBooking={handleRequestBooking}
            isLoading={isLoading}
            onDeleteListing={handleDeleteListing}
          />
        ))}

      {!!data?.getOpenHouseListings.lastKey && (
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline, styles.mt16]}
          onPress={fetchMoreListings}>
          <Text style={styles.buttonOutlineText}>Load More Listings</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    gap: 16,
    flexDirection: 'column',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonOutlineText: {
    color: theme.colors.primary,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
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
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listingAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  listingMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#6b7280',
  },
  listingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  bookingForm: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
    gap: 16,
  },
  bookingFormTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  mt16: {
    marginTop: 16,
  },
});
