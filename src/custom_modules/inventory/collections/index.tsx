import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
} from 'react-native';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import { EmptyState } from '~/custom_modules/inventory/sharedComponent/empty_state';
import { DeleteConfirmationModal } from '~/custom_modules/inventory/modifiers/components/delete_confirmation_modal';
import { useCollections } from './hooks/useCollection';
import { useTenant } from '~/store/tenant/useTenant';
import { CollectionFormData, ModalContentCollection } from './interfaces';
import Text from '~/codidge_components/UI/text';
import { CollectionFormModal } from './sharedComponent';
import { CollectionCard } from './components/collection_card';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';
import { theme } from '~/theme/theme';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

export const CollectionsPage = () => {
  const navigation = useNavigation();

  const { userInfo } = useTenant();

  const {
    collections,
    loading,
    creating,
    updating,
    deleting,
    selectedCollection,
    setSelectedCollection,
    handleCreateCollection,
    handleUpdateCollection,
    handleDeleteCollection,
    handleToggleAvailability,
    refetch,
  } = useCollections({ tenantID: userInfo?.activeTenantId!, includeProducts: true });

  const [formModalVisible, setFormModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalContentCollection>(ModalContentCollection.ADD);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleAddPress = () => {
    setSelectedCollection(null);
    setModalMode(ModalContentCollection.ADD);
    setFormModalVisible(true);
  };

  const handleEditPress = (collection: any) => {
    setSelectedCollection(collection);
    setModalMode(ModalContentCollection.EDIT);
    setFormModalVisible(true);
  };

  const handleDeletePress = (collection: any) => {
    setSelectedCollection(collection);
    setDeleteModalVisible(true);
  };

  const handleFormSubmit = async (formData: CollectionFormData) => {
    if (modalMode === ModalContentCollection.ADD) {
      const success = await handleCreateCollection(formData);
      if (success) {
        setFormModalVisible(false);
      }
    } else if (selectedCollection) {
      const success = await handleUpdateCollection(selectedCollection.categoryID, formData);
      if (success) {
        setFormModalVisible(false);
      }
    }
  };

  const confirmDelete = async () => {
    if (selectedCollection) {
      const success = await handleDeleteCollection(selectedCollection.categoryID);
      if (success) {
        setDeleteModalVisible(false);
        setSelectedCollection(null);
      }
    }
  };

  const handleToggle = async (categoryID: string) => {
    await handleToggleAvailability(categoryID);
  };

  // Filter collections based on search query
  const filteredCollections = collections.filter((collection) => {
    const query = searchQuery.toLowerCase();
    return (
      collection.name.toLowerCase().includes(query) ||
      collection.description?.toLowerCase().includes(query) ||
      collection.categoryID.toLowerCase().includes(query)
    );
  });

  // Calculate total products across all collections
  const totalProducts = collections.reduce(
    (sum, collection) => sum + (collection.products?.length || collection.productIDs?.length || 0),
    0
  );

  if (loading && !refreshing) {
    return <PageLoading />;
  }

  return (
    <PageSafeContainer style={styles.container}>
      <Header
        onBack={() => {
          navigation.goBack();
        }}
        title=""
        showBack={true}
      />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Collections</Text>
            <Text style={styles.statsText}>
              {collections.length} {collections.length === 1 ? 'collection' : 'collections'} •{' '}
              {totalProducts} products
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
            <Text style={styles.addButtonText}>+ Add Collection</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search collections..."
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Collection Count */}
      {filteredCollections.length > 0 && (
        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {filteredCollections.length}{' '}
            {filteredCollections.length === 1 ? 'collection' : 'collections'}
            {searchQuery && ' found'}
          </Text>
        </View>
      )}

      {filteredCollections.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No Collections Found' : 'No Collections Yet'}
          message={
            searchQuery
              ? 'Try adjusting your search terms'
              : 'Create your first collection to organize your products.'
          }
          actionLabel={searchQuery ? undefined : 'Add Collection'}
          onAction={searchQuery ? undefined : handleAddPress}
        />
      ) : (
        <FlatList
          data={filteredCollections}
          keyExtractor={(item) => item.categoryID}
          renderItem={({ item }) => (
            <CollectionCard
              collection={item}
              onEdit={() => handleEditPress(item)}
              onDelete={() => handleDeletePress(item)}
              onToggleAvailability={() => handleToggle(item.categoryID)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <CollectionFormModal
        visible={formModalVisible}
        mode={modalMode}
        collection={selectedCollection}
        onClose={() => setFormModalVisible(false)}
        onSubmit={handleFormSubmit}
        loading={creating || updating}
        tenantID={userInfo?.activeTenantId!}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        title="Delete Collection"
        message={`Are you sure you want to delete "${selectedCollection?.name}"? This won't delete the products in it.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        loading={deleting}
      />
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSectionsBackgroundColor,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statsText: {
    fontSize: 13,
    color: '#6B7280',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  clearIcon: {
    fontSize: 18,
    color: '#6B7280',
    paddingHorizontal: 8,
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  countText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
});
