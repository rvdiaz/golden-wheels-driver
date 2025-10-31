import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import {
  Plus,
  MapPin,
  FileText,
  Users,
  ChevronDown,
  Home,
  Bed,
  Bath,
  Calendar,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import Text from '~/codidge_components/UI/text';
import { getMlsListingQuery } from '../mls_listing/graphql/queries';
import { userData } from '~/store/user';
import { IMlsListingItemResponse } from '../mls_listing/interfaces';
import { createOpenHouseListingMutation } from './graphql/mutations';

import Constants from 'expo-constants';
import { theme } from '~/theme/theme';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

const mlsDateStringToDate = (dateString: string) => {
  const parts = dateString.split(' ');
  if (parts.length !== 3 || parts.at(-1) !== 'UTC') return null;
  const [date, time] = parts;
  return new Date(`${date}T${time}.000Z`);
};

export const CreateListingTab = () => {
  const user = useReactiveVar(userData);

  const [selectedOpenHouse, setSelectedOpenHouse] = useState<IMlsListingItemResponse | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data, loading: isLoadingListings } = useQuery<{
    getMlsListing: {
      listings: IMlsListingItemResponse[];
      indexCount: number;
    };
  }>(getMlsListingQuery, {
    variables: {
      input: {
        pageSize: 100,
        indexCount: 0,
        daysOld: 9999,
        status: 'active',
        agentMlsCode: user?.mlsNumber,
      },
    },
    skip: !user?.mlsNumber,
  });

  const userFullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

  const [createOpenHouseListing] = useMutation(createOpenHouseListingMutation);

  const handleSelectOpenHouse = (listing: IMlsListingItemResponse) => {
    setSelectedOpenHouse(listing);
    setShowDropdown(false);
  };

  const handleCreateOpenHouse = async () => {
    if (!selectedOpenHouse) return;

    setIsLoading(true);
    try {
      const response = await createOpenHouseListing({
        variables: {
          tenant: { tenantId },
          input: {
            description: description || '',
            bathrooms: selectedOpenHouse.bathrooms,
            bedrooms: selectedOpenHouse.bedrooms,
            address: selectedOpenHouse.address.address,
            city: selectedOpenHouse.address.city,
            state: selectedOpenHouse.address.state,
            imageUrl: selectedOpenHouse.imageUrl || '',
            mlsAgentEmail: user?.email || selectedOpenHouse.mlsAgent.email,
            mlsAgentFullName: userFullName || selectedOpenHouse.mlsAgent.fullName,
            mlsLastStatusDate: mlsDateStringToDate(selectedOpenHouse.mlsLastStatusDate),
            mlsListingId: selectedOpenHouse.listingId,
            mlsListingPrice: selectedOpenHouse.mlsListingPrice,
            mlsNumber: selectedOpenHouse.mlsNumber,
            ownerId: user?.id,
            yearBuilt: selectedOpenHouse.yearBuilt,
            zipCode: selectedOpenHouse.address.zip,
          },
        },
      });

      Alert.alert('Open house listing created successfully.');

      // Reset form
      setSelectedOpenHouse(null);
      setDescription('');
    } catch (error) {
      console.error('Error creating open house:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBadge = (text: string) => (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Plus color={theme.colors.primary} size={20} />
        <Text style={styles.cardTitle}>Create Open House Listing</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Open House Property</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowDropdown(!showDropdown)}>
            {(data?.getMlsListing?.listings.length && (
              <Text style={styles.dropdownText}>
                {selectedOpenHouse ? selectedOpenHouse.address.address : 'Choose a property...'}
              </Text>
            )) || (
              <Text style={styles.dropdownText}>
                {isLoadingListings ? 'Loading listings...' : 'No listings found'}
              </Text>
            )}
            <ChevronDown color="#6b7280" size={20} />
          </TouchableOpacity>

          <Modal
            visible={showDropdown}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDropdown(false)}>
            <PageSafeContainer>
              <Header
                title="Select Property"
                showBack={true}
                onBack={() => {
                  setShowDropdown(false);
                }}
              />
              <View style={styles.modalContainer}>
                <ScrollView style={styles.propertyList}>
                  {!data?.getMlsListing?.listings.length && (
                    <Text style={styles.noResultsText}>No listings found</Text>
                  )}
                  {data?.getMlsListing?.listings.map((listing) => (
                    <TouchableOpacity
                      key={listing.id}
                      style={styles.propertyCard}
                      onPress={() => handleSelectOpenHouse(listing)}>
                      <View style={styles.propertyCardContent}>
                        {listing.imageUrl ? (
                          <Image
                            source={{ uri: listing.imageUrl }}
                            style={styles.propertyImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={[styles.propertyImage, styles.placeholderImage]}>
                            <Home color="#9ca3af" size={32} />
                          </View>
                        )}

                        <View style={styles.propertyInfo}>
                          <View style={styles.propertyHeader}>
                            <Text style={styles.propertyPrice}>
                              ${listing.mlsListingPrice.toLocaleString()}
                            </Text>
                            <View style={styles.mlsBadge}>
                              <Text style={styles.mlsBadgeText}>{listing.mlsNumber}</Text>
                            </View>
                          </View>

                          <Text style={styles.propertyAddress}>{listing.address.address}</Text>
                          <Text style={styles.propertyLocation}>
                            {listing.address.city}, {listing.address.state} {listing.address.zip}
                          </Text>

                          {listing?.bedrooms && listing?.bathrooms && listing?.yearBuilt ? (
                            <View style={styles.propertyStats}>
                              {listing?.bedrooms && (
                                <View style={styles.stat}>
                                  <Bed color="#6b7280" size={14} />
                                  <Text style={styles.statText}>{listing.bedrooms} beds</Text>
                                </View>
                              )}
                              {listing?.bathrooms && (
                                <View style={styles.stat}>
                                  <Bath color="#6b7280" size={14} />
                                  <Text style={styles.statText}>{listing?.bathrooms} baths</Text>
                                </View>
                              )}
                              {listing?.yearBuilt && (
                                <View style={styles.stat}>
                                  <Calendar color="#6b7280" size={14} />
                                  <Text style={styles.statText}>{listing.yearBuilt}</Text>
                                </View>
                              )}
                            </View>
                          ) : (
                            <Text></Text>
                          )}

                          {listing?.mlsDaysOnMarket && (
                            <Text style={styles.daysOnMarket}>
                              {listing.mlsDaysOnMarket} days on market
                            </Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </PageSafeContainer>
          </Modal>
        </View>

        {selectedOpenHouse && (
          <View style={styles.selectedPropertyCard}>
            <View style={styles.selectedPropertyContent}>
              {selectedOpenHouse.imageUrl ? (
                <Image
                  source={{ uri: selectedOpenHouse.imageUrl }}
                  style={styles.selectedPropertyImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.selectedPropertyImage, styles.placeholderImage]}>
                  <Home color="#9ca3af" size={24} />
                </View>
              )}

              <View style={styles.selectedPropertyDetails}>
                <View style={styles.listingHeader}>
                  <View style={styles.flex1}>
                    <Text style={styles.selectedPrice}>
                      ${selectedOpenHouse.mlsListingPrice.toLocaleString()}
                    </Text>
                    <View style={styles.row}>
                      <MapPin color="#6b7280" size={16} />
                      <Text style={styles.listingAddress}>{selectedOpenHouse.address.address}</Text>
                    </View>
                    <Text style={styles.selectedLocation}>
                      {selectedOpenHouse.address.city}, {selectedOpenHouse.address.state}{' '}
                      {selectedOpenHouse.address.zip}
                    </Text>
                    <View style={styles.listingMeta}>
                      <View style={styles.row}>
                        <FileText color="#6b7280" size={14} />
                        <Text style={styles.metaText}>MLS #{selectedOpenHouse.mlsNumber}</Text>
                      </View>
                      <View style={styles.row}>
                        <Users color="#6b7280" size={14} />
                        <Text style={styles.metaText}>{userFullName}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {renderBadge('Selected')}
            </View>
          </View>
        )}

        {selectedOpenHouse && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Property Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Brief description of the property and any special features..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9ca3af"
            />
          </View>
        )}

        <PrimaryButton
          disabled={!selectedOpenHouse || isLoading}
          size={ButtonSize.LARGE}
          onPress={handleCreateOpenHouse}
          title={isLoading ? 'Creating...' : 'Create Open House Listing'}
          leftWidget={
            isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Plus color="#fff" size={16} />
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  propertyList: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  propertyCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  propertyCardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  propertyImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  propertyInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  mlsBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mlsBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  propertyAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  propertyLocation: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  propertyStats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
  },
  daysOnMarket: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
    marginTop: 4,
  },
  selectedPropertyCard: {
    backgroundColor: '#f0f9ff',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  selectedPropertyContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },
  selectedPropertyImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  selectedPropertyDetails: {
    flex: 1,
  },
  selectedPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  selectedLocation: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
    marginBottom: 8,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  listingAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  listingMeta: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  badge: {
    backgroundColor: theme.colors.primary + '20',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
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
  noResultsText: {
    padding: 32,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
