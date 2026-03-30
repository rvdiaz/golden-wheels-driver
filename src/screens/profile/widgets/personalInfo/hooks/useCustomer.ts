import { useMutation, useReactiveVar } from '@apollo/client';
import { Alert } from 'react-native';
import { userData, updateUser } from '~/store/user';
import { ENV_Vars } from '~/store/env';
import { updateCustomerMutation } from '../graphql/mutations';

interface PersonalInfoFormData {
  name: string;
  phone: string;
  preferenceLanguage?: string;
}

export const usePersonalInfo = () => {
  const user = useReactiveVar(userData);

  const [updateCustomer, { loading: loadingUpdate }] = useMutation(updateCustomerMutation);

  const handleUpdateProfile = async (fields: Partial<PersonalInfoFormData & { image: string }>) => {
    if (!user?.id) return;

    try {
      const { data } = await updateCustomer({
        variables: {
          tenant: ENV_Vars.tenant,
          customerId: user.id,
          customer: fields,
        },
      });

      const updated = data?.updateCustomer;
      if (!updated) return;

      // Sync local store so UI updates everywhere immediately
      await updateUser({
        ...user,
        name: updated.name ?? user.name,
        phone: updated.phone ?? user.phone,
        image: updated.image ?? user.image,
        preferenceLanguage: updated.preferenceLanguage ?? user.preferenceLanguage,
      });

      // ✅ Success alert
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('[Profile] Update failed:', error);
      Alert.alert('Update Failed', 'Could not save changes. Please try again.');
    }
  };

  return {
    user,
    loadingUpdate,
    handleUpdateProfile,
  };
};
