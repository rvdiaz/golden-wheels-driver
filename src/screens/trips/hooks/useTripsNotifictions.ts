import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import * as Notifications from 'expo-notifications';
import { getDriverBookingsQuery } from '../graphql/queries';
import { Booking } from '../interfaces';
import { ENV_Vars } from '~/store/env';

interface DriverNotificationData {
  type: string;
  booking: Booking | string; // backend sends stringified JSON
}

const parseBooking = (raw: Booking | string): Booking | null => {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as Booking;
    } catch {
      return null;
    }
  }
  return raw ?? null;
};

export const useBookingNotificationListener = () => {
  const client = useApolloClient();

  useEffect(() => {
    const foregroundSub = Notifications.addNotificationReceivedListener((notification: any) => {
      const data: DriverNotificationData = notification.request.content.data;
      if (data?.booking) handleNotification(data);
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener((response: any) => {
      const data: DriverNotificationData = response.notification.request.content.data;
      if (data?.booking) handleNotification(data);
    });

    return () => {
      foregroundSub.remove();
      responseSub.remove();
    };
  }, []);

  const handleNotification = (data: DriverNotificationData) => {
    const booking = parseBooking(data.booking);
    if (!booking?.id) return;
    upsertBookingInCache(booking);
  };

  // Insert the new booking or update an existing one in the driver bookings cache.
  const upsertBookingInCache = (incoming: Booking) => {
    client.cache.updateQuery<{ getDriverBookings: Booking[] }>(
      {
        query: getDriverBookingsQuery,
        variables: { tenant: ENV_Vars.tenant },
      },
      (cached) => {
        if (!cached) return { getDriverBookings: [incoming] };

        const exists = cached.getDriverBookings.some((b) => b.id === incoming.id);
        return {
          getDriverBookings: exists
            ? cached.getDriverBookings.map((b) =>
                b.id === incoming.id ? { ...b, ...incoming } : b
              )
            : [incoming, ...cached.getDriverBookings],
        };
      }
    );
  };
};
