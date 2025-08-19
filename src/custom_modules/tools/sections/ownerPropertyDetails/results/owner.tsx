import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { Property } from './property';
import { IEmail, IOwnerInfo, IPhone, IProperty } from '../interfaces';
import TextButton from '~/codidge_components/UI/button/TextButton';
import { InfoItem } from './infoItem';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';

export const Owner = ({ ownerInfo }: { ownerInfo: IOwnerInfo }) => {
  return (
    <Card style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Icons.User size={24} color="#10B981" />
        <Text style={styles.resultTitle}>Owner Information</Text>
      </View>
      <InfoItem label="Owner Name" value={ownerInfo?.fullName} />
      <InfoItem label="Mailing Address" value={ownerInfo?.mailAddress?.address} />
      {ownerInfo?.phones?.map((phon: IPhone, index) => (
        <InfoItem key={`${phon.phone} ${index}`} label="Phone" value={phon.phoneDisplay} />
      ))}

      {ownerInfo?.email?.map((em: IEmail, index) => (
        <InfoItem
          key={`${em.email} ${index}`}
          label={em.emailType ? `Email(${em.emailType})` : ''}
          value={em.email}
        />
      ))}

      <View
        style={{
          flexDirection: 'row',
          marginTop: 5,
          gap: 10,
        }}>
        {ownerInfo?.phones?.length! > 0 && (
          <OutlineButton
            style={{
              flex: 1,
            }}
            title="Call Owner"
            leftWidget={<Icons.PhoneCall size={16} color="#2563EB" />}
          />
        )}

        {ownerInfo?.email?.length! > 0 && (
          <OutlineButton
            style={{
              flex: 1,
            }}
            title="Send Letter"
            leftWidget={<Icons.MailCheck size={16} color="#2563EB" />}
          />
        )}
      </View>
    </Card>
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
});
