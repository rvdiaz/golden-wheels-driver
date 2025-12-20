import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useModifierGroups } from '../../hooks/useModifiersGroups';
import { ModalContentType, ModifierGroupFormData } from '../../interface';
import Text from '~/codidge_components/UI/text';
import { EmptyState } from '../../../sharedComponent/empty_state';
import { ModifierGroupCard } from '../modifier_group_card';
import { DeleteConfirmationModal } from '../delete_confirmation_modal';
import { ModifierGroupFormModal } from '../modifier_group_form_modal';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';

interface ModifierGroupsListProps {
  tenantID: string;
}

export const ModifierGroupsList: React.FC<ModifierGroupsListProps> = ({ tenantID }) => {
  const {
    groups,
    loading,
    creating,
    updating,
    deleting,
    selectedGroup,
    setSelectedGroup,
    handleCreateGroup,
    handleUpdateGroup,
    handleDeleteGroup,
    refetch,
  } = useModifierGroups({ tenantID });

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
    setSelectedGroup(null);
    setModalMode(ModalContentType.ADD);
    setFormModalVisible(true);
  };

  const handleEditPress = (group: any) => {
    setSelectedGroup(group);
    setModalMode(ModalContentType.EDIT);
    setFormModalVisible(true);
  };

  const handleDeletePress = (group: any) => {
    setSelectedGroup(group);
    setDeleteModalVisible(true);
  };

  const handleFormSubmit = async (formData: ModifierGroupFormData) => {
    if (modalMode === ModalContentType.ADD) {
      const success = await handleCreateGroup(formData);
      if (success) {
        setFormModalVisible(false);
      }
    } else if (selectedGroup) {
      const success = await handleUpdateGroup(selectedGroup.modifiersGroupID, formData);
      if (success) {
        setFormModalVisible(false);
      }
    }
  };

  const confirmDelete = async () => {
    if (selectedGroup) {
      const success = await handleDeleteGroup(selectedGroup.modifiersGroupID);
      if (success) {
        setDeleteModalVisible(false);
        setSelectedGroup(null);
      }
    }
  };

  if (loading && !refreshing) {
    return <PageLoading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Modifier Groups</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Text style={styles.addButtonText}>+ Add Group</Text>
        </TouchableOpacity>
      </View>

      {groups.length === 0 ? (
        <EmptyState
          title="No Modifier Groups Yet"
          message="Create modifier groups to organize related modifiers together."
          actionLabel="Add Group"
          onAction={handleAddPress}
        />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.modifiersGroupID}
          renderItem={({ item }) => (
            <ModifierGroupCard
              group={item}
              onEdit={() => handleEditPress(item)}
              onDelete={() => handleDeletePress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <ModifierGroupFormModal
        visible={formModalVisible}
        mode={modalMode}
        group={selectedGroup}
        onClose={() => setFormModalVisible(false)}
        onSubmit={handleFormSubmit}
        loading={creating || updating}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        title="Delete Modifier Group"
        message={`Are you sure you want to delete "${selectedGroup?.name}"? This action cannot be undone.`}
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
