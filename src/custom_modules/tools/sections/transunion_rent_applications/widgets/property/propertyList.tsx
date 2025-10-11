import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, Modal } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { getTransunionPropertyQuery } from '~/custom_modules/tools/api/queries';
import { ITransUnionProperty } from '../../interfaces';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { Search } from 'lucide-react-native';
import { FloatingMenu } from '~/codidge_components/UI/button/FloatingMenu';
import { PropertyForm } from './propertyForm';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';

export const TransUnionPropertyList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const user = useReactiveVar(userData);

  const { data, loading, error, refetch } = useQuery(getTransunionPropertyQuery, {
    variables: { userId: user?.id },
    errorPolicy: 'all',
    onError: (error) => {
      Alert.alert('Error', 'Failed to load properties. Please try again.');
      console.error('GraphQL Error:', error);
    },
  });

  // Filter properties based on search term
  const filteredProperties = useMemo(() => {
    if (!data?.getTransunionProperties) return [];

    const properties = Array.isArray(data.getTransunionProperties)
      ? data.getTransunionProperties
      : [data.getTransunionProperties];

    if (!searchTerm.trim()) return properties;

    return properties.filter((property: ITransUnionProperty) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        property.addressLine1?.toLowerCase().includes(searchLower) ||
        property.locality?.toLowerCase().includes(searchLower) ||
        property.region?.toLowerCase().includes(searchLower) ||
        property.postalCode?.toLowerCase().includes(searchLower)
      );
    });
  }, [data?.getTransunionProperties, searchTerm]);

  const formatAddress = (property: ITransUnionProperty) => {
    const addressParts = [
      property.addressLine1,
      property.addressLine2,
      property.addressLine3,
      property.addressLine4,
    ].filter(Boolean);

    const primaryAddress = addressParts.join(', ');
    const secondaryAddress = [property.locality, property.region, property.postalCode]
      .filter(Boolean)
      .join(', ');

    return { primaryAddress, secondaryAddress };
  };

  const renderPropertyItem = ({ item }: { item: ITransUnionProperty }) => {
    const { primaryAddress, secondaryAddress } = formatAddress(item);

    return (
      <View style={styles.propertyCard}>
        {/* Property Header */}
        <View style={styles.propertyHeader}>
          <View style={styles.propertyTitle}>
            <View
              style={[
                styles.statusBadge,
                item.isActive ? styles.activeBadge : styles.inactiveBadge,
              ]}>
              <Text
                style={[
                  styles.statusText,
                  item.isActive ? styles.activeText : styles.inactiveText,
                ]}>
                {item.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.addressSection}>
          <View style={styles.addressIcon}>
            <Text style={styles.addressIconText}>📍</Text>
          </View>
          <View style={styles.addressContent}>
            <Text style={styles.primaryAddress} numberOfLines={2}>
              {primaryAddress || 'Address not available'}
            </Text>
            {secondaryAddress && (
              <Text style={styles.secondaryAddress} numberOfLines={1}>
                {secondaryAddress}
              </Text>
            )}
            {item.country ? <Text style={styles.country}>{item.country}</Text> : <></>}
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🏠</Text>
      <Text style={styles.emptyStateTitle}>
        {searchTerm ? 'No properties found' : 'No properties available'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchTerm
          ? `No properties match "${searchTerm}"`
          : 'Properties will appear here once they are added'}
      </Text>
    </View>
  );

  const renderLoadingState = () => <PageLoading />;

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Unable to load properties</Text>
      <Text style={styles.errorSubtitle}>Please check your connection and try again</Text>
    </View>
  );

  if (loading) return renderLoadingState();
  if (error) return renderErrorState();

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <InputField
          placeholder="Search properties by name or address"
          value={searchTerm}
          onChangeText={setSearchTerm}
          leftIcon={<Search size={16} />}
          label="Search Properties"
        />
      </View>

      {/* Properties List */}
      <FlatList
        data={filteredProperties}
        renderItem={renderPropertyItem}
        keyExtractor={(item, index) => item.propertyId || `property-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        onRefresh={refetch}
        refreshing={loading}
      />
      <FloatingMenu
        title="Add Property"
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
          <PropertyForm
            disposeModalHandler={() => {
              setModalVisible(false);
            }}
            onAddProperty={() => {
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
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 2,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  propertyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyHeader: {
    marginBottom: 12,
  },
  propertyTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  propertyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  activeBadge: {
    backgroundColor: '#d4edda',
  },
  inactiveBadge: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#155724',
  },
  inactiveText: {
    color: '#721c24',
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  addressIconText: {
    fontSize: 16,
  },
  addressContent: {
    flex: 1,
  },
  primaryAddress: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 4,
  },
  secondaryAddress: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  country: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
  },
  detailsSection: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  referenceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  referenceLabel: {
    fontSize: 12,
    color: '#666666',
    marginRight: 8,
  },
  referenceValue: {
    fontSize: 12,
    color: '#007AFF',
    fontFamily: 'monospace',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 64,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
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
  resultsCounter: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
  },
  resultsText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
