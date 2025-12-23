import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useCustomers } from './hooks/useCustomers';
import { CustomerFormData, CustomerSortBy, ModalContentCustomerType } from './interfaces';
import { getCustomerFullName, searchCustomers } from './utils';
import { LoadingSpinner } from '~/codidge_components/UI/loading/loadingSpinner';
import { EmptyState } from '../inventory/sharedComponent/empty_state';
import { CustomerCard } from './components/customerCard';
import { CustomerFormModal } from './components/customerForModal';
import { DeleteConfirmationModal } from './sharedComponents';
import { useTenant } from '~/store/tenant/useTenant';

export const CustomersList = () => {
  const { userInfo } = useTenant();

  const {
    customers,
    loading,
    creating,
    updating,
    deleting,
    selectedCustomer,
    setSelectedCustomer,
    handleCreateCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer,
    refetch,
    stats,
    sortBy,
    setSortBy,
  } = useCustomers({ tenantID: userInfo?.activeTenantId! });

  const [formModalVisible, setFormModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalContentCustomerType>(
    ModalContentCustomerType.ADD
  );
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleAddPress = () => {
    setSelectedCustomer(null);
    setModalMode(ModalContentCustomerType.ADD);
    setFormModalVisible(true);
  };

  const handleEditPress = (customer: any) => {
    setSelectedCustomer(customer);
    setModalMode(ModalContentCustomerType.EDIT);
    setFormModalVisible(true);
  };

  const handleDeletePress = (customer: any) => {
    setSelectedCustomer(customer);
    setDeleteModalVisible(true);
  };

  const handleFormSubmit = async (formData: CustomerFormData) => {
    if (modalMode === ModalContentCustomerType.ADD) {
      const success = await handleCreateCustomer(formData);
      if (success) {
        setFormModalVisible(false);
      }
    } else if (selectedCustomer) {
      const success = await handleUpdateCustomer(selectedCustomer.customerID, formData);
      if (success) {
        setFormModalVisible(false);
      }
    }
  };

  const confirmDelete = async () => {
    if (selectedCustomer) {
      const success = await handleDeleteCustomer(selectedCustomer.customerID);
      if (success) {
        setDeleteModalVisible(false);
        setSelectedCustomer(null);
      }
    }
  };

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    return searchCustomers(customers, searchQuery);
  }, [customers, searchQuery]);

  const sortOptions = [
    { label: 'Name (A-Z)', value: CustomerSortBy.NAME_ASC },
    { label: 'Name (Z-A)', value: CustomerSortBy.NAME_DESC },
    { label: 'Newest First', value: CustomerSortBy.DATE_DESC },
    { label: 'Oldest First', value: CustomerSortBy.DATE_ASC },
    { label: 'Email (A-Z)', value: CustomerSortBy.EMAIL_ASC },
    { label: 'Email (Z-A)', value: CustomerSortBy.EMAIL_DESC },
  ];

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Customers</Text>
            <Text style={styles.statsText}>
              {stats.totalCustomers} {stats.totalCustomers === 1 ? 'customer' : 'customers'}
              {stats.newThisMonth > 0 && ` • ${stats.newThisMonth} new this month`}
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
            <Text style={styles.addButtonText}>+ Add Customer</Text>
          </TouchableOpacity>
        </View>

        {/* Search and Sort Bar */}
        <View style={styles.searchSortContainer}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by name, email, or phone..."
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.sortButton} onPress={() => setSortModalVisible(true)}>
            <Text style={styles.sortIcon}>⇅</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Customer Count */}
      {filteredCustomers.length > 0 && (
        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'}
            {searchQuery && ' found'}
          </Text>
        </View>
      )}

      {filteredCustomers.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No Customers Found' : 'No Customers Yet'}
          message={
            searchQuery
              ? 'Try adjusting your search terms'
              : 'Add your first customer to get started.'
          }
          actionLabel={searchQuery ? undefined : 'Add Customer'}
          onAction={searchQuery ? undefined : handleAddPress}
        />
      ) : (
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.customerID}
          renderItem={({ item }) => (
            <CustomerCard
              customer={item}
              onEdit={() => handleEditPress(item)}
              onDelete={() => handleDeletePress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <CustomerFormModal
        visible={formModalVisible}
        mode={modalMode}
        customer={selectedCustomer}
        onClose={() => setFormModalVisible(false)}
        onSubmit={handleFormSubmit}
        loading={creating || updating}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        title="Delete Customer"
        message={`Are you sure you want to delete ${
          selectedCustomer ? getCustomerFullName(selectedCustomer) : 'this customer'
        }? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        loading={deleting}
      />

      {/* Sort Modal */}
      <DeleteConfirmationModal
        visible={sortModalVisible}
        title="Sort Customers"
        message="Choose how to sort your customers:"
        onConfirm={() => setSortModalVisible(false)}
        onCancel={() => setSortModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    backgroundColor: '#10B981',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchSortContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
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
  sortButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortIcon: {
    fontSize: 20,
    color: '#6B7280',
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
