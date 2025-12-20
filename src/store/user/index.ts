import { makeVar } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from './interfaces';

export const USER_STORAGE_KEY = 'signinUser';

export const userData = makeVar<(IUser & { loadedFromStorage?: boolean }) | null>(null);

export const updateUser = async (user: IUser | null | string) => {
  try {
    if (user) {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    }
    userData(user as IUser);
  } catch (error) {
    console.error('Error updating user in storage', error);
  }
};

export const getUser = async () => {
  try {
    const us = await AsyncStorage.getItem(USER_STORAGE_KEY);
    userData(us);
  } catch (error) {}
};
