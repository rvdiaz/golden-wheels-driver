import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import * as Icons from 'lucide-react-native';
import { IEmail, IOwnerInfo, IPhone } from '../../interfaces';
import TextButton from '~/codidge_components/UI/button/TextButton';
import Text from '~/codidge_components/UI/text';
import {
  handleCallContact,
  handleEmailContact,
  handleSmsContact,
} from '~/custom_modules/crm/helpers';
import { IUser } from '~/store/interface';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type?: 'email' | 'sms'; // Optional: to support SMS templates too
}

interface OwnerContactInfoProps {
  emailTemplates?: EmailTemplate[];
  feature: 'expired' | 'propDetail';
  ownerInfo: IOwnerInfo[];
}

// Get default templates based on feature
const getDefaultTemplates = (
  feature: 'expired' | 'propDetail',
  ownerInfo: IOwnerInfo,
  agentInfo: IUser
): EmailTemplate[] => {
  const agentName = `${agentInfo.firstName} ${agentInfo.lastName}`;
  const homeOwnerName = `${ownerInfo?.owner1FirstName ?? ownerInfo?.owner2FirstName ?? ''}`;
  if (feature === 'expired') {
    return [
      {
        id: 'exp1',
        name: '🏠 Expired Listing Follow-up',
        subject: 'Your Property Listing Has Expired',
        body: `Hi ${homeOwnerName},\n\nI noticed your property listing recently expired. If you're still interested in selling, I'd love to discuss how I can help you achieve your goals with a fresh marketing approach.\n\nBest regards,\n ${agentName}`,
        type: 'email',
      },
      {
        id: 'exp2',
        name: '📱 Quick Check-in (SMS)',
        subject: '',
        body: `Hi, I noticed your listing expired. Still interested in selling? I have some new strategies that might help. ${agentName}`,
        type: 'sms',
      },
      {
        id: 'exp3',
        name: '💼 Market Update & Opportunity',
        subject: 'Market Update for Your Property',
        body: `Dear ${homeOwnerName},\n\nThe market has shifted since your listing expired. I have buyers actively looking in your area and would love to share my insights on current market conditions.\n\nCould we schedule a brief call?\n\n${agentName}`,
        type: 'email',
      },
    ];
  } else {
    return [
      {
        id: 'prop1',
        name: '🏡 Property Interest',
        subject: 'Interest in Your Property',
        body: `Hi ${homeOwnerName},\n\nI'm reaching out regarding your property at [Address]. I have clients who may be interested. Would you be open to a conversation?\n\nBest,\n ${agentName}`,
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

export const OwnerContactInfo: React.FC<OwnerContactInfoProps> = ({
  emailTemplates,
  feature,
  ownerInfo,
}) => {
  const userinfo = useReactiveVar(userData);

  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<IEmail | null>(null);

  const templates = emailTemplates?.length
    ? emailTemplates
    : getDefaultTemplates(feature, ownerInfo[0], userinfo!);

  // Collect all phones and emails from all owners
  const allPhones: IPhone[] = [];
  const allEmails: IEmail[] = [];

  ownerInfo.forEach((owner) => {
    if (owner.phones) {
      allPhones.push(...owner.phones);
    }
    if (owner.email) {
      allEmails.push(...owner.email);
    }
  });

  const handleTemplateSelect = (template: EmailTemplate) => {
    setEmailModalVisible(false);

    // If it's an SMS template and we have phones
    if (template.type === 'sms' && allPhones?.length) {
      // For SMS, pass the body as the message parameter
      handleSmsContact(allPhones[0].phone ?? '', template.body);
    } else {
      // For email templates
      if (!selectedEmail && allEmails?.length) {
        Alert.alert('Please select an email address first');
        return;
      }
      const emailToUse = selectedEmail || allEmails?.[0];
      if (emailToUse) {
        // Open email with pre-filled template
        handleEmailContact(emailToUse.email!, template.subject, template.body);
      }
    }
  };

  const openEmailModal = () => {
    if (allEmails?.length === 1) {
      // If only one email, select it automatically
      setSelectedEmail(allEmails[0]);
    }
    setEmailModalVisible(true);
  };

  return (
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
      {/* Phone Button */}
      {allPhones?.length! > 0 && (
        <OutlineButton
          style={{ flex: 1 }}
          title="Call Owner"
          leftWidget={<Icons.PhoneCall size={16} color="#2563EB" />}
          onPress={() => setPhoneModalVisible(true)}
        />
      )}

      {/* Email Button */}
      {allEmails?.length! > 0 && (
        <OutlineButton
          style={{ flex: 1 }}
          title="Send Message"
          leftWidget={<Icons.MailCheck size={16} color="#2563EB" />}
          onPress={openEmailModal}
        />
      )}

      {/* Phone Modal */}
      <Modal transparent visible={phoneModalVisible} animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setPhoneModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Phone to Call</Text>
            {allPhones?.map((p, idx) => (
              <TouchableOpacity
                key={`${p.phone}-${idx}`}
                style={styles.modalOption}
                onPress={() => {
                  handleCallContact(p.phone ?? '');
                  setPhoneModalVisible(false);
                }}>
                <Icons.Phone size={20} color="#2563EB" style={{ marginRight: 8 }} />
                <Text style={styles.optionText}>{p.phoneDisplay}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Email Template Modal */}
      <Modal transparent visible={emailModalVisible} animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setEmailModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Contact Method</Text>

            {/* Email Selection if multiple */}
            {allEmails && allEmails.length > 1 && !selectedEmail && (
              <>
                <Text style={styles.sectionTitle}>Select Email:</Text>
                {allEmails.map((em, idx) => (
                  <TouchableOpacity
                    key={`${em.email}-${idx}`}
                    style={styles.modalOption}
                    onPress={() => setSelectedEmail(em)}>
                    <Icons.Mail size={20} color="#2563EB" />
                    <View style={{ marginLeft: 8, flex: 1 }}>
                      <Text style={styles.optionText}>{em.email}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Template Selection */}
            {(selectedEmail || allEmails?.length === 1) && (
              <>
                <Text style={styles.sectionTitle}>
                  Select Template for: {selectedEmail?.email || allEmails?.[0]?.email}
                </Text>
                <ScrollView style={{ maxHeight: 300 }}>
                  {templates.map((template) => (
                    <TouchableOpacity
                      key={template.id}
                      style={styles.templateOption}
                      onPress={() => handleTemplateSelect(template)}>
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

                {/* Back button if selecting template */}
                {allEmails && allEmails.length > 1 && (
                  <TextButton
                    title="← Back to emails"
                    style={{ marginTop: 10 }}
                    onPress={() => setSelectedEmail(null)}
                  />
                )}
              </>
            )}

            <TextButton
              title="Cancel"
              style={{ marginTop: 10 }}
              textStyle={{ color: 'red' }}
              onPress={() => {
                setEmailModalVisible(false);
                setSelectedEmail(null);
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 12,
    color: '#6B7280',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  optionText: {
    fontSize: 15,
    color: '#1F2937',
  },
});
