import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSystemSettings } from '~/system_setting/customHook';
import { BalancePurchaseItem } from './balacePurchaseItem';
import { IAppPaymentProducts } from '~/custom_modules/iap/interfaces';

export interface BalancePurchaseOption {
  productId: string;
  name: string;
  description: string;
  price: number;
  balanceAmount: number;
  badge?: string;
  bonusPercentage?: number;
  features?: string[];
  isPopular?: boolean;
}

export interface IBalancePurchaseModalViewProps {
  visible: boolean;
  onClose: () => void;
  products: any[];
  balanceOptions: IAppPaymentProducts[];
  currentBalance: number;
  requestPurchase: (sku: string) => void;
  termsOfUseUrl?: string;
  privacyPolicyUrl?: string;
}

export const BalancePurchaseModalView = (args: IBalancePurchaseModalViewProps) => {
  const legal = useSystemSettings().legal;

  const {
    visible,
    onClose,
    products,
    balanceOptions,
    currentBalance,
    requestPurchase,
    termsOfUseUrl,
    privacyPolicyUrl,
  } = args;

  const insets = useSafeAreaInsets();

  const availableOptions = balanceOptions;

  const getProductForOption = (productId: string) => {
    return products.find((product) => product.productId === productId);
  };

  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent>
      <StatusBar barStyle="light-content" />
      <View
        style={[
          styles.modalContainer,
          {
            paddingTop: insets.top,
            marginBottom: insets.bottom - 40,
          },
        ]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Balance</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <View style={styles.contentContainer}>
            {/* Current Balance Display */}
            <View style={styles.balanceCard}>
              <View style={styles.balanceIconContainer}>
                <Ionicons name="wallet" size={24} color="#4F46E5" />
              </View>
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text style={styles.balanceAmount}>${currentBalance.toFixed(2)}</Text>
              </View>
            </View>

            <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
              <TouchableOpacity activeOpacity={1}>
                <Text style={styles.sectionTitle}>Choose Amount</Text>
                {availableOptions.map((option) => (
                  <BalancePurchaseItem
                    key={option.productId}
                    option={option}
                    product={getProductForOption(option.productId)}
                    requestPurchase={requestPurchase}
                  />
                ))}
              </TouchableOpacity>

              {/* Legal Text */}
              <View style={styles.legalContainer}>
                <Text style={styles.legalText}>
                  Payment will be charged to your{' '}
                  {Platform.OS === 'ios' ? 'Apple ID' : 'Google Play'} account. Balance is
                  non-refundable and non-transferable. You can manage your purchases in your{' '}
                  {Platform.OS === 'ios' ? 'App Store' : 'Google Play'} account settings.
                </Text>

                <View style={styles.legalLinks}>
                  <TouchableOpacity
                    onPress={() =>
                      openURL(
                        termsOfUseUrl ??
                          legal.mvbTemrsOfUse ??
                          'https://myvirtualboss.com/privacy-policy/'
                      )
                    }>
                    <Text style={styles.legalLinkText}>Terms of Use</Text>
                  </TouchableOpacity>
                  <Text style={styles.legalSeparator}> • </Text>
                  <TouchableOpacity
                    onPress={() =>
                      openURL(
                        privacyPolicyUrl ??
                          legal.mvbPolicy ??
                          'https://myvirtualboss.com/privacy-policy/'
                      )
                    }>
                    <Text style={styles.legalLinkText}>Privacy Policy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: theme.colors.headerBackground,
    flex: 1,
  },
  modalContent: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    width: '100%',
  },
  closeButton: {
    padding: 4,
    position: 'absolute',
    right: 24,
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  balanceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  optionsContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  legalContainer: {
    marginTop: 24,
    paddingTop: 16,
    marginBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  legalText: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalLinkText: {
    fontSize: 11,
    color: '#4F46E5',
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 11,
    color: '#6B7280',
  },
});
