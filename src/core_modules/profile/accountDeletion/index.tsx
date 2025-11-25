import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Icons from 'lucide-react-native';
import Constants from 'expo-constants';
import { useReactiveVar, useMutation, gql, useApolloClient } from '@apollo/client';
import { updateUser, userData } from '~/store/user';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { deleteUserMutation } from '~/core_modules/auth/graphql/mutations';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const AccountDeletionModal = () => {
  const user = useReactiveVar(userData);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(1);
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const client = useApolloClient();

  const [deleteUser] = useMutation(deleteUserMutation);

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE') {
      Alert.alert('Error', 'Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);

    try {
      await deleteUser({
        variables: {
          tenant: { tenantId },
          userId: user?.id,
        },
      });

      Alert.alert('Account Deleted', 'Your account has been successfully deleted.', [
        { text: 'OK' },
      ]);

      updateUser(null);
      await client.clearStore(); // Clears all cached data
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account. Please try again or contact support.', [
        { text: 'OK' },
      ]);
      console.error('Delete account error:', error);
    } finally {
      setIsDeleting(false);
      setModalVisible(false);
      setConfirmationStep(1);
      setConfirmationText('');
    }
  };

  const openModal = () => {
    setModalVisible(true);
    setConfirmationStep(1);
    setConfirmationText('');
  };

  const closeModal = () => {
    setModalVisible(false);
    setConfirmationStep(1);
    setConfirmationText('');
  };

  return (
    <View>
      <TouchableOpacity onPress={openModal} style={styles.menuItem}>
        <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
          <Icons.Trash2 size={20} color="#EF4444" />
        </View>
        <Text style={styles.menuText}>Delete Account</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {confirmationStep === 1 && (
              <>
                <View style={styles.warningIconContainer}>
                  <Icons.AlertTriangle size={48} color="#EF4444" />
                </View>

                <Text style={styles.modalTitle}>Delete Account?</Text>

                <Text style={styles.modalDescription}>
                  This action is permanent and cannot be undone. All your data will be permanently
                  deleted, including:
                </Text>

                <View style={styles.warningList}>
                  <View style={styles.warningItem}>
                    <Icons.X size={16} color="#EF4444" />
                    <Text style={styles.warningText}>Your profile and account information</Text>
                  </View>
                  <View style={styles.warningItem}>
                    <Icons.X size={16} color="#EF4444" />
                    <Text style={styles.warningText}>All tasks, schedules, and CRM data</Text>
                  </View>
                  <View style={styles.warningItem}>
                    <Icons.X size={16} color="#EF4444" />
                    <Text style={styles.warningText}>Complete activity history and records</Text>
                  </View>
                  <View style={styles.warningItem}>
                    <Icons.X size={16} color="#EF4444" />
                    <Text style={styles.warningText}>All stored files, documents, and media</Text>
                  </View>
                  <View style={styles.warningItem}>
                    <Icons.X size={16} color="#EF4444" />
                    <Text style={styles.warningText}>Custom settings and configurations</Text>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={closeModal}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.continueButton]}
                    onPress={() => setConfirmationStep(2)}>
                    <Text style={styles.continueButtonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {confirmationStep === 2 && (
              <>
                <View style={styles.warningIconContainer}>
                  <Icons.ShieldAlert size={48} color="#DC2626" />
                </View>

                <Text style={styles.modalTitle}>Final Confirmation</Text>

                <Text style={styles.modalDescription}>
                  To confirm account deletion, please type{' '}
                  <Text style={styles.deleteText}>DELETE</Text> below:
                </Text>

                <TextInput
                  style={styles.confirmationInput}
                  value={confirmationText}
                  onChangeText={setConfirmationText}
                  placeholder="Type DELETE here"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                  autoCorrect={false}
                />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setConfirmationStep(1)}>
                    <Text style={styles.cancelButtonText}>Go Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.deleteButton,
                      (confirmationText !== 'DELETE' || isDeleting) && styles.deleteButtonDisabled,
                    ]}
                    onPress={handleDeleteAccount}
                    disabled={confirmationText !== 'DELETE' || isDeleting}>
                    {isDeleting ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.deleteButtonText}>Delete Forever</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.lg,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  warningIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  deleteText: {
    fontWeight: 'bold',
    color: '#DC2626',
  },
  warningList: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#991B1B',
    flex: 1,
  },
  confirmationInput: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    color: '#111827',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#EF4444',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  },
  deleteButtonDisabled: {
    backgroundColor: '#FCA5A5',
    opacity: 0.6,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
