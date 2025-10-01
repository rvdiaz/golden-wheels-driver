import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import * as Icons from 'lucide-react-native';
import { IEmail, IPhone } from '../../interfaces';
import TextButton from '~/codidge_components/UI/button/TextButton';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface OwnerContactInfoProps {
  phones?: IPhone[];
  emails?: IEmail[];
  emailTemplates?: EmailTemplate[];
}

export const OwnerContactInfo: React.FC<OwnerContactInfoProps> = ({
  phones,
  emails,
  emailTemplates = [],
}) => {
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<IEmail | null>(emails?.[0] || null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const openEmailModal = () => {
    setSelectedEmail(emails?.[0] || null);
    setSelectedTemplate(null);
    setEmailSubject('');
    setEmailBody('');
    setEmailModalVisible(true);
  };

  const applyTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEmailSubject(template.subject);
    setEmailBody(template.body);
  };

  return (
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
      {/* Phone Button */}
      {phones?.length! > 0 && (
        <OutlineButton
          style={{ flex: 1 }}
          title="Call Owner"
          leftWidget={<Icons.PhoneCall size={16} color="#2563EB" />}
          onPress={() => setPhoneModalVisible(true)}
        />
      )}

      {/* Email Button */}
      {emails?.length! > 0 && (
        <OutlineButton
          style={{ flex: 1 }}
          title="Send Letter"
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
            {phones?.map((p, idx) => (
              <TouchableOpacity
                key={`${p.phone}-${idx}`}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedPhone(p.phone ?? '');
                  setPhoneModalVisible(false);
                  // Trigger phone call if desired
                  // Linking.openURL(`tel:${p.phone}`);
                }}>
                <Text style={styles.optionText}>{p.phoneDisplay}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Email Modal - Full Screen */}
      <Modal visible={emailModalVisible} animationType="slide">
        <View style={styles.fullScreenModal}>
          <Text style={styles.modalTitle}>Send Email</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Select Email */}
            <Text style={styles.label}>Select Recipient:</Text>
            {emails?.map((em, idx) => (
              <TouchableOpacity
                key={`${em.email}-${idx}`}
                style={[
                  styles.emailOption,
                  selectedEmail?.email === em.email && styles.emailOptionSelected,
                ]}
                onPress={() => setSelectedEmail(em)}>
                <Text
                  style={[
                    styles.optionText,
                    { color: selectedEmail?.email === em.email ? 'white' : 'gray' },
                  ]}>
                  {em.emailType ? `${em.emailType}: ` : ''}
                  {em.email}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Select Template */}
            {emailTemplates.length > 0 && (
              <>
                <Text style={styles.label}>Select Template:</Text>
                {emailTemplates.map((template) => (
                  <TouchableOpacity
                    key={template.id}
                    style={[
                      styles.emailOption,
                      selectedTemplate?.id === template.id && styles.emailOptionSelected,
                    ]}
                    onPress={() => applyTemplate(template)}>
                    <Text style={styles.optionText}>{template.name}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Subject & Body */}
            <Text style={styles.label}>Subject:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter subject"
              value={emailSubject}
              onChangeText={setEmailSubject}
            />

            <Text style={styles.label}>Message:</Text>
            <TextInput
              style={[styles.input, { height: 150 }]}
              placeholder="Enter message"
              multiline
              value={emailBody}
              onChangeText={setEmailBody}
            />

            {/* Send Button */}
            <OutlineButton
              title="Send Email"
              style={{ marginTop: 10 }}
              onPress={() => {
                emailModalVisible && setEmailModalVisible(false);
                // Trigger email API or Linking.openURL(...)
              }}
            />
            {/* Close Button */}
            <TextButton
              title="Cancel"
              style={{ marginTop: 10 }}
              textStyle={{ color: 'red' }}
              onPress={() => setEmailModalVisible(false)}
            />
          </ScrollView>
        </View>
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
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 100,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
  },
  emailOption: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: '#F3F4F6',
  },
  emailOptionSelected: {
    backgroundColor: '#2563EB',
  },
  optionText: {
    color: '#1F2937',
  },
  modalOption: {
    paddingVertical: 12,
  },
});
