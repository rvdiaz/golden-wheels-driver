import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert, Linking } from 'react-native';
import * as Icons from 'lucide-react-native';
import { ModuleKeys } from '~/store/interface';
import { useNavigation } from '@react-navigation/native';
import { IContact } from '../interfaces';
import { useMutation, useReactiveVar } from '@apollo/client';
import { deleteContactMutation, updateContactMutation } from '../graphql/mutations';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { getUserContacts } from '../graphql/queries';
import {
  getCategoryColors,
  getUserInitials,
  handleCallContact,
  handleEmailContact,
  handleSmsContact,
} from '../helpers';
import IconButton from '~/codidge_components/UI/button/IconButton';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const ContactCard = ({ contact }: { contact: IContact }) => {
  const customer = useReactiveVar(userData);
  const navigation = useNavigation();

  // Get category colors
  const categoryColors = getCategoryColors(contact.category ?? '');

  const [deleteContactFn] = useMutation<{ deleteUserContact: string }>(deleteContactMutation, {
    update: (cache, { data: mutationData }) => {
      if (!mutationData?.deleteUserContact) return;

      const deletedContact: string = mutationData.deleteUserContact;

      const existingData: any = cache.readQuery({
        query: getUserContacts,
        variables: {
          tenant: { tenantId },
          userId: customer?.id,
        },
      });

      if (existingData) {
        const updatedContacts = existingData.getUserContacts.filter(
          (income: IContact) => income.id !== deletedContact
        );

        cache.writeQuery({
          query: getUserContacts,
          variables: {
            tenant: { tenantId },
            userId: customer?.id,
          },
          data: {
            getUserContacts: updatedContacts,
          },
        });
      }
    },
  });

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(ModuleKeys.contactDetals, { contact });
      }}
      style={styles.contactCard}>
      <View style={styles.contactRow}>
        {/* Avatar with initials */}
        <View
          style={[
            styles.avatarContainer,
            {
              backgroundColor: categoryColors.bg,
            },
          ]}>
          <Text style={[styles.initialsText, { color: categoryColors.text }]}>
            {getUserInitials(contact.firstName, contact.lastName)}
          </Text>
        </View>

        {/* Contact info */}
        <View style={styles.contactInfo}>
          <View style={styles.contactNameSection}>
            <Text style={styles.contactName}>
              {contact.firstName} {contact.lastName}
            </Text>
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

        {/* Action buttons */}
        <View style={styles.contactActions}>
          <IconButton
            onPress={() => handleCallContact(contact.phone ?? '')}
            icon={<Icons.Phone size={18} />}
          />
          <IconButton
            onPress={() => handleSmsContact(contact.phone ?? '')}
            icon={<Icons.MessageCircle size={18} />}
          />
          <IconButton
            onPress={() => handleEmailContact(contact.email ?? '')}
            icon={<Icons.Mail size={18} />}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contactCard: {
    marginBottom: 24,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialsText: {
    fontSize: 16,
    fontWeight: '700',
  },
  contactInfo: {
    flex: 1,
    marginRight: 12,
  },
  contactNameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  followUpBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  followUpText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92400E',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  contactActions: {
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',
  },
  actionButton: {
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
});
