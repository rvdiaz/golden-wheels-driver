import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Header } from '../../../codidge_components/UI/header';
import * as Icons from 'lucide-react-native';
import { IContact, IFollowUp } from '../interfaces';
import ContactForm from './formContact';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import { useAddFollowUp } from '../hooks/followUpCreation';

import Constants from 'expo-constants';
import { AddFollowUpModal } from './followUps/followUpForm';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import {
  capitalize,
  formatPhoneNumber,
  getCategoryColors,
  getUserInitials,
  handleCallContact,
  handleEmailContact,
  handleSmsContact,
} from '../helpers';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import TextButton from '~/codidge_components/UI/button/TextButton';
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
        title=""
        showBack
        onBack={() => {
          navigation.goBack();
        }}
        rightWidget={
          <TextButton
            onPress={() => {
              setmodal(true);
            }}
            textStyle={{
              color: theme.colors.primary,
            }}
            leftWidget={
              <Icons.Pencil
                size={14}
                color={theme.colors.primary}
                style={{
                  marginRight: 5,
                }}
              />
            }
            size={ButtonSize.LARGE}
            title="Edit"
          />
        }
        contentContainerStyle={{
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
        }}
      />
      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
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
              {/* Category badge */}
              <View
                style={[
                  styles.categoryBadge,
                  {
                    backgroundColor: categoryColors.bg,
                  },
                ]}>
                <Text style={[styles.categoryText, { color: categoryColors.text }]}>
                  {contact.category ? contact.category?.toUpperCase() : ''}
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              {contact.phone && (
                <PrimaryButton
                  style={{
                    backgroundColor: theme.colors.baseGray,
                    flex: 1,
                  }}
                  textStyle={{
                    color: theme.colors.textColor,
                  }}
                  leftWidget={<Icons.Phone size={16} color={theme.colors.textColor} />}
                  title="Call"
                />
              )}
              {contact.phone && (
                <PrimaryButton
                  onPress={() => handleSmsContact(contact.phone)}
                  style={{
                    backgroundColor: theme.colors.baseGray,
                    flex: 1,
                  }}
                  textStyle={{
                    color: theme.colors.textColor,
                  }}
                  leftWidget={<Icons.MessageCircle size={16} color={theme.colors.textColor} />}
                  title="SMS"
                />
              )}

              {contact.email && (
                <PrimaryButton
                  onPress={() => handleEmailContact(contact.email)}
                  style={{
                    backgroundColor: theme.colors.baseGray,
                    flex: 1,
                  }}
                  textStyle={{
                    color: theme.colors.textColor,
                  }}
                  leftWidget={<Icons.Mail size={16} color={theme.colors.textColor} />}
                  title="Email"
                />
              )}
            </View>
          </View>

          <View style={styles.contactInfo}>
            {contact.email && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Full name</Text>
                <Text style={styles.contactText}>
                  {capitalize(contact.firstName)} {capitalize(contact.lastName)}
                </Text>
              </View>
            )}
            {contact.address && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Address</Text>
                <Text style={styles.contactText}>{contact.address}</Text>
              </View>
            )}
            {contact.email && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Email Address</Text>
                <Text style={styles.contactText}>{contact.email}</Text>
              </View>
            )}
            {contact.phone && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Phone number</Text>
                <Text style={styles.contactText}>{formatPhoneNumber(contact.phone)}</Text>
              </View>
            )}
          </View>
        </View>

        {contact.notes && (
          <View style={styles.notesCard}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{contact.notes}</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          onPress={() => {
            setFollowUpCreationModal(true);
          }}
          size={ButtonSize.LARGE}
          title="Follow Up"
        />
      </View>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileCard: {
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  initials: {
    fontSize: 14,
    fontWeight: '400',
  },
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileInfo: {
    flex: 1,
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 16,
    marginTop: 20,
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
    fontWeight: '600',
    color: theme.colors.textColor,
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  contactInfo: {
    marginBottom: 20,
    gap: 20,
  },
  contactItem: {
    marginBottom: 12,
    gap: 8,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contactLabel: {
    fontSize: 16,
    color: theme.colors.textColor,
    fontWeight: '700',
  },
  contactText: {
    fontSize: 16,
    color: '#374151',
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
  categoryBadge: {
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    paddingHorizontal: 16,
  },
});
