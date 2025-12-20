import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { Alert } from 'react-native';
import { CollectionFormData, ICollection } from '../interfaces';
import { getCollectionsQuery } from '../api/queries';
import {
  createCollectionMutation,
  deleteCategoryMutation,
  updateCollectionsMutation,
} from '../api/mutation';

interface UseCollectionsProps {
  tenantID: string;
  includeProducts?: boolean;
}

export const useCollections = ({ tenantID, includeProducts = true }: UseCollectionsProps) => {
  const [selectedCollection, setSelectedCollection] = useState<ICollection | null>(null);

  // Queries
  const { data, loading, error, refetch } = useQuery(getCollectionsQuery, {
    variables: { tenantID, includeProducts },
    fetchPolicy: 'cache-and-network',
  });

  // Mutations
  const [createCollection, { loading: creating }] = useMutation(createCollectionMutation);
  const [updateCollection, { loading: updating }] = useMutation(updateCollectionsMutation);
  const [deleteCollection, { loading: deleting }] = useMutation(deleteCategoryMutation);

  const collections: ICollection[] = data?.listCategory || [];

  const handleCreateCollection = async (formData: CollectionFormData) => {
    try {
      const input = {
        name: formData.name,
        description: formData.description || '',
        htmlDescription: formData.htmlDescription || '',
        isActive: formData.isActive,
        productIDs: formData.productIDs || [],
        imageCatalog: formData.imageCatalog || [],
      };

      await createCollection({
        variables: { tenantID, input },
        refetchQueries: [{ query: getCollectionsQuery, variables: { tenantID, includeProducts } }],
      });

      Alert.alert('Success', 'Collection created successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to create collection');
      console.error('Create collection error:', err);
      return false;
    }
  };

  const handleUpdateCollection = async (categoryID: string, formData: CollectionFormData) => {
    try {
      const input = {
        name: formData.name,
        description: formData.description || '',
        htmlDescription: formData.htmlDescription || '',
        isActive: formData.isActive,
        productIDs: formData.productIDs || [],
        imageCatalog: formData.imageCatalog || [],
      };

      await updateCollection({
        variables: { categoryID, tenantID, input },
        refetchQueries: [{ query: getCollectionsQuery, variables: { tenantID, includeProducts } }],
      });

      Alert.alert('Success', 'Collection updated successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to update collection');
      console.error('Update collection error:', err);
      return false;
    }
  };

  const handleDeleteCollection = async (categoryID: string) => {
    try {
      await deleteCollection({
        variables: { categoryID, tenantID },
        refetchQueries: [{ query: getCollectionsQuery, variables: { tenantID, includeProducts } }],
      });

      Alert.alert('Success', 'Collection deleted successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to delete collection');
      console.error('Delete collection error:', err);
      return false;
    }
  };

  const handleToggleAvailability = async (categoryID: string) => {
    const collection = collections.find((c) => c.categoryID === categoryID);
    if (!collection) return false;

    try {
      const input = {
        isActive: !collection.isActive,
      };

      await updateCollection({
        variables: { categoryID, tenantID, input },
        refetchQueries: [{ query: getCollectionsQuery, variables: { tenantID, includeProducts } }],
      });

      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to toggle availability');
      console.error('Toggle availability error:', err);
      return false;
    }
  };

  return {
    collections,
    loading,
    error,
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
  };
};
