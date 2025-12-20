import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { Alert } from 'react-native';
import { listModifiersGroupsQuery } from '../api/queries';
import { IModifierGroup, ModifierGroupFormData } from '../interface';
import {
  createModifiersGroupMutation,
  deleteModifiersGroupMutation,
  updateModifierGroupMutation,
} from '../api/mutation';

interface UseModifierGroupsProps {
  tenantID: string;
}

export const useModifierGroups = ({ tenantID }: UseModifierGroupsProps) => {
  const [selectedGroup, setSelectedGroup] = useState<IModifierGroup | null>(null);

  // Queries
  const { data, loading, error, refetch } = useQuery(listModifiersGroupsQuery, {
    variables: { tenantID },
  });

  // Mutations
  const [createGroup, { loading: creating }] = useMutation(createModifiersGroupMutation);
  const [updateGroup, { loading: updating }] = useMutation(updateModifierGroupMutation);
  const [deleteGroup, { loading: deleting }] = useMutation(deleteModifiersGroupMutation);

  const groups: IModifierGroup[] = data?.listModifiersGroups || [];

  const handleCreateGroup = async (formData: ModifierGroupFormData) => {
    try {
      const input = {
        name: formData.name,
        description: formData.description || '',
      };

      await createGroup({
        variables: { tenantID, input },
        refetchQueries: [{ query: listModifiersGroupsQuery, variables: { tenantID } }],
      });

      Alert.alert('Success', 'Modifier group created successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to create modifier group');
      console.error('Create group error:', err);
      return false;
    }
  };

  const handleUpdateGroup = async (modifiersGroupID: string, formData: ModifierGroupFormData) => {
    try {
      const input = {
        name: formData.name,
        description: formData.description || '',
      };

      await updateGroup({
        variables: { modifiersGroupID, tenantID, input },
        refetchQueries: [{ query: listModifiersGroupsQuery, variables: { tenantID } }],
      });

      Alert.alert('Success', 'Modifier group updated successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to update modifier group');
      console.error('Update group error:', err);
      return false;
    }
  };

  const handleDeleteGroup = async (modifiersGroupID: string) => {
    try {
      await deleteGroup({
        variables: { modifiersGroupID, tenantID },
        refetchQueries: [{ query: listModifiersGroupsQuery, variables: { tenantID } }],
      });

      Alert.alert('Success', 'Modifier group deleted successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to delete modifier group');
      console.error('Delete group error:', err);
      return false;
    }
  };

  return {
    groups,
    loading,
    error,
    creating,
    updating,
    deleting,
    selectedGroup,
    setSelectedGroup,
    handleCreateGroup,
    handleUpdateGroup,
    handleDeleteGroup,
    refetch,
  };
};
