import { makeVar } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '../interface';

const USER_STORAGE_KEY = 'signinUser';

export const userData = makeVar<(IUser & { loadedFromStorage?: boolean }) | null>(null);

(async () => {
  try {
    const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      userData({ ...JSON.parse(storedUser), loadedFromStorage: true });
    }
  } catch (error) {
    console.error('Error loading user from storage', error);
  }
})();

export const updateUser = async (user: IUser | null) => {
  try {
    if (user) {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    }
    userData(user);
  } catch (error) {
    console.error('Error updating user in storage', error);
  }
};
