import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { AlertCircle, DollarSign, Info, SquareUser } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, StyleSheet, View, Text, Alert } from 'react-native';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { getPropertyOwnerQuery } from '~/custom_modules/tools/api/queries';
import { IOwnerInfo } from '../../interfaces';
import { OwnerDetailsConsolidated } from './ownerDetails';
import { userData } from '~/store/user';
import { useTakeUserBalance } from '~/core_modules/profile/userBalance/customHooks/useTakePayment';
import { propertyOwnerPricing } from '../../data';
import { theme } from '~/theme/theme';
import { OwnerDetailsConsolidated2 } from './ownerDetails2';

export const RequestOwnerModal = ({
  first_name,
  last_name,
  state,
  zip,
  address,
  city,
  feature,
}: {
  first_name: string;
  last_name: string;
  state: string;
  zip: string;
  address: string;
  city: string;
  feature: 'expired' | 'propDetail';
}) => {
  const userInfo = useReactiveVar(userData);
  const { loading: loadingTakingBalance, takeBalance } = useTakeUserBalance();
  const [ownerModal, setOwnerModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [inSuficientFunds, setInsuficientFunds] = useState(false);

  const [getOwnerInfo, { data, loading }] = useLazyQuery<{
    fetchOwnerContact: IOwnerInfo[];
  }>(getPropertyOwnerQuery);

  const handleButtonPress = () => {
    // Show confirmation modal instead of directly processing
    setConfirmationModal(true);
  };

  const handleConfirmPurchase = async () => {
    setConfirmationModal(false);

    const currentBalance = userInfo?.balance?.amount ?? 0;

    try {
      if (currentBalance - propertyOwnerPricing > 0) {
        await takeBalance({
          amount: propertyOwnerPricing,
          userId: userInfo?.id ?? '',
        });

        await getOwnerInfo({
          variables: {
            first_name,
            last_name,
            state,
            zip,
            address,
            city,
          },
        });
        setOwnerModal(true);
      } else {
        setInsuficientFunds(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to retrieve owner information. Please try again.', [
        { text: 'OK' },
      ]);
      throw error;
    }
  };

  // Format price for display
  const formattedPrice =
    propertyOwnerPricing < 1
      ? `${(propertyOwnerPricing * 100).toFixed(0)}¢`
      : `$${propertyOwnerPricing.toFixed(2)}`;

  return (
    <View style={styles.container}>
      {/* Subtle disclaimer text above button */}
      <View style={styles.disclaimerContainer}>
        <Info size={12} color="#666" />
        <Text style={styles.disclaimerText}>Results depend on available records</Text>
      </View>

      <View style={styles.actionButtonsContainer}>
        <PrimaryButton
          loading={loading || loadingTakingBalance}
          size={ButtonSize.LARGE}
          onPress={handleButtonPress}
          title={`Purchase Owner Info • ${formattedPrice}`}
          rightWidget={<SquareUser size={18} color="#fff" />}
        />
        {inSuficientFunds && !loadingTakingBalance && (
          <Text style={styles.errorMessage}>Insufficient Funds</Text>
        )}
      </View>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmationModal}
        onRequestClose={() => setConfirmationModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationCard}>
            <View style={styles.modalHeader}>
              <DollarSign size={24} color="#4CAF50" />
              <Text style={styles.modalTitle}>Confirm Purchase</Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Amount to be charged:</Text>
              <Text style={styles.priceAmount}>{formattedPrice}</Text>
            </View>

            <View style={styles.warningContainer}>
              <AlertCircle size={20} color="#FF9800" />
              <Text style={styles.warningText}>
                Please note: This service searches third-party databases for owner information.
                Results may vary based on available records and may not always include complete
                contact details. Charges apply regardless of data completeness.
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <PrimaryButton
                title="Cancel"
                style={{
                  backgroundColor: theme.colors.baseGray,
                  flex: 1,
                }}
                textStyle={{
                  color: theme.colors.textColor,
                }}
                onPress={() => setConfirmationModal(false)}
                size={ButtonSize.LARGE}
              />
              <PrimaryButton
                title={`Confirm ${formattedPrice}`}
                style={{
                  backgroundColor: theme.colors.success,
                  flex: 1,
                }}
                loading={loadingTakingBalance}
                onPress={handleConfirmPurchase}
                size={ButtonSize.LARGE}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Owner Details Modal */}
      {data?.fetchOwnerContact && !loading && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={ownerModal}
          onRequestClose={() => setOwnerModal(false)}>
          <OwnerDetailsConsolidated2
            onBack={() => {
              setOwnerModal(false);
            }}
            feature={feature}
            ownerInfo={data?.fetchOwnerContact}
          />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 10,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 4,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  actionButtonsContainer: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  priceContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  errorMessage: {
    fontSize: 14,
    color: theme.colors.danger,
    textAlign: 'center',
  },
});
