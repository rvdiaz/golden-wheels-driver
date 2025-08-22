import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert, Linking } from 'react-native';
import * as Icons from 'lucide-react-native';
import { ModuleKeys } from '~/store/interface';
import { useNavigation } from '@react-navigation/native';
import { IContact } from '../interfaces';
import { getStatusColor, getTypeColor } from '../helpers';
import { useMutation, useReactiveVar } from '@apollo/client';
import { deleteContactMutation, updateContactMutation } from '../graphql/mutations';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { getUserContacts } from '../graphql/queries';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const ContactCard = ({ contact }: { contact: IContact }) => {
  const customer = useReactiveVar(userData);

  const statusColors = getStatusColor(contact.leadStatus);
  const typeColors = getTypeColor(contact.type);
  const navigation = useNavigation();

  const [updateContact] = useMutation<{ updateUserContact: IContact }>(updateContactMutation, {
    update(cache, { data }) {
      if (!data?.updateUserContact) return;
      const updatedContact = data.updateUserContact;

      cache.modify({
        fields: {
          getUserContacts(existingContactsRefs = [], { readField }) {
            return existingContactsRefs.map((contactRef: any) => {
              const id = readField('id', contactRef);
              if (id === updatedContact.id) {
                // Merge updatedContact directly into cache
                return { ...contactRef, ...updatedContact };
              }
              return contactRef;
            });
          },
        },
      });
    },
  });

  const [deleteContactFn] = useMutation<{ deleteUserContact: string }>(deleteContactMutation, {
    update: (cache, { data: mutationData }) => {
      if (!mutationData?.deleteUserContact) return;

      const deletedContact: string = mutationData.deleteUserContact;

      // Read existing cache
      const existingData: any = cache.readQuery({
        query: getUserContacts,
        variables: {
          tenant: { tenantId },
          userId: customer?.id,
        },
      });

      if (existingData) {
        // Filter out the deleted one
        const updatedContacts = existingData.getUserContacts.filter(
          (income: IContact) => income.id !== deletedContact
        );

        // Write the updated list back
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

  const handleCallContact = () => {
    if (!contact.phone) {
      Alert.alert('Error', 'No phone number available for this contact');
      return;
    }

    const url = `tel:${contact.phone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          updateContact({
            variables: {
              tenant: { tenantId },
              userId: customer?.id,
              contactId: contact.id,
              contactData: {
                followedUp: true,
              },
            },
          });
          Alert.alert('Error', 'Phone call not supported on this device');
        } else {
          if (!contact.followedUp) {
            updateContact({
              variables: {
                tenant: { tenantId },
                userId: customer?.id,
                contactId: contact.id,
                contactData: {
                  followedUp: true,
                },
              },
            });
          }
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('Error opening dialer', err));
  };

  const handleSmsContact = () => {
    if (!contact.phone) {
      Alert.alert('Error', 'No phone number available for this contact');
      return;
    }

    const url = `sms:${contact.phone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', 'SMS not supported on this device');
        } else {
          if (!contact.followedUp) {
            updateContact({
              variables: {
                tenant: { tenantId },
                userId: customer?.id,
                contactId: contact.id,
                contactData: {
                  followedUp: true,
                },
              },
            });
          }

          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('Error opening SMS app', err));
  };

  const handleEmailContact = () => {};

  const handleDelete = () => {
    Alert.alert('Delete Contact', 'Are you sure you want to delete this contact?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteContactFn({
              variables: {
                tenant: {
                  tenantId,
                },
                userId: customer?.id,
                contactId: contact.id,
              },
            });
          } catch (err) {
            Alert.alert('Error', 'Failed to delete income');
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(ModuleKeys.contactDetals, { contact });
      }}
      style={styles.contactCard}>
      <View style={styles.contactRow}>
        <View style={styles.contactInfo}>
          <View style={styles.contactNameSection}>
            <Text style={styles.contactName}>
              {contact.firstName} {contact.lastName}
            </Text>

            {/* Follow-up badge */}
            {!contact.followedUp && (
              <View style={styles.followUpBadge}>
                <Text style={styles.followUpText}>Follow Up</Text>
              </View>
            )}
          </View>

          <Text style={styles.contactNotes}>{contact.notes}</Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtonContainer}>
        <View style={styles.badgeContainer}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusColors.bg,
                borderColor: statusColors.border,
              },
            ]}>
            <Text style={[styles.badgeText, { color: statusColors.text }]}>{contact.category}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: typeColors.bg,
                borderColor: typeColors.border,
              },
            ]}>
            <Text style={[styles.badgeText, { color: typeColors.text }]}>{contact.type}</Text>
          </View>
        </View>
        <View style={styles.contactActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCallContact}>
            <Icons.Phone size={16} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSmsContact}>
            <Icons.MessageCircle size={16} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleEmailContact}>
            <Icons.Mail size={16} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Icons.Trash size={16} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contactNameSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactCard: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactDetails: {
    marginBottom: 12,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  contactNotes: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  lastContact: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
  followUpBadge: {
    backgroundColor: '#FBBF24', // yellow
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  followUpText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937', // dark text
  },
  actionButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});
