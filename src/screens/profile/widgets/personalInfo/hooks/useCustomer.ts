import { useApolloClient, useMutation, useReactiveVar } from '@apollo/client';
import { Alert } from 'react-native';
import { userData, updateUser } from '~/store/user';
import { ENV_Vars } from '~/store/env';
import { deleteCustomerMutation, updateCustomerMutation } from '../graphql/mutations';
import { signOut } from 'aws-amplify/auth';
import { apiKeyClient } from '~/store/config/apolloClient';
import { IUser } from '~/store/user/interfaces';

interface PersonalInfoFormData {
  name: string;
  phone: string;
  preferenceLanguage?: string;
}

export const usePersonalInfo = () => {
  const user = useReactiveVar(userData);
  const client = useApolloClient();

  const [updateCustomer, { loading: loadingUpdate }] = useMutation<{
    updateCustomer: IUser;
  }>(updateCustomerMutation);
  const [deleteCustomer, { loading: loadingDeletion }] = useMutation(deleteCustomerMutation);

  const handleDeleteProfile = async () => {
    if (!user?.id) return;
    await deleteCustomer({
      variables: {
        tenant: ENV_Vars.tenant,
      },
    });
    await signOut();
    updateUser(null);
    await client.clearStore(); // Clears all cached data
    await apiKeyClient.clearStore();
    try {
    } catch (error) {}
  };

  const handleUpdateProfile = async (fields: Partial<PersonalInfoFormData & { image: string }>) => {
    if (!user?.id) return;

    try {
      const { data } = await updateCustomer({
        variables: {
          tenant: ENV_Vars.tenant,
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
      return updated;
    } catch (error) {
      console.error('[Profile] Update failed:', error);
      Alert.alert('Update Failed', 'Could not save changes. Please try again.');
    }
  };

  return {
    user,
    loadingUpdate,
    handleUpdateProfile,
    handleDeleteProfile,
    loadingDeletion,
  };
};
