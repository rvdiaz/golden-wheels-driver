import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPersonalData } from '~/core_modules/on_boarding/interface';
import { UserType } from '../interfaces';
import { capitalize } from '~/custom_modules/crm/helpers';

export const ONBOARDING_STORAGE_KEYS = {
  FIRST_SCREEN_PASSED: '@onboarding_first_screen_passed',
  PERSONAL_INFO_COMPLETED: '@onboarding_personal_info_completed',
  ACCOUNT_CREATED: '@onboarding_account_created',
};

export class OnboardingFlowStorage {
  // Save when user passes the first "Get Started" screen
  static async setFirstScreenPassed() {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEYS.FIRST_SCREEN_PASSED, 'true');
    } catch (error) {
      console.error('Error saving first screen state:', error);
    }
  }

  // Check if user has passed the first screen
  static async hasPassedFirstScreen(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEYS.FIRST_SCREEN_PASSED);
      return value === 'true';
    } catch (error) {
      console.error('Error reading first screen state:', error);
      return false;
    }
  }

  // Save when user completes personal info
  static async setPersonalInfoCompleted(personalData: IPersonalData) {
    try {
      await AsyncStorage.setItem(
        ONBOARDING_STORAGE_KEYS.PERSONAL_INFO_COMPLETED,
        JSON.stringify(personalData)
      );
    } catch (error) {
      console.error('Error saving personal info state:', error);
    }
  }

  // Check if user has completed personal info
  static async hasCompletedPersonalInfo(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEYS.PERSONAL_INFO_COMPLETED);
      const savedData = value ? JSON.parse(value) : null;

      return !!savedData;
    } catch (error) {
      console.error('Error reading personal info state:', error);
      return false;
    }
  }

  // Check if user has completed personal info
  static async getPersonalInfoCompleted() {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEYS.PERSONAL_INFO_COMPLETED);
      const savedData = value ? JSON.parse(value) : null;
      return savedData;
    } catch (error) {
      console.error('Error reading personal info state:', error);
      return {};
    }
  }

  // Save when account is successfully created
  static async setAccountCreated() {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEYS.ACCOUNT_CREATED, 'true');
      await AsyncStorage.multiRemove([ONBOARDING_STORAGE_KEYS.PERSONAL_INFO_COMPLETED]);
    } catch (error) {
      console.error('Error saving account created state:', error);
    }
  }

  // Check if account has been created
  static async hasCreatedAccount(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEYS.ACCOUNT_CREATED);
      return value === 'true';
    } catch (error) {
      console.error('Error reading account created state:', error);
      return false;
    }
  }

  // Clear all onboarding flags (e.g., when user wants to start fresh)
  static async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        ONBOARDING_STORAGE_KEYS.FIRST_SCREEN_PASSED,
        ONBOARDING_STORAGE_KEYS.PERSONAL_INFO_COMPLETED,
        ONBOARDING_STORAGE_KEYS.ACCOUNT_CREATED,
      ]);
    } catch (error) {
      console.error('Error clearing onboarding state:', error);
    }
  }
}

export const USER_TYPE_OPTIONS = Object.values(UserType).map((value) => ({
  label: capitalize(value),
  value,
}));
