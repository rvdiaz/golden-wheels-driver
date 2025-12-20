import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@apollo/client';
import { updateUserMutation } from '~/core_modules/auth/graphql/mutations';
import { IUser } from '~/store/user/interfaces';

const SESSION_START_KEY = 'sessionStartTime';
const SESSION_USER_ID_KEY = 'sessionUserId';

export function useUserSessionTimeTracking({ user }: { user: IUser | null }) {
  const appState = useRef(AppState.currentState);
  const [updateUserTime] = useMutation(updateUserMutation);

  useEffect(() => {
    if (!user) return;

    const currentUserId = String(user.userID);

    // ----- Start session when user logs in -----
    const startSession = async () => {
      await AsyncStorage.setItem(SESSION_START_KEY, String(Date.now()));
      await AsyncStorage.setItem(SESSION_USER_ID_KEY, currentUserId);
    };
    // ----- End session when app goes background -----
    const endSession = async () => {
      const storedUserId = await AsyncStorage.getItem(SESSION_USER_ID_KEY);
      const start = await AsyncStorage.getItem(SESSION_START_KEY);

      // No active session → nothing to do
      if (!start || storedUserId !== currentUserId) {
        return;
      }

      const durationMs = Date.now() - Number(start);

      // Clean previous session
      await AsyncStorage.multiRemove([SESSION_START_KEY, SESSION_USER_ID_KEY]);

      try {
        await updateUserTime({
          variables: {
            tenant: {
              tenantId: user,
            },
            updates: {
              durationMs,
            },
            userId: user.userID,
          },
        });
      } catch (err) {
        console.error('Failed to update time', err);
      }
    };

    // -----------------------------
    // Initialization: Handle user switching
    // -----------------------------
    const init = async () => {
      const storedUserId = await AsyncStorage.getItem(SESSION_USER_ID_KEY);

      if (storedUserId && storedUserId !== currentUserId) {
        // Different user logged in → clean old user's session
        await AsyncStorage.multiRemove([SESSION_START_KEY, SESSION_USER_ID_KEY]);
        await startSession(); // fresh start
        return;
      }

      // Same user → simply start a new session
      await startSession();
    };

    init();

    // -----------------------------
    // APPSTATE: active ↔ background
    // -----------------------------
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current === 'active' && nextAppState !== 'active') {
        endSession();
      }
      if (appState.current !== 'active' && nextAppState === 'active') {
        startSession();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      endSession(); // cleanup on unmount (logout)
    };
  }, [user?.userID]);
}
