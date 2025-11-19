import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Alert, Modal } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { getTransunionPropertyQuery } from '~/custom_modules/tools/api/queries';
import { ITransUnionProperty } from '../../interfaces';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { Search } from 'lucide-react-native';
import { PropertyForm } from './propertyForm';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import { PropertyItem } from './propertyItem';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';
import { theme } from '~/theme/theme';
import { ButtonSize } from '~/codidge_components/UI/button/OutlineButton';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { FloatingMenu } from '~/codidge_components/UI/button/FloatingMenu';

export const TransUnionPropertyList = ({ onBack }: { onBack: () => void }) => {
  const user = useReactiveVar(userData);

  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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

  const renderPropertyItem = ({ item }: { item: ITransUnionProperty }) => {
    return <PropertyItem item={item} refetch={refetch} />;
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

  if (error)
    return (
      <PageSafeContainer>
        <Header
          title="Properties"
          showBack={true}
          onBack={() => {
            onBack();
          }}
        />
        <View style={styles.errorState}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <PrimaryButton
            title="Try Again"
            size={ButtonSize.LARGE}
            onPress={() => {
              refetch();
            }}
          />
          <Text style={styles.errorTitle}>Unable to load properties</Text>
          <Text style={styles.errorSubtitle}>Please check your connection and try again</Text>
        </View>
      </PageSafeContainer>
    );

  return (
    <PageSafeContainer
      style={{
        backgroundColor: theme.colors.surfaceSectionsBackgroundColor,
      }}>
      <Header
        title="Properties"
        showBack={true}
        onBack={() => {
          onBack();
        }}
        contentContainerStyle={{
          borderBottomWidth: 0,
        }}
      />
      {loading ? (
        <PageLoading />
      ) : (
        <View style={styles.container}>
          {/* Search Header */}
          <View style={styles.searchContainer}>
            <InputField
              placeholder="Search by name or address"
              value={searchTerm}
              onChangeText={setSearchTerm}
              leftIcon={<Search size={16} />}
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
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />} // <-- gap here
          />
        </View>
      )}
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
      <FloatingMenu
        title="Add Property"
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
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 2,
    backgroundColor: '#ffffff',
    gap: 14,
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
    marginVertical: 8,
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
