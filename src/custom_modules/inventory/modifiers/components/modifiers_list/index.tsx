import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { ModalContentType, ModifierFormData } from '../../interface';
import { useModifiers } from '../../hooks/useModifiers';
import { LoadingSpinner } from '~/codidge_components/UI/loading/loadingSpinner';
import Text from '~/codidge_components/UI/text';
import { ModifierCard } from '../modifier_card';
import { EmptyState } from '../../../sharedComponent/empty_state';
import { ModifierFormModal } from '../modifier_form_modal';
import { DeleteConfirmationModal } from '../delete_confirmation_modal';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';

interface ModifiersListProps {
  tenantID: string;
}

export const ModifiersList: React.FC<ModifiersListProps> = ({ tenantID }) => {
  const {
    modifiers,
    loading,
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
  } = useModifiers({ tenantID });

  const [formModalVisible, setFormModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalContentType>(ModalContentType.ADD);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleAddPress = () => {
    setSelectedModifier(null);
    setModalMode(ModalContentType.ADD);
    setFormModalVisible(true);
  };

  const handleEditPress = (modifier: any) => {
    setSelectedModifier(modifier);
    setModalMode(ModalContentType.EDIT);
    setFormModalVisible(true);
  };

  const handleDeletePress = (modifier: any) => {
    setSelectedModifier(modifier);
    setDeleteModalVisible(true);
  };

  const handleFormSubmit = async (formData: ModifierFormData) => {
    if (modalMode === ModalContentType.ADD) {
      const success = await handleCreateModifier(formData);
      if (success) {
        setFormModalVisible(false);
      }
    } else if (selectedModifier) {
      const success = await handleUpdateModifier(selectedModifier.modifierID, formData);
      if (success) {
        setFormModalVisible(false);
      }
    }
  };

  const confirmDelete = async () => {
    if (selectedModifier) {
      const success = await handleDeleteModifier(selectedModifier.modifierID);
      if (success) {
        setDeleteModalVisible(false);
        setSelectedModifier(null);
      }
    }
  };

  const handleToggle = async (modifierID: string) => {
    await handleToggleAvailability(modifierID);
  };

  if (loading && !refreshing) {
    return <PageLoading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Modifiers</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Text style={styles.addButtonText}>+ Add Modifier</Text>
        </TouchableOpacity>
      </View>

      {modifiers.length === 0 ? (
        <EmptyState
          title="No Modifiers Yet"
          message="Create your first modifier to get started with customizing menu items."
          actionLabel="Add Modifier"
          onAction={handleAddPress}
        />
      ) : (
        <FlatList
          data={modifiers}
          keyExtractor={(item) => item.modifierID}
          renderItem={({ item }) => (
            <ModifierCard
              modifier={item}
              onEdit={() => handleEditPress(item)}
              onDelete={() => handleDeletePress(item)}
              onToggleAvailability={() => handleToggle(item.modifierID)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <ModifierFormModal
        visible={formModalVisible}
        mode={modalMode}
        modifier={selectedModifier}
        onClose={() => setFormModalVisible(false)}
        onSubmit={handleFormSubmit}
        loading={creating || updating}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        title="Delete Modifier"
        message={`Are you sure you want to delete "${selectedModifier?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        loading={deleting}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
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
  listContent: {
    padding: 16,
  },
});
