import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import * as Icons from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { UserPlus } from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { ContactType, IContact } from '../interfaces';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { useMutation, useReactiveVar } from '@apollo/client';
import { addContactMutation, updateContactMutation } from '../graphql/mutations';
import { userData } from '~/store/user';
import Constants from 'expo-constants';
import { getUserContacts } from '../graphql/queries';
import DropdownComponent from '~/codidge_components/UI/dropdown';
import { CONTACT_CATEGORY_OPTIONS, CONTACT_TYPE_OPTIONS } from '../helpers';
import { DateInputField } from '~/codidge_components/UI/form/inputs/datePicker';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export default function ContactForm({
  disposeModalHandler,
  contact,
}: {
  disposeModalHandler: (contact?: IContact) => void;
  contact?: IContact;
}) {
  const customer = useReactiveVar(userData);

  const defaultFollowUpDate = new Date();
  defaultFollowUpDate.setDate(defaultFollowUpDate.getDate() + 1);
  const followUpISO = defaultFollowUpDate.toISOString();

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
      category: contact?.category,
      priority: contact?.priority ?? 'medium',
      type: contact?.type ?? ContactType.LEAD,
      leadStatus: contact?.leadStatus ?? 'new',
      followUp: contact?.followUp ?? followUpISO,
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
            category: updatedContact.category ?? undefined,
            priority: updatedContact.priority ?? 'medium',
            type: updatedContact.type ?? ContactType.LEAD,
            leadStatus: updatedContact.leadStatus ?? 'new',
          });
        }

        disposeModalHandler(updatedContact);
      } else {
        // Add new contact
        await addContactFn({
          variables: {
            tenant: { tenantId },
            userId: customer?.id,
            contactData: {
              ...data,
              followedUp: false,
            },
          },
        });

        reset({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          address: '',
          notes: '',
          category: undefined,
          priority: 'medium',
          type: ContactType.LEAD,
          leadStatus: 'new',
        });

        disposeModalHandler();
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
                  leftIcon={<Icons.User size={16} color="#6B7280" />}
                  label="First name"
                  required={true}
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
                  required={true}
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
                  leftIcon={<Icons.Phone size={16} color="#6B7280" />}
                  label="Phone"
                  required={true}
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
                  leftIcon={<Icons.Mail size={16} color="#6B7280" />}
                  label="Email"
                  required={true}
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

        {/* Category Field */}
        <View style={styles.fieldContainer}>
          <View
            style={{
              flex: 1,
            }}>
            <Controller
              control={control}
              name="category"
              rules={{
                required: 'Category is required',
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <DropdownComponent
                  label="Category"
                  required={true}
                  data={CONTACT_CATEGORY_OPTIONS}
                  placeholder="Select contact category"
                  value={value ?? ''}
                  onChange={onChange}
                  error={!!error}
                  errorMessage={error?.message}
                  icon={<Icons.User size={16} color="gray" />} // custom icon
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
              name="type"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <DropdownComponent
                  label="Type"
                  required={true}
                  data={CONTACT_TYPE_OPTIONS}
                  placeholder="Select contact type"
                  value={value ?? ContactType.LEAD}
                  onChange={onChange}
                  error={!!error}
                  errorMessage={error?.message}
                  icon={<Icons.UserCircle size={16} color="gray" />} // custom icon
                />
              )}
            />
          </View>
        </View>
        {/* Follow Up */}
        <View style={styles.fieldContainer}>
          <View
            style={{
              flex: 1,
            }}>
            <Controller
              control={control}
              name="followUp"
              render={({ field: { onChange, value } }) => (
                <DateInputField
                  label="Follow up date"
                  value={value as Date}
                  onChangeText={onChange}
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
                  leftIcon={<Icons.Map size={16} color="#6B7280" />}
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
});
