import { useCallback, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { useMutation } from '@apollo/client';

import { ENV_Vars } from '~/store/env';
import { updateDriverStatusMutation } from '../graphql/mutation';
import { getDriverBookingsQuery, getOpenTripsQuery } from '../graphql/queries';
import { Booking, BookingDriverStatus } from '../interfaces';
import { TKey, translate } from '~/i18n';

/** The trip as the driver moves through it, in order. */
export const DRIVER_STATUS_FLOW: BookingDriverStatus[] = [
  'assigned',
  'en_route',
  'arrived',
  'in_progress',
  'completed',
];

export const NEXT_STATUS: Partial<Record<BookingDriverStatus, BookingDriverStatus>> = {
  assigned: 'en_route',
  en_route: 'arrived',
  arrived: 'in_progress',
  in_progress: 'completed',
};

/**
 * Translation keys rather than strings — these are module-level constants, so
 * baking in English here would freeze the label at import time and never
 * re-render when the driver switches language.
 */
export const NEXT_ACTION_KEY: Partial<Record<BookingDriverStatus, TKey>> = {
  assigned: 'action.assigned',
  en_route: 'action.en_route',
  arrived: 'action.arrived',
  in_progress: 'action.in_progress',
};

export const STATUS_LABEL_KEY: Record<BookingDriverStatus, TKey> = {
  assigned: 'status.assigned',
  en_route: 'status.en_route',
  arrived: 'status.arrived',
  in_progress: 'status.in_progress',
  completed: 'status.completed',
};

export const STATUS_SHORT_KEY: Record<BookingDriverStatus, TKey> = {
  assigned: 'status.short.assigned',
  en_route: 'status.short.en_route',
  arrived: 'status.short.arrived',
  in_progress: 'status.short.in_progress',
  completed: 'status.short.completed',
};

/** Steps that are awkward to undo get a confirmation. */
const NEEDS_CONFIRM: BookingDriverStatus[] = ['in_progress'];

const encode = (q: string) => encodeURIComponent(q.trim());

/**
 * Open turn-by-turn navigation to an address.
 *
 * Prefers a real maps app so the driver gets voice guidance, and falls back to
 * the web map. Google Maps is offered first on Android and second on iOS, which
 * is where each platform's drivers expect it.
 */
export const openNavigation = async (address?: string, label?: string) => {
  if (!address) {
    Alert.alert(translate('error.noAddressTitle'), translate('error.noAddressBody'));
    return;
  }

  const q = encode(address);
  const candidates =
    Platform.OS === 'ios'
      ? [
          `maps://?daddr=${q}&dirflg=d`,
          `comgooglemaps://?daddr=${q}&directionsmode=driving`,
          `https://maps.apple.com/?daddr=${q}`,
        ]
      : [
          `google.navigation:q=${q}`,
          `geo:0,0?q=${q}(${encode(label ?? 'Stop')})`,
          `https://www.google.com/maps/dir/?api=1&destination=${q}`,
        ];

  for (const url of candidates) {
    try {
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
        return;
      }
    } catch {
      // canOpenURL throws for unregistered schemes on some OS versions —
      // that's just a "no", so keep walking the list.
    }
  }

  Alert.alert(translate('error.noMapsTitle'), translate('error.noMapsBody'));
};

export const callCustomer = async (phone?: string) => {
  if (!phone) {
    Alert.alert(translate('error.noPhoneTitle'), translate('error.noPhoneBody'));
    return;
  }
  const url = `tel:${phone.replace(/[^\d+]/g, '')}`;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(translate('error.callFailed'), phone);
  }
};

export const messageCustomer = async (phone?: string) => {
  if (!phone) return;
  try {
    await Linking.openURL(`sms:${phone.replace(/[^\d+]/g, '')}`);
  } catch {
    /* not every device has a messaging app */
  }
};

export const useTripActions = (onChanged?: () => void) => {
  const [advancing, setAdvancing] = useState(false);

  const [updateStatus] = useMutation(updateDriverStatusMutation, {
    refetchQueries: [
      { query: getDriverBookingsQuery, variables: { tenant: ENV_Vars.tenant } },
      { query: getOpenTripsQuery, variables: { tenant: ENV_Vars.tenant } },
    ],
  });

  const advance = useCallback(
    async (booking: Booking) => {
      const current = booking.driverStatus ?? 'assigned';
      const next = NEXT_STATUS[current];
      if (!next) return;

      const run = async () => {
        setAdvancing(true);
        try {
          await updateStatus({
            variables: {
              tenant: ENV_Vars.tenant,
              bookingId: booking.id,
              driverStatus: next,
            },
          });
          onChanged?.();
        } catch (error: any) {
          Alert.alert(
            translate('error.updateTrip'),
            error?.message ?? translate('error.tryAgain')
          );
        } finally {
          setAdvancing(false);
        }
      };

      if (NEEDS_CONFIRM.includes(current)) {
        Alert.alert(
          translate('confirm.completeTitle'),
          translate('confirm.completeBody'),
          [
            { text: translate('confirm.notYet'), style: 'cancel' },
            {
              text: translate('confirm.complete'),
              style: 'destructive',
              onPress: run,
            },
          ]
        );
        return;
      }

      await run();
    },
    [updateStatus, onChanged]
  );

  return { advance, advancing, callCustomer, messageCustomer, openNavigation };
};
