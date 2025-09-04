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

  return (
    <SafeAreaView style={styles.container}>
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
            <View style={styles.avatarContainer}>
              <Icons.User size={40} color="#6B7280" />
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
            <View style={styles.contactItem}>
              <Icons.Mail size={20} color="#6B7280" />
              <Text style={styles.contactText}>{contact.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Icons.Phone size={20} color="#6B7280" />
              <Text style={styles.contactText}>{contact.phone}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, styles.callButton]}>
              <Icons.Phone size={20} color="white" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.emailButton]}>
              <Icons.Mail size={20} color="white" />
              <Text style={styles.actionButtonText}>Email</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.activityCard}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Icons.Phone size={16} color="#2563EB" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Phone call - 15 minutes</Text>
              <Text style={styles.activityDate}>March 15, 2024</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Icons.Mail size={16} color="#10B981" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Email sent - Property details</Text>
              <Text style={styles.activityDate}>March 12, 2024</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.notesCard}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notesText}>{contact.notes}</Text>
        </Card>
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
    </SafeAreaView>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  callButton: {
    backgroundColor: '#2563EB',
  },
  emailButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
