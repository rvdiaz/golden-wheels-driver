import React, { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useApolloClient, useReactiveVar } from '@apollo/client';
import { updateUser, userData } from '~/store/user';
import { pushTokenVar } from '~/store/user/pushToken';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { getAdminUserQuery } from '~/screens/auth/graphql/queries';
import { IUser } from '~/store/user/interfaces';

interface Props {
  children: React.ReactNode;
}

const REFRESH_COOLDOWN_MS = 30000; // 30 seconds - increased from 10

export const UserRefresherWrapper: React.FC<Props> = ({ children }) => {
  const client = useApolloClient();
  const userInfo = useReactiveVar(userData);
  const pushToken = useReactiveVar(pushTokenVar);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastFetchRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);
  const isLogoutInProgressRef = useRef<boolean>(false);

  const handleLogout = useCallback(async () => {
    // Prevent multiple simultaneous logout attempts
    if (isLogoutInProgressRef.current) return;

    isLogoutInProgressRef.current = true;

    try {
      // Sign out from Cognito
      await signOut();

      // Clear user data from store
      updateUser(null);

      // Clear Apollo cache
      await client.clearStore(); // Clears all cached data

      // If you have an apiKeyClient, clear it too
      // await apiKeyClient.clearStore();

      // Note: In React Native, navigation to login screen should be handled
      // by your navigation logic based on user state changes
      // For example, in your main navigation component:
      // if (!userInfo?.id) navigate to SignIn screen
    } catch (error) {
      console.error('[UserRefresher] Error during logout:', error);
    } finally {
      isLogoutInProgressRef.current = false;
    }
  }, [client]);

  const checkTokenValidity = useCallback(async () => {
    try {
      const user = await getCurrentUser();

      if (!user?.userId) {
        console.log('[UserRefresher] Invalid or missing user session, logging out');
        await handleLogout();
        return false;
      }

      return true;
    } catch (error) {
      // Session is invalid, expired, or not available
      console.log('[UserRefresher] Token validation failed, logging out');
      await handleLogout();
      return false;
    }
  }, [handleLogout]);

  // Memoized refresh function with proper dependencies
  const refreshUser = useCallback(async () => {
    // Guard conditions
    if (!userInfo?.userID || isFetchingRef.current) return;

    const isTokenValid = await checkTokenValidity();
    if (!isTokenValid) return;

    // Cooldown check
    const now = Date.now();
    if (now - lastFetchRef.current < REFRESH_COOLDOWN_MS) {
      return;
    }

    isFetchingRef.current = true;
    lastFetchRef.current = now;

    try {
      const { data } = await client.query({
        query: getAdminUserQuery,
        variables: {
          tenant: { tenantId: userInfo.activeTenantId },
          userId: userInfo.userID,
          token: pushToken || undefined, // Handle null token
        },
        fetchPolicy: 'network-only',
        // Add error policy to handle partial errors
        errorPolicy: 'none',
      });

      if (data?.getUser) {
        await updateUser(data.getUser as IUser);
      }
    } catch (err) {
      // Only log non-network errors to avoid spam
      console.warn('[UserRefresher] Failed to refresh user data:', err);
    } finally {
      isFetchingRef.current = false;
    }
  }, [client, userInfo?.userID, pushToken]);

  // Initial refresh on mount (only if user exists)
  useEffect(() => {
    if (userInfo?.userID) {
      // Small delay to ensure system settings are loaded first
      const timer = setTimeout(() => {
        refreshUser();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []); // Empty deps - only run on mount

  // Handle app state changes
  useEffect(() => {
    if (!userInfo?.userID) return;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const isComingToForeground =
        appStateRef.current.match(/inactive|background/) && nextAppState === 'active';

      if (isComingToForeground) {
        refreshUser();
      }

      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [refreshUser, userInfo?.userID]);

  return <>{children}</>;
};
