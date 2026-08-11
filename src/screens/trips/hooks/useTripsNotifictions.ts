import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import * as Notifications from 'expo-notifications';
import { getDriverBookingsQuery, getOpenTripsQuery } from '../graphql/queries';
import {
  getDriverBalanceQuery,
  getDriverLedgerQuery,
} from '~/screens/earnings/graphql/queries';

/**
 * Keeps the driver's trip lists current when a push arrives.
 *
 * ─── What the payload actually looks like ────────────────────────────────────
 *
 * Codidge templates put a small routing object in `push.data`, never a booking:
 *
 *   { type: 'booking.openForClaim', bookingID: 'booking_abc', bookingCode: 'GW-1234' }
 *
 * The previous version read `data.booking` and upserted it into the Apollo cache. No template
 * has ever sent a booking object, so that path could never run — and the driver app was not
 * registered for push at all, so nothing arrived to run it. Refetching is also the honest
 * approach: the payload carries an identifier, not the new state, so only the server knows
 * what actually changed.
 */

/** Driver-addressed types, from the backend's NotificationType enum. */
const ASSIGNED = 'booking.driverAssigned';
const UNASSIGNED = 'booking.driverUnassigned';
const OPEN_FOR_CLAIM = 'booking.openForClaim';
const PAYMENT_RECORDED = 'driver.paymentRecorded';

export const useBookingNotificationListener = () => {
  const client = useApolloClient();

  useEffect(() => {
    const handle = (notification: any) => {
      const type = notification?.request?.content?.data?.type;
      if (typeof type !== 'string') return;

      // Gaining or losing a trip changes both lists: it leaves the pool as it joins "my trips",
      // and returns to the pool when taken away. Refreshing only one would leave the other
      // showing a trip that is no longer there.
      const queries =
        type === ASSIGNED || type === UNASSIGNED
          ? [getDriverBookingsQuery, getOpenTripsQuery]
          : type === OPEN_FOR_CLAIM
            ? [getOpenTripsQuery]
            : // A payment settles the balance and adds a ledger entry, so the earnings screen
              // is stale the moment this arrives.
              type === PAYMENT_RECORDED
              ? [getDriverBalanceQuery, getDriverLedgerQuery]
              : null;

      if (!queries) return;

      client
        .refetchQueries({ include: queries })
        .catch((error) => console.warn('⚠️ Could not refresh trips after push:', error));
    };

    // Arrives while the app is foregrounded.
    const foregroundSub = Notifications.addNotificationReceivedListener(handle);

    // The driver tapped it (app was backgrounded or killed).
    const responseSub = Notifications.addNotificationResponseReceivedListener((response: any) =>
      handle(response?.notification)
    );

    return () => {
      foregroundSub.remove();
      responseSub.remove();
    };
  }, [client]);
};
