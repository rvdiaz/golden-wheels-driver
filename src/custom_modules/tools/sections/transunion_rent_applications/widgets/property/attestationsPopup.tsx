import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Modal, TouchableOpacity, Alert } from 'react-native';
import { AttestationModalProps } from '../../interfaces';
import Text from '~/codidge_components/UI/text';
import { useMutation } from '@apollo/client';
import { updateTransUnionPropertyMutation } from '~/custom_modules/tools/api/mutations';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { theme } from '~/theme/theme';

export const AttestationModal: React.FC<AttestationModalProps> = ({
  userId,
  propertyId,
  pendingPropertyData,
  visible,
  attestationGroup,
  onAccept,
  onDecline,
}) => {
  const [acceptedAttestations, setAcceptedAttestations] = useState<Set<number>>(new Set());

  const [updatePropertyMutationFn, { loading }] = useMutation<{
    updateTransUnionProperty: string;
  }>(updateTransUnionPropertyMutation);

  const handleToggleAttestation = (attestationId: number) => {
    setAcceptedAttestations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(attestationId)) {
        newSet.delete(attestationId);
      } else {
        newSet.add(attestationId);
      }
      return newSet;
    });
  };

  const allRequiredAccepted =
    attestationGroup?.attestations.every(
      (attestation) =>
        !attestation.affirmativeRequired || acceptedAttestations.has(attestation.attestationId)
    ) ?? false;

  const onAcceptence = async () => {
    try {
      await updatePropertyMutationFn({
        variables: {
          propertyId,
          userId,
          updates: {
            ...pendingPropertyData,
            isActive: true,
          },
        },
      });
      onAccept();
    } catch (error) {
      Alert.alert('Error', 'Please try again.');
      console.log(':::error updating property');
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onDecline}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Property Attestations Required</Text>
          <Text style={styles.modalSubtitle}>
            Please review and accept the following attestations to continue:
          </Text>

          <ScrollView style={styles.attestationScrollView} showsVerticalScrollIndicator={true}>
            {attestationGroup?.attestations.map((attestation) => (
              <View key={attestation.attestationId} style={styles.attestationItem}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => handleToggleAttestation(attestation.attestationId)}
                  disabled={loading}>
                  <View style={styles.checkbox}>
                    {acceptedAttestations.has(attestation.attestationId) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <View style={styles.attestationTextContainer}>
                    <Text style={styles.attestationName}>
                      {attestation.name}
                      {attestation.affirmativeRequired && (
                        <Text style={styles.requiredStar}> *</Text>
                      )}
                    </Text>
                    <Text style={styles.attestationLegalText}>{attestation.legalText}</Text>
                    {attestation.additionalInformation && (
                      <Text style={styles.attestationAdditionalInfo}>
                        {attestation.additionalInformation}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.modalActions}>
            <OutlineButton
              style={{
                flex: 1,
              }}
              onPress={onDecline}
              disabled={loading}
              color={theme.colors.info}
              title="Cancel"
            />
            <PrimaryButton
              style={{
                flex: 1,
                backgroundColor: theme.colors.info,
              }}
              onPress={onAcceptence}
              disabled={!allRequiredAccepted}
              loading={loading}
              title="Accept & Continue"
            />
          </View>

          <Text style={styles.requiredNote}>* Required attestations</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  attestationScrollView: {
    maxHeight: 300,
    marginBottom: 16,
  },
  attestationItem: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkmark: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  attestationTextContainer: {
    flex: 1,
  },
  attestationName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  requiredStar: {
    color: '#FF3B30',
  },
  attestationLegalText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 20,
    marginBottom: 4,
  },
  attestationAdditionalInfo: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  requiredNote: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
