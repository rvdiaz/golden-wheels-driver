import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Plus, MapPin, FileText, Users, ChevronDown } from 'lucide-react-native';
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

  const [zipCode, setZipCode] = useState(user?.address?.postalCode || '');

  const { data, loading: isLoadingListings } = useQuery<{
    getMlsListing: {
      listings: IMlsListingItemResponse[];
      indexCount: number;
    };
  }>(getMlsListingQuery, {
    variables: {
      input: {
        zipCode,
        pageSize: 100,
        indexCount: 0,
        daysOld: 9999,
        status: 'active',
        agentMlsCode: user?.mlsNumber,
      },
    },
    skip: !zipCode || zipCode.length < 5 || !user?.mlsNumber,
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
      console.log(selectedOpenHouse.mlsLastStatusDate);
      console.log(mlsDateStringToDate(selectedOpenHouse.mlsLastStatusDate));

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
          <Text style={styles.label}>Listing Zip Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the zip code to fetch listings"
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="number-pad"
            placeholderTextColor="#9ca3af"
          />
        </View>
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
            animationType="fade"
            onRequestClose={() => setShowDropdown(false)}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowDropdown(false)}>
              <View style={styles.dropdownMenu}>
                <ScrollView style={styles.dropdownScroll}>
                  {!data?.getMlsListing?.listings.length && (
                    <Text style={styles.noResultsText}>No listings found</Text>
                  )}
                  {data?.getMlsListing?.listings.map((listing) => (
                    <TouchableOpacity
                      key={listing.id}
                      style={styles.dropdownItem}
                      onPress={() => handleSelectOpenHouse(listing)}>
                      <Text style={styles.dropdownItemText}>{listing.address.address}</Text>
                      <Text style={styles.dropdownItemSubtext}>{listing.mlsNumber}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        {selectedOpenHouse && (
          <View style={styles.selectedPropertyCard}>
            <View style={styles.listingHeader}>
              <View style={styles.flex1}>
                <View style={styles.row}>
                  <MapPin color="#6b7280" size={16} />
                  <Text style={styles.listingAddress}>{selectedOpenHouse.address.address}</Text>
                </View>
                <View style={styles.listingMeta}>
                  <View style={styles.row}>
                    <FileText color="#6b7280" size={14} />
                    <Text style={styles.metaText}>{selectedOpenHouse.mlsNumber}</Text>
                  </View>
                  <View style={styles.row}>
                    <Users color="#6b7280" size={14} />
                    <Text style={styles.metaText}>{user?.firstName + ' ' + user?.lastName}</Text>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    maxWidth: 500,
    maxHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownScroll: {
    maxHeight: 400,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    marginBottom: 4,
  },
  dropdownItemSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
  selectedPropertyCard: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 8,
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
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 13,
    color: '#6b7280',
  },
  listingDescription: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
  },
  badge: {
    backgroundColor: '#dbeafe',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
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
  buttonDisabled: {
    backgroundColor: '#d1d5db',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noResultsText: {
    padding: 16,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
