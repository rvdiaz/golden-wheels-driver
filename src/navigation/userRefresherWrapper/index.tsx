import React, { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useApolloClient, useReactiveVar } from '@apollo/client';
import { updateUser, userData } from '~/store/user';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { IUser } from '~/store/user/interfaces';
import { getDriverProfileQuery } from '~/screens/auth/graphql/queries';
import { ENV_Vars } from '~/store/env';

interface Props {
  children: React.ReactNode;
}

const REFRESH_COOLDOWN_MS = 30000;

export const UserRefresherWrapper: React.FC<Props> = ({ children }) => {
  const client = useApolloClient();
  const userInfo = useReactiveVar(userData);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastFetchRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);
  const isLogoutInProgressRef = useRef<boolean>(false);

  const handleLogout = useCallback(async () => {
    if (isLogoutInProgressRef.current) return;
    isLogoutInProgressRef.current = true;
    try {
      await signOut();
      updateUser(null);
      await client.clearStore();
    } catch (error) {
      console.error('[UserRefresher] Logout error:', error);
    } finally {
      isLogoutInProgressRef.current = false;
    }
  }, [client]);

  const checkTokenValidity = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (!user?.userId) {
        await handleLogout();
        return false;
      }
      return true;
    } catch {
      await handleLogout();
      return false;
    }
  }, [handleLogout]);

  const refreshUser = useCallback(async () => {
    if (!userInfo?.id || isFetchingRef.current) return;

    const isTokenValid = await checkTokenValidity();
    if (!isTokenValid) return;

    const now = Date.now();
    if (now - lastFetchRef.current < REFRESH_COOLDOWN_MS) return;

    isFetchingRef.current = true;
    lastFetchRef.current = now;

    try {
      const { data } = await client.query({
        query: getDriverProfileQuery,
        variables: { tenant: ENV_Vars.tenant },
        fetchPolicy: 'network-only',
        errorPolicy: 'none',
      });

      if (data?.getDriverProfile) {
        await updateUser(data.getDriverProfile as IUser);
      }
    } catch (err) {
      console.warn('[UserRefresher] Failed to refresh driver profile:', err);
    } finally {
      isFetchingRef.current = false;
    }
  }, [client, userInfo?.id]);

  useEffect(() => {
    if (userInfo?.id) {
      const timer = setTimeout(() => refreshUser(), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!userInfo?.id) return;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        refreshUser();
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [refreshUser, userInfo?.id]);

  return <>{children}</>;
};
