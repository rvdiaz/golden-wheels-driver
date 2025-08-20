import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import * as Icons from 'lucide-react-native';

import { useForm, Controller } from 'react-hook-form';
import { UserPlus } from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { IContact } from '../interfaces';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { useMutation, useReactiveVar } from '@apollo/client';
import { addContactMutation, updateContactMutation } from '../graphql/mutations';
import { userData } from '~/store/user';
import Constants from 'expo-constants';
import { getUserContacts } from '../graphql/queries';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export default function ContactForm({
  disposeModalHandler,
  contact,
}: {
  disposeModalHandler: (contact?: IContact) => void;
  contact?: IContact;
}) {
  const customer = useReactiveVar(userData);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<IContact>({
    defaultValues: {
      firstName: contact?.firstName ?? '',
      lastName: contact?.lastName ?? '',
      phone: contact?.phone ?? '',
      email: contact?.email ?? '',
      address: contact?.address ?? '',
      notes: contact?.notes ?? '',
      category: contact?.category ?? 'buyer',
      priority: contact?.priority ?? 'medium',
      type: contact?.type ?? 'lead',
      leadStatus: contact?.leadStatus ?? 'new',
    },
    mode: 'onChange',
  });

  const [addContactFn, { loading }] = useMutation<{ addUserContact: IContact }>(
    addContactMutation,
    {
      update(cache, { data }) {
        if (!data?.addUserContact) return;

        const newContact = data.addUserContact;

        // Read existing contacts from cache
        const existingData = cache.readQuery<{ getUserContacts: IContact[] }>({
          query: getUserContacts,
          variables: {
            tenant: { tenantId },
            userId: customer?.id,
          },
        });

        if (existingData?.getUserContacts) {
          cache.writeQuery({
            query: getUserContacts,
            variables: {
              tenant: { tenantId },
              userId: customer?.id,
            },
            data: {
              getUserContacts: [...existingData.getUserContacts, newContact],
            },
          });
        }
      },
    }
  );

  const [updateContactFn, { data, loading: loadingUpdate }] = useMutation<{
    updateUserContact: IContact;
  }>(updateContactMutation, {
    update(cache, { data }) {
      if (!data?.updateUserContact) return;

      const updatedContact = data.updateUserContact;

      // Read the existing contacts from cache
      const existingData = cache.readQuery<{ getUserContacts: IContact[] }>({
        query: getUserContacts,
        variables: {
          tenant: { tenantId },
          userId: customer?.id,
        },
      });

      if (existingData?.getUserContacts) {
        // Replace the updated contact in the array
        const newContacts = existingData.getUserContacts.map((contact) =>
          contact.id === updatedContact.id ? updatedContact : contact
        );

        // Write the updated list back to cache
        cache.writeQuery({
          query: getUserContacts,
          variables: {
            tenant: { tenantId },
            userId: customer?.id,
          },
          data: {
            getUserContacts: newContacts,
          },
        });
      }
    },
  });

  const onSubmit = async (data: IContact) => {
    try {
      if (contact?.id) {
        // Update existing contact
        const res = await updateContactFn({
          variables: {
            tenant: { tenantId },
            userId: customer?.id,
            contactId: contact.id,
            contactData: data,
          },
        });

        const updatedContact = res.data?.updateUserContact;

        if (updatedContact) {
          // Reset form to updated contact values
          reset({
            firstName: updatedContact.firstName ?? '',
            lastName: updatedContact.lastName ?? '',
            phone: updatedContact.phone ?? '',
            email: updatedContact.email ?? '',
            address: updatedContact.address ?? '',
            notes: updatedContact.notes ?? '',
            category: updatedContact.category ?? 'buyer',
            priority: updatedContact.priority ?? 'medium',
            type: updatedContact.type ?? 'lead',
            leadStatus: updatedContact.leadStatus ?? 'new',
          });
        }

        Alert.alert('Success', 'Contact was updated successfully!');
      } else {
        // Add new contact
        await addContactFn({
          variables: {
            tenant: { tenantId },
            userId: customer?.id,
            contactData: data,
          },
        });

        reset({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          address: '',
          notes: '',
          category: 'buyer',
          priority: 'medium',
          type: 'lead',
          leadStatus: 'new',
        });

        Alert.alert('Success', 'Contact was added successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Error adding contact!');
      console.log('data', data);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="New Contact"
        rightAction={() => {
          if (contact?.id) {
            const updatedContact = data?.updateUserContact;
            disposeModalHandler(updatedContact);
          } else {
            disposeModalHandler();
          }
        }}
        rightText="Close"
      />

      <ScrollView
        style={styles.form}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formContent}>
        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <View
            style={{
              flex: 1,
            }}>
            <Controller
              control={control}
              name="firstName"
              rules={{
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  leftIcon={<Icons.User size={16} color="#6B7280" style={styles.inputIcon} />}
                  label="First name"
                  placeholder="First name"
                  placeholderTextColor="#9ca3af"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.firstName}
                  errorMessage={errors.firstName?.message}
                />
              )}
            />
          </View>
          <View
            style={{
              flex: 1,
            }}>
            <Controller
              control={control}
              name="lastName"
              rules={{
                required: 'Last Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Last name"
                  placeholder="Last name"
                  placeholderTextColor="#9ca3af"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.firstName}
                  errorMessage={errors.firstName?.message}
                />
              )}
            />
          </View>
        </View>

        {/* Phone Field */}
        <View style={styles.fieldContainer}>
          <View
            style={{
              flex: 1,
            }}>
            <Controller
              control={control}
              name="phone"
              rules={{
                required: 'Phone number is required',
                pattern: {
                  value: /^[\+]?[1-9][\d]{0,15}$/,
                  message: 'Please enter a valid phone number',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  leftIcon={<Icons.Phone size={16} color="#6B7280" style={styles.inputIcon} />}
                  label="Phone"
                  placeholder="(555) 123-4567"
                  placeholderTextColor="#9ca3af"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  error={!!errors.phone}
                  errorMessage={errors.phone?.message}
                />
              )}
            />
          </View>
        </View>
        <View style={styles.fieldContainer}>
          <View
            style={{
              flex: 1,
            }}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  leftIcon={<Icons.Mail size={16} color="#6B7280" style={styles.inputIcon} />}
                  label="Email"
                  placeholder="email@example.com"
                  placeholderTextColor="#9ca3af"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!errors.email}
                  errorMessage={errors.email?.message}
                />
              )}
            />
          </View>
        </View>

        {/* Address Field */}
        <View style={styles.fieldContainer}>
          <View
            style={{
              flex: 1,
            }}>
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  leftIcon={<Icons.Map size={16} color="#6B7280" style={styles.inputIcon} />}
                  label="Address"
                  placeholder="123 Main St, City, State 12345"
                  placeholderTextColor="#9ca3af"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
        </View>
        {/* Notes Field */}
        <View style={styles.fieldContainer}>
          <View
            style={{
              flex: 1,
            }}>
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Notes"
                  placeholder="Additional notes"
                  placeholderTextColor="#9ca3af"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{
                    minHeight: 80,
                  }}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBarContainer}>
        {/* Submit Button */}
        <PrimaryButton
          loading={loading || loadingUpdate}
          onPress={handleSubmit(onSubmit)}
          size={ButtonSize.LARGE}
          disabled={!isValid}
          title="Save Contact"
          rightWidget={<UserPlus size={20} color="#ffffff" />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  form: {
    flex: 1,
    padding: 24,
  },
  formContent: {
    paddingBottom: 100,
  },
  fieldContainer: {
    marginBottom: 10,
    gap: 10,
    flexDirection: 'row',
  },
  bottomBarContainer: {
    paddingHorizontal: 20,
  },
  inputIcon: {
    marginLeft: 16,
  },
});
