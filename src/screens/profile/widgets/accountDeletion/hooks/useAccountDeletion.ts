import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { ENV_Vars } from '~/store/env';
import { translate } from '~/i18n';
import { useSignOut } from '~/codidge_components/auth/hooks/useSignOut';
import { deleteMyDriverAccountMutation } from '../graphql/mutations';

/** Code the server answers with while the driver is en route, arrived or mid-trip. */
const LIVE_TRIP_ERROR = 'DRIVER_HAS_LIVE_TRIP';

export const useAccountDeletion = ({ onDeleted }: { onDeleted?: () => void } = {}) => {
  const [deleting, setDeleting] = useState(false);
  const [deleteAccountFn] = useMutation(deleteMyDriverAccountMutation);
  const { signOutAndClear } = useSignOut();

  const deleteAccount = useCallback(async () => {
    setDeleting(true);
    try {
      await deleteAccountFn({
        variables: {
          tenantID: ENV_Vars.TENANT_ID,
          organizationID: ENV_Vars.ORGANIZATION_ID,
        },
      });
    } catch (error: any) {
      setDeleting(false);
      Alert.alert(
        translate('account.deleteFailedTitle'),
        String(error?.message ?? '').includes(LIVE_TRIP_ERROR)
          ? translate('account.deleteLiveTrip')
          : translate('error.tryAgain')
      );
      return;
    }

    // The account is gone at this point, so nothing below may leave the driver looking signed
    // in. The server already removed every device registered for this organization — and this
    // driver no longer exists there to unregister one.
    try {
      await signOutAndClear({ unregisterDevice: false });
    } catch (error) {
      console.warn('⚠️ Account deleted but the session could not be closed cleanly:', error);
    }
    setDeleting(false);
    onDeleted?.();
  }, [deleteAccountFn, signOutAndClear, onDeleted]);

  const confirmAndDelete = useCallback(() => {
    Alert.alert(translate('account.deleteConfirmTitle'), translate('account.deleteConfirmBody'), [
      { text: translate('account.deleteCancel'), style: 'cancel' },
      { text: translate('account.deleteConfirm'), style: 'destructive', onPress: deleteAccount },
    ]);
  }, [deleteAccount]);

  return { confirmAndDelete, deleting };
};
