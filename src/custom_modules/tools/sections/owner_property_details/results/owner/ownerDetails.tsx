import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import * as Icons from 'lucide-react-native';
import { IEmail, IOwnerInfo, IPhone } from '../../interfaces';
import { InfoItem } from '../infoItem';
import { OwnerContactInfo } from './contactOwner';
import Text from '~/codidge_components/UI/text';
import { Card } from '~/codidge_components/UI/card';

interface OwnerDetailsProps {
  ownerInfo: IOwnerInfo[];
  onBack: () => void;
  feature: 'expired' | 'propDetail';
}

// Alternative: Consolidated view with all owners in one card
export const OwnerDetailsConsolidated: React.FC<OwnerDetailsProps> = ({
  ownerInfo,
  feature,
  onBack,
}) => {
  if (!ownerInfo || ownerInfo.length === 0) {
    return (
      <Card style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Icons.UserX size={24} color="#EF4444" />
          <Text style={styles.resultTitle}>No Owner Information Available</Text>
        </View>
      </Card>
    );
  }

  return (
    <PageSafeContainer>
      <Header title="Owner Info" onBack={onBack} showBack={true} />
      <ScrollView>
        <Card style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Icons.Users size={24} color="#10B981" />
            <Text style={styles.resultTitle}>
              Owner Information {ownerInfo.length > 1 && `(${ownerInfo.length} owners)`}
            </Text>
          </View>

          {/* Display each owner's information */}
          {ownerInfo.map((owner, index) => (
            <View key={`owner-${index}`} style={styles.ownerSection}>
              {ownerInfo.length > 1 && <Text style={styles.ownerSubtitle}>Owner {index + 1}</Text>}
              <InfoItem label="Owner Name" value={owner?.fullName} />
              <InfoItem label="Mailing Address" value={owner?.mailAddress?.address} />

              {owner?.phones?.map((phone: IPhone, phoneIndex: number) => (
                <InfoItem
                  key={`${phone.phone}-${phoneIndex}`}
                  label={phone.phone ? `Phone (${phone.phone})` : 'Phone'}
                  value={phone.phoneDisplay}
                />
              ))}

              {owner?.email?.map((em: IEmail, emailIndex: number) => (
                <InfoItem
                  key={`${em.email}-${emailIndex}`}
                  label={em.emailType ? `Email (${em.emailType})` : 'Email'}
                  value={em.email}
                />
              ))}

              {index < ownerInfo.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>
      </ScrollView>
      {/* Single contact section with all phones and emails */}
      <View style={styles.contactSection}>
        <OwnerContactInfo
          feature={feature}
          ownerInfo={ownerInfo} // Pass first owner for name reference
        />
      </View>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  resultCard: {
    padding: 20,
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  ownerSection: {
    marginBottom: 16,
  },
  ownerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  contactSection: {
    paddingTop: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  tabContainer: {
    marginBottom: 16,
    maxHeight: 44,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  ownerContent: {
    marginTop: 8,
  },
});

// Also need to import TouchableOpacity for tabs
import { TouchableOpacity } from 'react-native';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';
