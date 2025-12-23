import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { isValidEmail, isValidPhone } from '../utils';
import { CustomerFormData, ICustomer, ModalContentCustomerType } from '../interfaces';

interface CustomerFormModalProps {
  visible: boolean;
  mode: ModalContentCustomerType;
  customer?: ICustomer | null;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  loading?: boolean;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  visible,
  mode,
  customer,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CustomerFormData>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (customer && mode === ModalContentCustomerType.EDIT) {
      reset({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      });
    }
  }, [customer, mode, visible, reset]);

  const onSubmitForm = async (data: CustomerFormData) => {
    await onSubmit(data);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const title = mode === ModalContentCustomerType.ADD ? 'Add Customer' : 'Edit Customer';

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
              {/* First Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  First Name <Text style={styles.required}>*</Text>
                </Text>
                <Controller
                  control={control}
                  name="firstName"
                  rules={{
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.firstName && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter first name"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="words"
                    />
                  )}
                />
                {errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName.message}</Text>
                )}
              </View>

              {/* Last Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Last Name <Text style={styles.required}>*</Text>
                </Text>
                <Controller
                  control={control}
                  name="lastName"
                  rules={{
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.lastName && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter last name"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="words"
                    />
                  )}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}
              </View>

              {/* Email */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Email <Text style={styles.required}>*</Text>
                </Text>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: 'Email is required',
                    validate: (value) =>
                      isValidEmail(value) || 'Please enter a valid email address',
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.email && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="customer@example.com"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
              </View>

              {/* Phone */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Phone <Text style={styles.required}>*</Text>
                </Text>
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    required: 'Phone number is required',
                    validate: (value) => isValidPhone(value) || 'Please enter a valid phone number',
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.phone && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="(555) 123-4567"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                    />
                  )}
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>ℹ️</Text>
                <Text style={styles.infoText}>
                  All fields are required. Make sure the email and phone number are valid.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                disabled={loading}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit(onSubmitForm)}
                disabled={loading}>
                <Text style={styles.submitButtonText}>
                  {loading
                    ? 'Saving...'
                    : mode === ModalContentCustomerType.ADD
                      ? 'Add Customer'
                      : 'Update Customer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6B7280',
  },
  form: {
    padding: 20,
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    marginTop: 8,
  },
  infoIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#A7F3D0',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
