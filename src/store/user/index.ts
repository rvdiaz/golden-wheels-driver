import { makeVar } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from './interfaces';

export const USER_STORAGE_KEY = 'signinUser';

export const userData = makeVar<(IUser & { loadedFromStorage?: boolean }) | null>(null);

/**
 * Whether the AsyncStorage read below has finished — regardless of whether it
 * found anything.
 *
 * The auth gate needs this. `userData` starts null and is only assigned when a
 * stored user exists, so "null" is ambiguous: it means both "not signed in" and
 * "haven't looked yet". Gating on `userData` alone shows the login screen for a
 * frame on every cold start, which a signed-in driver sees as a flash.
 * `loadedFromStorage` can't stand in — it only exists when a user was found.
 */
export const userHydrated = makeVar<boolean>(false);

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
  } finally {
    // In `finally` on purpose: a failed or empty read still resolves the
    // question, and the gate must not hang on the loading screen.
    userHydrated(true);
  }
})();
