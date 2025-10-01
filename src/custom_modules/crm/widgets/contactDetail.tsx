import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Header } from '../../../codidge_components/UI/header';
import { Card } from '../../../codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { IContact, IFollowUp } from '../interfaces';
import ContactForm from './addContact';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import { useAddFollowUp } from '../hooks/followUpCreation';

import Constants from 'expo-constants';
import { AddFollowUpModal } from './followUps/followUpForm';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import {
  getCategoryColors,
  getUserInitials,
  handleCallContact,
  handleEmailContact,
  handleSmsContact,
} from '../helpers';
const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const ContactDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { contact: contactRuote } = route.params as { contact: IContact };

  const customer = useReactiveVar(userData);

  const [followUpCreationModal, setFollowUpCreationModal] = useState(false);

  const { addFollowUp, addingFollowUp } = useAddFollowUp({
    tenantId,
    onCompleted: () => setFollowUpCreationModal(false),
  });

  const [contact, setContact] = useState(contactRuote);

  const [modal, setmodal] = useState(false);
  const categoryColors = getCategoryColors(contact.category ?? '');

  return (
    <PageSafeContainer style={styles.container}>
      <Header
        title="Contact Details"
        showBack
        onBack={() => {
          navigation.goBack();
        }}
        rightText="Edit"
        rightAction={() => {
          setmodal(true);
        }}
      />

      <ScrollView style={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: categoryColors.bg,
                },
              ]}>
              <Text style={[styles.initials, { color: categoryColors.text }]}>
                {getUserInitials(contact.firstName, contact.lastName)}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={{ flexDirection: 'row', gap: 2 }}>
                <Text style={styles.profileName}>{contact.firstName}</Text>
                <Text style={styles.profileName}> {contact.lastName}</Text>
              </View>
              <Text style={styles.profileStatus}>{contact?.category?.toUpperCase()}</Text>
            </View>
            <OutlineButton
              onPress={() => {
                setFollowUpCreationModal(true);
              }}
              title="Follow Up"
            />
          </View>

          <View style={styles.contactInfo}>
            {contact.email && (
              <View style={styles.contactItem}>
                <Icons.Mail size={20} color="#6B7280" />
                <Text style={styles.contactText}>{contact.email}</Text>
              </View>
            )}
            {contact.phone && (
              <View style={styles.contactItem}>
                <Icons.Phone size={20} color="#6B7280" />
                <Text style={styles.contactText}>{contact.phone}</Text>
              </View>
            )}
          </View>

          <View style={styles.actions}>
            {contact.phone && (
              <TouchableOpacity
                onPress={() => handleCallContact(contact.phone)}
                style={styles.actionButton}>
                <Icons.Phone size={18} color="#2563EB" />
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>
            )}
            {contact.phone && (
              <TouchableOpacity
                onPress={() => handleSmsContact(contact.phone)}
                style={styles.actionButton}>
                <Icons.MessageCircle size={18} color="#10B981" />
                <Text style={styles.actionText}>SMS</Text>
              </TouchableOpacity>
            )}
            {contact.email && (
              <TouchableOpacity
                onPress={() => handleEmailContact(contact.email)}
                style={styles.actionButton}>
                <Icons.Mail size={18} color="#8B5CF6" />
                <Text style={styles.actionText}>Email</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {contact.notes && (
          <Card style={styles.notesCard}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{contact.notes}</Text>
          </Card>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setmodal(false);
        }}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ContactForm
            disposeModalHandler={(contact?: IContact) => {
              setmodal(false);
              if (contact) {
                setContact(contact);
              }
            }}
            contact={contact}
          />
        </View>
      </Modal>
      <AddFollowUpModal
        onClose={() => {
          setFollowUpCreationModal(false);
        }}
        defaultContact={contact}
        loading={addingFollowUp}
        visible={followUpCreationModal}
        onSave={async (newFollowUp: Partial<IFollowUp>) => {
          try {
            await addFollowUp({
              variables: {
                tenant: {
                  tenantId,
                },
                input: {
                  userId: customer?.id,
                  date: newFollowUp.date,
                  notes: newFollowUp.notes,
                  title: newFollowUp.title,
                  contact: newFollowUp.contact,
                  time: newFollowUp.time,
                },
              },
            });
          } catch (error) {
            console.log('::error');
          }
        }}
      />
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    padding: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initials: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInfo: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  contactInfo: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  activityCard: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  notesCard: {
    padding: 20,
    marginBottom: 16,
  },
  notesText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  editNotesButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editNotesText: {
    fontSize: 16,
    color: '#2563EB',
    marginLeft: 8,
    fontWeight: '600',
  },
});
