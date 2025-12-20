import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm } from 'react-hook-form';
import {
  CollectionFormData,
  CollectionMenu,
  ICollection,
  ModalContentCollection,
} from '../interfaces';
import { CollectionFormMain } from '../components/collection_form_main';
import { CollectionFormProducts } from '../components/collection_form_products';

interface CollectionFormModalProps {
  visible: boolean;
  mode: ModalContentCollection;
  collection?: ICollection | null;
  onClose: () => void;
  onSubmit: (data: CollectionFormData) => Promise<void>;
  loading?: boolean;
  tenantID: string;
}

export const CollectionFormModal: React.FC<CollectionFormModalProps> = ({
  visible,
  mode,
  collection,
  onClose,
  onSubmit,
  loading = false,
  tenantID,
}) => {
  const [currentStep, setCurrentStep] = useState<CollectionMenu>(CollectionMenu.MAIN);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CollectionFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      htmlDescription: '',
      isActive: true,
      productIDs: [],
      imageCatalog: [],
    },
  });

  useEffect(() => {
    if (collection && mode === ModalContentCollection.EDIT) {
      reset({
        name: collection.name,
        description: collection.description || '',
        htmlDescription: collection.htmlDescription || '',
        isActive: collection.isActive,
        productIDs: collection.productIDs || [],
        imageCatalog: collection.imageCatalog || [],
      });
    } else {
      reset({
        name: '',
        description: '',
        htmlDescription: '',
        isActive: true,
        productIDs: [],
        imageCatalog: [],
      });
    }
    setCurrentStep(CollectionMenu.MAIN);
  }, [collection, mode, visible, reset]);

  const onSubmitForm = async (data: CollectionFormData) => {
    await onSubmit(data);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(CollectionMenu.MAIN);
    onClose();
  };

  const title = mode === ModalContentCollection.ADD ? 'Add Collection' : 'Edit Collection';

  const steps = [
    { key: CollectionMenu.MAIN, label: 'Main' },
    { key: CollectionMenu.PRODUCTS, label: 'Products' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].key);
    }
  };

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

            {/* Step Indicators */}
            <View style={styles.stepIndicator}>
              {steps.map((step, index) => (
                <TouchableOpacity
                  key={step.key}
                  style={[styles.stepItem, currentStep === step.key && styles.stepItemActive]}
                  onPress={() => setCurrentStep(step.key)}>
                  <View
                    style={[
                      styles.stepCircle,
                      currentStep === step.key && styles.stepCircleActive,
                      index < currentStepIndex && styles.stepCircleCompleted,
                    ]}>
                    <Text
                      style={[
                        styles.stepNumber,
                        (currentStep === step.key || index < currentStepIndex) &&
                          styles.stepNumberActive,
                      ]}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text
                    style={[styles.stepLabel, currentStep === step.key && styles.stepLabelActive]}>
                    {step.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Form Content */}
            <View style={styles.formContainer}>
              {currentStep === CollectionMenu.MAIN && (
                <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                  <CollectionFormMain control={control} errors={errors} />
                </ScrollView>
              )}
              {currentStep === CollectionMenu.PRODUCTS && (
                <CollectionFormProducts control={control} errors={errors} tenantID={tenantID} />
              )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              {!isFirstStep && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={goToPreviousStep}
                  disabled={loading}>
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              )}

              {isLastStep ? (
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    isFirstStep && styles.submitButtonFull,
                    loading && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit(onSubmitForm)}
                  disabled={loading}>
                  <Text style={styles.submitButtonText}>
                    {loading
                      ? 'Saving...'
                      : mode === ModalContentCollection.ADD
                        ? 'Create Collection'
                        : 'Update Collection'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.nextButton, isFirstStep && styles.submitButtonFull]}
                  onPress={goToNextStep}>
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              )}
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
    height: '90%',
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepItemActive: {},
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#3B82F6',
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  submitButtonFull: {
    flex: 1,
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
