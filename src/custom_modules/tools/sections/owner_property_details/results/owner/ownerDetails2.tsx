import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import * as Icons from 'lucide-react-native';
import { IEmail, IOwnerInfo, IPhone } from '../../interfaces';
import { InfoItem } from '../infoItem';
import Text from '~/codidge_components/UI/text';
import { Card } from '~/codidge_components/UI/card';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';
import TextButton from '~/codidge_components/UI/button/TextButton';
import {
  handleCallContact,
  handleEmailContact,
  handleSmsContact,
} from '~/custom_modules/crm/helpers';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { IUser } from '~/store/interface';
import { theme } from '~/theme/theme';
import IconButton from '~/codidge_components/UI/button/IconButton';

interface OwnerDetailsProps {
  ownerInfo: IOwnerInfo[];
  onBack: () => void;
  feature: 'expired' | 'propDetail';
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type?: 'email' | 'sms';
}

// Get default templates based on feature
const getDefaultTemplates = (
  feature: 'expired' | 'propDetail',
  ownerInfo: IOwnerInfo,
  agentInfo: IUser,
  type: 'email' | 'sms' = 'email'
): EmailTemplate[] => {
  const agentName = `${agentInfo.firstName} ${agentInfo.lastName}`;
  const homeOwnerName = `${ownerInfo?.owner1FirstName ?? ownerInfo?.owner2FirstName ?? ''}`;

  if (type === 'sms') {
    return feature === 'expired'
      ? [
          {
            id: 'sms1',
            name: '📱 Quick Check-in',
            subject: '',
            body: `Hi ${homeOwnerName}, I noticed your listing expired. Still interested in selling? I have some new strategies that might help. ${agentName}`,
            type: 'sms',
          },
          {
            id: 'sms2',
            name: '🏠 Follow-up Message',
            subject: '',
            body: `Hi, this is ${agentName}. Your property caught my attention. Would you be open to discussing selling options?`,
            type: 'sms',
          },
          {
            id: 'sms3',
            name: '✉️ Custom SMS',
            subject: '',
            body: '',
            type: 'sms',
          },
        ]
      : [
          {
            id: 'sms1',
            name: '📱 Property Interest',
            subject: '',
            body: `Hi, I'm interested in your property. Are you considering selling? ${agentName}`,
            type: 'sms',
          },
          {
            id: 'sms2',
            name: '✉️ Custom SMS',
            subject: '',
            body: '',
            type: 'sms',
          },
        ];
  }

  // Email templates
  if (feature === 'expired') {
    return [
      {
        id: 'exp1',
        name: '🏠 Expired Listing Follow-up',
        subject: 'Your Property Listing Has Expired',
        body: `Hi ${homeOwnerName},\n\nI noticed your property listing recently expired. If you're still interested in selling, I'd love to discuss how I can help you achieve your goals with a fresh marketing approach.\n\nBest regards,\n${agentName}`,
        type: 'email',
      },
      {
        id: 'exp2',
        name: '💼 Market Update & Opportunity',
        subject: 'Market Update for Your Property',
        body: `Dear ${homeOwnerName},\n\nThe market has shifted since your listing expired. I have buyers actively looking in your area and would love to share my insights on current market conditions.\n\nCould we schedule a brief call?\n\n${agentName}`,
        type: 'email',
      },
      {
        id: 'exp3',
        name: '✉️ Custom Message',
        subject: '',
        body: '',
        type: 'email',
      },
    ];
  } else {
    return [
      {
        id: 'prop1',
        name: '🏡 Property Interest',
        subject: 'Interest in Your Property',
        body: `Hi ${homeOwnerName},\n\nI'm reaching out regarding your property. I have clients who may be interested. Would you be open to a conversation?\n\nBest,\n${agentName}`,
        type: 'email',
      },
      {
        id: 'prop2',
        name: '📊 Free Market Analysis',
        subject: 'Complimentary Market Analysis for Your Property',
        body: `Dear ${homeOwnerName},\n\nI'd like to offer you a free, no-obligation market analysis of your property. This will give you insight into current market value and selling potential.\n\n${agentName}`,
        type: 'email',
      },
      {
        id: 'prop3',
        name: '✉️ Custom Message',
        subject: '',
        body: '',
        type: 'email',
      },
    ];
  }
};

