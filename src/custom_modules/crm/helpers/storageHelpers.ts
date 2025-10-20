import AsyncStorage from '@react-native-async-storage/async-storage';

const CONSENT_KEY = 'contact_upload_consent';

export const setContactUploadConsent = async (value: boolean) => {
  try {
    await AsyncStorage.setItem(CONSENT_KEY, value ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to save consent preference:', e);
  }
};

export const getContactUploadConsent = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(CONSENT_KEY);
    return value === 'true';
  } catch (e) {
    console.error('Failed to read consent preference:', e);
    return false;
  }
};
