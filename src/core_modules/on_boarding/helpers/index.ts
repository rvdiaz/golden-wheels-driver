import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '..';

// Clear onboarding data
export const clearOnboardingData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ONBOARDING_DATA,
      STORAGE_KEYS.ONBOARDING_STEP,
      STORAGE_KEYS.ONBOARDING_COMPLETED,
    ]);
  } catch (error) {
    console.error('Error clearing onboarding data:', error);
  }
};
