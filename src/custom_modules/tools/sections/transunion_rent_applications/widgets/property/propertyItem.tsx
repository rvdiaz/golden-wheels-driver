import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { formatAddress } from '../../helpers';
import { IAttestationGroup, ITransUnionProperty } from '../../interfaces';
import { AttestationModal } from './attestationsPopup';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { getTransUnionPropertyAttestationsQuery } from '~/custom_modules/tools/api/queries';
import { userData } from '~/store/user';
import { theme } from '~/theme/theme';
import * as Icons from 'lucide-react-native';
import { Badge } from '~/codidge_components/UI/badge';

export const PropertyItem = ({
  item,
  refetch,
  containerStyle,
  showBadge,
}: {
  item: ITransUnionProperty;
  refetch: any;
  containerStyle?: ViewStyle;
  showBadge?: boolean;
}) => {
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
    <View style={[styles.propertyCard, containerStyle && containerStyle]}>
      <View style={styles.toolTextWrapper}>
        <View style={styles.toolIcon}>
          <Icons.School size={22} color={theme.colors.textColor} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.toolTitle}>{primaryAddress || 'Address not available'}</Text>
          <Text style={styles.toolDescription}>{secondaryAddress}</Text>
        </View>
      </View>
      {showBadge && (
        <Badge
          displayIcon={false}
          style={{
            borderWidth: 0,
          }}
          type={isActive ? 'success' : 'error'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )}
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
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    backgroundColor: '#FFF',
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
  titleContainer: {
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 6,
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
  toolTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  toolContent: {
    padding: 16,
    gap: 16,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.baseGray,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1B4B',
  },
  toolDescription: {
    fontSize: 14,
    color: '#737373',
  },
  toolCardDisabled: {
    opacity: 0.6,
  },
});