// Phone component with action buttons
const PhoneItemWithActions: React.FC<{
  phone: IPhone;
  ownerInfo: IOwnerInfo;
  feature: 'expired' | 'propDetail';
  userinfo: IUser;
}> = ({ phone, ownerInfo, feature, userinfo }) => {
  const [smsModalVisible, setSmsModalVisible] = useState(false);
  const templates = getDefaultTemplates(feature, ownerInfo, userinfo, 'sms');

  const handleSmsTemplate = (template: EmailTemplate) => {
    setSmsModalVisible(false);
    if (template.body) {
      handleSmsContact(phone.phone ?? '', template.body);
    } else {
      // For custom SMS, just open with empty message
      handleSmsContact(phone.phone ?? '', '');
    }
  };

  return (
    <View
      style={{
        paddingVertical: 5,
      }}>
      <View style={styles.contactItemContainer}>
        <View style={styles.contactInfoSection}>
          <Text>{phone.phoneDisplay}</Text>
        </View>
        <View style={styles.actionButtonsContainer}>
          <IconButton
            style={{
              backgroundColor: theme.colors.info,
              padding: 8,
            }}
            onPress={() => handleCallContact(phone.phone ?? '')}
            icon={<Icons.Phone size={16} color={'#FFF'} />}
          />
          <IconButton
            style={{
              backgroundColor: theme.colors.success,
              padding: 8,
            }}
            onPress={() => setSmsModalVisible(true)}
            icon={<Icons.MessageSquare size={16} color={'#FFF'} />}
          />
        </View>
      </View>

      {/* SMS Template Modal */}
      <Modal transparent visible={smsModalVisible} animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setSmsModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose SMS Template</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={styles.templateOption}
                  onPress={() => handleSmsTemplate(template)}>
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templatePreview} numberOfLines={2}>
                    {template.body || 'Write your own message...'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextButton
              title="Cancel"
              style={{ marginTop: 10 }}
              textStyle={{ color: 'red' }}
              onPress={() => setSmsModalVisible(false)}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Email component with action button
const EmailItemWithAction: React.FC<{
  email: IEmail;
  ownerInfo: IOwnerInfo;
  feature: 'expired' | 'propDetail';
  userinfo: IUser;
}> = ({ email, ownerInfo, feature, userinfo }) => {
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const templates = getDefaultTemplates(feature, ownerInfo, userinfo, 'email');

  const handleEmailTemplate = (template: EmailTemplate) => {
    setEmailModalVisible(false);
    if (template.subject || template.body) {
      handleEmailContact(email.email!, template.subject, template.body);
    } else {
      // For custom email, open with empty subject and body
      handleEmailContact(email.email!, '', '');
    }
  };

  return (
    <>
      <View
        style={[
          styles.contactItemContainer,
          {
            marginTop: 5,
          },
        ]}>
        <View style={styles.contactInfoSection}>
          <Text>{email.email}</Text>
        </View>
        <IconButton
          style={{
            backgroundColor: theme.colors.primary,
            padding: 8,
          }}
          onPress={() => setEmailModalVisible(true)}
          icon={<Icons.Mail size={16} color={'#FFF'} />}
        />
      </View>

      {/* Email Template Modal */}
      <Modal transparent visible={emailModalVisible} animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setEmailModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Email Template</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={styles.templateOption}
                  onPress={() => handleEmailTemplate(template)}>
                  <Text style={styles.templateName}>{template.name}</Text>
                  {template.subject && (
                    <Text style={styles.templatePreview} numberOfLines={1}>
                      Subject: {template.subject}
                    </Text>
                  )}
                  <Text style={styles.templatePreview} numberOfLines={2}>
                    {template.body || 'Write your own message...'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextButton
              title="Cancel"
              style={{ marginTop: 10 }}
              textStyle={{ color: 'red' }}
              onPress={() => setEmailModalVisible(false)}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// Main component
export const OwnerDetailsConsolidated2: React.FC<OwnerDetailsProps> = ({
  ownerInfo,
  feature,
  onBack,
}) => {
  const userinfo = useReactiveVar(userData);

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
      <ScrollView
        style={{
          padding: 16,
        }}>
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
              {owner?.mailAddress?.address && (
                <InfoItem label="Mailing Address" value={owner?.mailAddress?.address} />
              )}

              {/* Phone numbers with action buttons */}
              {owner?.phones?.map((phone: IPhone, phoneIndex: number) => (
                <PhoneItemWithActions
                  key={`${phone.phone}-${phoneIndex}`}
                  phone={phone}
                  ownerInfo={owner}
                  feature={feature}
                  userinfo={userinfo!}
                />
              ))}

              {/* Emails with action button */}
              {owner?.email?.map((em: IEmail, emailIndex: number) => (
                <EmailItemWithAction
                  key={`${em.email}-${emailIndex}`}
                  email={em}
                  ownerInfo={owner}
                  feature={feature}
                  userinfo={userinfo!}
                />
              ))}

              {index < ownerInfo.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>
      </ScrollView>
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
  contactItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 0,
  },
  contactInfoSection: {
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1F2937',
  },
  templateOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  templateName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  templatePreview: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});
