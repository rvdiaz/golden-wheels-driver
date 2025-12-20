import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { Alert } from 'react-native';
import { IModifier, ModifierFormData } from '../interface';
import { listModifiersQuery } from '../api/queries';
import {
  createModifierMutation,
  deleteModifierMutation,
  updateModifierMutation,
} from '../api/mutation';

interface UseModifiersProps {
  tenantID: string;
}

export const useModifiers = ({ tenantID }: UseModifiersProps) => {
  const [selectedModifier, setSelectedModifier] = useState<IModifier | null>(null);

  // Queries
  const { data, loading, error, refetch } = useQuery(listModifiersQuery, {
    variables: { tenantID },
  });

  // Mutations
  const [createModifier, { loading: creating }] = useMutation(createModifierMutation);
  const [updateModifier, { loading: updating }] = useMutation(updateModifierMutation);
  const [deleteModifier, { loading: deleting }] = useMutation(deleteModifierMutation);

  const modifiers: IModifier[] = data?.listModifiers || [];

  const handleCreateModifier = async (formData: ModifierFormData) => {
    try {
      const input = {
        name: formData.name,
        price: {
          amount: parseFloat(formData.price),
          currencyCode: 'USD', // You might want to make this configurable
        },
        description: formData.description || '',
        isActive: formData.isActive,
      };

      await createModifier({
        variables: { tenantID, input },
        refetchQueries: [{ query: listModifiersQuery, variables: { tenantID } }],
      });

      Alert.alert('Success', 'Modifier created successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to create modifier');
      console.error('Create modifier error:', err);
      return false;
    }
  };

  const handleUpdateModifier = async (modifierID: string, formData: ModifierFormData) => {
    try {
      const input = {
        name: formData.name,
        price: {
          amount: parseFloat(formData.price),
          currencyCode: 'USD',
        },
        description: formData.description || '',
        isActive: formData.isActive,
      };

      await updateModifier({
        variables: { modifierID, tenantID, input },
      });

      Alert.alert('Success', 'Modifier updated successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to update modifier');
      console.error('Update modifier error:', err);
      return false;
    }
  };

  const handleDeleteModifier = async (modifierID: string) => {
    try {
      await deleteModifier({
        variables: { modifierID, tenantID },
        refetchQueries: [{ query: listModifiersQuery, variables: { tenantID } }],
      });

      Alert.alert('Success', 'Modifier deleted successfully');
      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to delete modifier');
      console.error('Delete modifier error:', err);
      return false;
    }
  };

  const handleToggleAvailability = async (modifierID: string) => {
    const modifier = modifiers.find((m) => m.modifierID === modifierID);
    if (!modifier) return false;

    try {
      const input = {
        isActive: !modifier.isActive,
      };

      await updateModifier({
        variables: { modifierID, tenantID, input },
        refetchQueries: [{ query: listModifiersQuery, variables: { tenantID } }],
      });

      return true;
    } catch (err) {
      Alert.alert('Error', 'Failed to toggle availability');
      console.error('Toggle availability error:', err);
      return false;
    }
  };

  return {
    modifiers,
    loading,
    error,
    creating,
    updating,
    deleting,
    selectedModifier,
    setSelectedModifier,
    handleCreateModifier,
    handleUpdateModifier,
    handleDeleteModifier,
    handleToggleAvailability,
    refetch,
  };
};
