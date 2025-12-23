import { useMutation, useQuery } from '@apollo/client';
import { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { CustomerFormData, CustomerSortBy, ICustomer } from '../interfaces';
import { LIST_CUSTOMERS_QUERY } from '../graphql/queries';
import {
  CREATE_CUSTOMER_MUTATION,
  DELETE_CUSTOMER_MUTATION,
  UPDATE_CUSTOMER_MUTATION,
} from '../graphql/mutations';

interface UseCustomersProps {
  tenantID: string;
}

export const useCustomers = ({ tenantID }: UseCustomersProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);
  const [sortBy, setSortBy] = useState<CustomerSortBy>(CustomerSortBy.DATE_DESC);

  // Queries
  const { data, loading, error, refetch } = useQuery(LIST_CUSTOMERS_QUERY, {
    variables: { tenantID },
    fetchPolicy: 'cache-and-network',
  });

  // Mutations
  const [createCustomer, { loading: creating }] = useMutation(CREATE_CUSTOMER_MUTATION);
  const [updateCustomer, { loading: updating }] = useMutation(UPDATE_CUSTOMER_MUTATION);
  const [deleteCustomer, { loading: deleting }] = useMutation(DELETE_CUSTOMER_MUTATION);

  const customers: ICustomer[] = data?.listCustomers || [];

  // Sort customers
  const sortedCustomers = useMemo(() => {
    const sorted = [...customers];

    switch (sortBy) {
      case CustomerSortBy.NAME_ASC:
        return sorted.sort((a, b) =>
          `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        );
      case CustomerSortBy.NAME_DESC:
        return sorted.sort((a, b) =>
          `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`)
        );
      case CustomerSortBy.DATE_ASC:
        return sorted.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case CustomerSortBy.DATE_DESC:
        return sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case CustomerSortBy.EMAIL_ASC:
        return sorted.sort((a, b) => a.email.localeCompare(b.email));
      case CustomerSortBy.EMAIL_DESC:
        return sorted.sort((a, b) => b.email.localeCompare(a.email));
      default:
        return sorted;
    }
  }, [customers, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const newThisMonth = customers.filter((c) => new Date(c.createdAt) >= thisMonthStart).length;

    const recentCustomers = [...customers]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalCustomers: customers.length,
      newThisMonth,
      recentCustomers,
    };
  }, [customers]);

  const handleCreateCustomer = async (formData: CustomerFormData) => {
    try {
      const input = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
      };

      await createCustomer({
        variables: { tenantID, input },
        refetchQueries: [{ query: LIST_CUSTOMERS_QUERY, variables: { tenantID } }],
      });

      Alert.alert('Success', 'Customer created successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to create customer');
      console.error('Create customer error:', err);
      return false;
    }
  };

  const handleUpdateCustomer = async (customerID: string, formData: CustomerFormData) => {
    try {
      const input = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
      };

      await updateCustomer({
        variables: { tenantID, customerID, input },
        refetchQueries: [{ query: LIST_CUSTOMERS_QUERY, variables: { tenantID } }],
      });

      Alert.alert('Success', 'Customer updated successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to update customer');
      console.error('Update customer error:', err);
      return false;
    }
  };

  const handleDeleteCustomer = async (customerID: string) => {
    try {
      await deleteCustomer({
        variables: { tenantID, customerID },
        refetchQueries: [{ query: LIST_CUSTOMERS_QUERY, variables: { tenantID } }],
      });

      Alert.alert('Success', 'Customer deleted successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to delete customer');
      console.error('Delete customer error:', err);
      return false;
    }
  };

  return {
    customers: sortedCustomers,
    loading,
    error,
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
  };
};
