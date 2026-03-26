import { makeVar } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from './interfaces';

export const USER_STORAGE_KEY = 'signinUser';

export const userData = makeVar<(IUser & { loadedFromStorage?: boolean }) | null>(null);

export const updateUser = async (user: IUser | null) => {
  try {
    if (user) {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      userData(user);
    } else {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      userData(null);
    }
  } catch (error) {
    console.error('Error updating user in storage', error);
  }
};

(async () => {
  try {
    const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

    if (storedUser) {
      const parsedUser: IUser = JSON.parse(storedUser);
      userData({ ...parsedUser, loadedFromStorage: true });
    }
  } catch (error) {
    console.error('Error loading user from storage', error);
  }
})();
