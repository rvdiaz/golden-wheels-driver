import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import * as Notifications from 'expo-notifications';
import { getCustomerBookingQuery } from '../graphql/queries';
import { Booking } from '../interfaces';
import { ENV_Vars } from '~/store/env';

// ─── Notification payload shape (sent from your backend) ─────────────────────
//
// When your server calls sendPushNotification(), include a `data` field:
//
//   sendPushNotification(token, { title: '...', body: '...' }, {
//     type: 'BOOKING_STATUS_UPDATE',
//     bookingId: 'abc123',
//     driverStatus: 'en_route',     // optional
//     bookingStatus: 'confirmed',   // optional
//   })
//
// Expo push API supports a top-level `data` object alongside title/body.

interface BookingNotificationData {
  type: any;
  booking: Booking;
  newStatus?: string;
}

export enum INotifictionTypes {
  BOOKING_DRIVER_STATUS_UPDATE,
  DRIVER_ASSIGNED,
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useBookingNotificationListener = () => {
  const client = useApolloClient();

  useEffect(() => {
    // Fires when a notification is received while the app is foregrounded
    const foregroundSub = Notifications.addNotificationReceivedListener((notification: any) => {
      const data = notification.request.content.data;

      if (data?.booking?.id) {
        handleNotification(data);
      }
    });

    // Fires when the user taps a notification (app was backgrounded/killed)
    const responseSub = Notifications.addNotificationResponseReceivedListener((response: any) => {
      const data = response.notification.request.content.data;

      if (data?.booking?.id) {
        handleNotification(data);
      }
    });

    return () => {
      foregroundSub.remove();
      responseSub.remove();
    };
  }, []);

  const handleNotification = (data: BookingNotificationData) => {
    updateBookingInCache(data);
  };

  // Surgically update only the affected booking in the Apollo cache
  // No network round-trip needed — the notification carries the new state.
  const updateBookingInCache = (data: BookingNotificationData) => {
    client.cache.updateQuery<{ getCustomerBooking: Booking[] }>(
      {
        query: getCustomerBookingQuery,
        variables: { tenant: ENV_Vars.tenant },
      },
      (cached: any) => {
        if (!cached) return cached;

        return {
          getCustomerBooking: cached.getCustomerBooking.map((booking: Booking) => {
            if (booking.id !== data.booking.id) return booking;

            // Merge only the fields the notification actually carries
            return {
              ...booking,
              ...data.booking,
            };
          }),
        };
      }
    );
  };
};
