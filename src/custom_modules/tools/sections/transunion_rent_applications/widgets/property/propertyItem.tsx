import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { formatAddress } from '../../helpers';
import { IAttestationGroup, ITransUnionProperty } from '../../interfaces';
import { AttestationModal } from './attestationsPopup';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { getTransUnionPropertyAttestationsQuery } from '~/custom_modules/tools/api/queries';
import { userData } from '~/store/user';

export const PropertyItem = ({ item, refetch }: { item: ITransUnionProperty; refetch: any }) => {
  const user = useReactiveVar(userData);

  const { primaryAddress, secondaryAddress } = formatAddress(item);
  const [showAttestationModal, setShowAttestationModal] = useState(false);
  const [attestationGroup, setAttestationGroup] = useState<IAttestationGroup | null>(null);

  const isActive = item.isActive;

  const [getPropertyAttestationsFn, { loading: isLoading }] = useLazyQuery(
    getTransUnionPropertyAttestationsQuery
  );

  const activateAddress = async () => {
    try {
      const response = await getPropertyAttestationsFn({
        variables: {
          userId: user?.id,
          propertyId: item.propertyId,
        },
      });

      if (response.data?.getTransunionPropertiesAttestations?.attestations) {
        const attestations = response.data.getTransunionPropertiesAttestations.attestations;

        // If attestations exist and have items, show the modal
        if (attestations.attestations && attestations.attestations.length > 0) {
          setAttestationGroup(attestations);
          setShowAttestationModal(true);
          return;
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <View style={styles.propertyCard}>
      {/* Property Header */}
      <View style={styles.propertyHeader}>
        <View style={styles.propertyTitle}>
          <View style={[styles.statusBadge, isActive ? styles.activeBadge : styles.inactiveBadge]}>
            <Text style={[styles.statusText, isActive ? styles.activeText : styles.inactiveText]}>
              {isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </View>

      {/* Address Section */}
      <View style={styles.addressSection}>
        <View style={styles.addressIcon}>
          <Text style={styles.addressIconText}>📍</Text>
        </View>
        <View style={styles.addressContent}>
          <Text style={styles.primaryAddress} numberOfLines={2}>
            {primaryAddress || 'Address not available'}
          </Text>
          {secondaryAddress && (
            <Text style={styles.secondaryAddress} numberOfLines={1}>
              {secondaryAddress}
            </Text>
          )}
          {item.country ? <Text style={styles.country}>{item.country}</Text> : <></>}
        </View>
      </View>

      {/* Activation Button - Only show when inactive */}
      {!isActive && (
        <TouchableOpacity
          style={styles.activateButton}
          onPress={activateAddress}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Text style={styles.activateButtonText}>Activate Property</Text>
              <Text style={styles.activateButtonSubtext}>Review and accept attestations</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {user?.id && item?.propertyId && (
        <AttestationModal
          userId={user?.id}
          propertyId={item?.propertyId}
          pendingPropertyData={item}
          visible={showAttestationModal}
          attestationGroup={attestationGroup}
          onAccept={() => {
            setShowAttestationModal(false);
            refetch();
          }}
          onDecline={() => {
            setShowAttestationModal(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  propertyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyHeader: {
    marginBottom: 12,
  },
  propertyTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  propertyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  activeBadge: {
    backgroundColor: '#d4edda',
  },
  inactiveBadge: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#155724',
  },
  inactiveText: {
    color: '#721c24',
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  addressIconText: {
    fontSize: 16,
  },
  addressContent: {
    flex: 1,
  },
  primaryAddress: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 4,
  },
  secondaryAddress: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  country: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
  },
  activateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  activateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  activateButtonSubtext: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.9,
  },
});
