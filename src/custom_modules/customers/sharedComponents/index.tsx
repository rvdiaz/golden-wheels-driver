import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Modal } from 'react-native';

// EmptyState Component
interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.icon}>👥</Text>
      <Text style={emptyStyles.title}>{title}</Text>
      <Text style={emptyStyles.message}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={emptyStyles.button} onPress={onAction}>
          <Text style={emptyStyles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#10B981',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

// LoadingSpinner Component
interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#10B981',
}) => {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

// DeleteConfirmationModal Component
interface DeleteConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onCancel}>
      <View style={deleteStyles.overlay}>
        <View style={deleteStyles.modalContent}>
          <Text style={deleteStyles.title}>{title}</Text>
          <Text style={deleteStyles.message}>{message}</Text>

          <View style={deleteStyles.actions}>
            <TouchableOpacity
              style={deleteStyles.cancelButton}
              onPress={onCancel}
              disabled={loading}>
              <Text style={deleteStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[deleteStyles.deleteButton, loading && deleteStyles.deleteButtonDisabled]}
              onPress={onConfirm}
              disabled={loading}>
              <Text style={deleteStyles.deleteButtonText}>
                {loading ? 'Deleting...' : 'Delete'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const deleteStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    backgroundColor: '#FCA5A5',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
