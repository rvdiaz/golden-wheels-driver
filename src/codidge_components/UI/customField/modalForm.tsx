import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '~/theme/theme';
import InputField from '../form/inputs/inputField';
import PrimaryButton from '../button/PrimaryButton';
import { ButtonSize } from '../button/OutlineButton';
import { GoalType } from '~/custom_modules/task/interfaces';

interface TaskFieldsModalProps {
  visible: boolean;
  fields: GoalType[];
  onClose: () => void;
  onSubmit: (goalTypes: GoalType[]) => void;
  taskTitle?: string;
}

export const TaskFieldsModal: React.FC<TaskFieldsModalProps> = ({
  visible,
  fields,
  onClose,
  onSubmit,
  taskTitle = 'Complete Task',
}) => {
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleFieldChange = (goalKey: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [goalKey]: value,
    }));

    // Clear error when user starts typing
    if (errors[goalKey]) {
      setErrors((prev) => ({
        ...prev,
        [goalKey]: '',
      }));
    }
  };

  const validateFields = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    fields.forEach((field) => {
      const value = fieldValues[field.goalKey];

      if (!value || value.trim() === '') {
        newErrors[field.goalKey] = `${field.label} is required`;
        return;
      }

      if (field.goalType === 'number') {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
          newErrors[field.goalKey] = `${field.label} must be a valid positive number`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      return;
    }

    const goalTypes: GoalType[] = fields.map((field) => ({
      goalKey: field.goalKey,
      goalType: field.goalType,
      value:
        field.goalType === 'amount'
          ? parseFloat(fieldValues[field.goalKey])
          : fieldValues[field.goalKey],
    }));

    onSubmit(goalTypes);
    handleClose();
  };

  const handleClose = () => {
    setFieldValues({});
    setErrors({});
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{taskTitle}</Text>
            <Text style={styles.modalSubtitle}>Please fill in the required information</Text>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}>
            {fields.map((field) => (
              <View key={field.goalKey} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <InputField
                  value={fieldValues[field.goalKey] || ''}
                  onChangeText={(value) => handleFieldChange(field.goalKey, value)}
                  placeholder={field.label ? `Enter ${field.label.toLowerCase()}` : ''}
                  keyboardType="numeric"
                  error={!!errors[field.goalKey]}
                  errorMessage={errors[field.goalKey]}
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.modalActions}>
            <PrimaryButton
              size={ButtonSize.LARGE}
              style={{ flex: 1, backgroundColor: '#ccc' }}
              title="Cancel"
              onPress={handleClose}
            />
            <PrimaryButton
              size={ButtonSize.LARGE}
              style={{ flex: 1 }}
              title="Complete Task"
              onPress={handleSubmit}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme?.colors?.textColor || '#1F2937',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalContent: {
    padding: 20,
    maxHeight: 300,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme?.colors?.textColor || '#1F2937',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
