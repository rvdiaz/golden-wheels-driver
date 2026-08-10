import { Booking, BookingBusinessData, BookingStatus, PaymentStatus, TripLocation } from '../interfaces';

/**
 * Codidge's Booking is flat (no bookingBusinessData wrapper) and uses different status/field
 * names than what this app's UI was originally built against. Rather than touch every screen
 * and card component — all of which already read `booking.bookingBusinessData.x` — this maps
 * the raw query/mutation response into the existing Booking shape once, at the query boundary.
 * Same pattern as the customer app's mapCodidgeCustomerToUser.
 */

// Codidge's booking lifecycle has no "confirmed"/"pending" — those were Rentra's names for
// what Codidge calls "assigned" (driver set) and "requested" (not yet assigned). Mapping keeps
// every existing status check in the UI (filterByTab, home screen, trips screen) working
// unchanged.
const STATUS_MAP: Record<string, BookingStatus> = {
  draft: 'draft',
  requested: 'pending',
  assigned: 'confirmed',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
};

const mapAddress = (a?: {
  placeId?: string;
  displayName?: string;
  address?: string;
  types?: string[];
} | null): TripLocation | undefined =>
  a
    ? {
        id: a.placeId ?? '',
        displayName: a.displayName ?? '',
        formattedAddress: a.address ?? '',
        types: a.types ?? [],
      }
    : undefined;

export interface ICodidgeBooking {
  bookingID: string;
  bookingCode: string;
  status: string;
  driverStatus?: string | null;
  paymentStatus: string;
  openForClaim?: boolean | null;
  startDate: string;
  endDate?: string | null;
  createdAt?: string | null;
  note?: string | null;
  bookHours?: number | null;
  bookMode?: string | null;
  customer?: { customerID?: string; name?: string; email?: string; phone?: string } | null;
  driver?: { driverID?: string; name?: string; email?: string; phone?: string } | null;
  car?: { carID?: string; brand?: string; model?: string } | null;
  carType?: { carTypeID?: string; name?: string } | null;
  pickupLocation?: { placeId?: string; displayName?: string; address?: string; types?: string[] } | null;
  dropoffLocation?: { placeId?: string; displayName?: string; address?: string; types?: string[] } | null;
  totalPrice?: { amount?: number; currencyCode?: string } | null;
  revenueSplit?: {
    commissionPercentage?: number;
    driverAmount?: { amount?: number; currencyCode?: string };
  } | null;
  paymentFailureCode?: string | null;
  paymentFailureMessageCustomer?: string | null;
}

export const mapCodidgeBooking = (b: ICodidgeBooking): Booking => ({
  id: b.bookingID,
  bookingCode: b.bookingCode,
  status: STATUS_MAP[b.status] ?? 'pending',
  driverStatus: (b.driverStatus as Booking['driverStatus']) ?? undefined,
  paymentStatus: (b.paymentStatus as PaymentStatus) ?? PaymentStatus.none,
  startDate: b.startDate,
  endDate: b.endDate ?? '',
  createdAt: b.createdAt ?? '',
  note: b.note ?? '',
  paymentFailureCode: b.paymentFailureCode ?? '',
  paymentFailureMessageCustomer: b.paymentFailureMessageCustomer ?? '',

  // Only present once a commission rate is configured (see rentalSettings in the admin panel) —
  // absent means the trip pays out nothing yet, not that it's free.
  driverEarnings: b.revenueSplit?.driverAmount
    ? {
        amount: b.revenueSplit.driverAmount.amount ?? 0,
        currencyCode: b.revenueSplit.driverAmount.currencyCode ?? 'USD',
      }
    : undefined,

  // Derived, not stored — Codidge tracks "is this in the pool" as one boolean plus whether a
  // driver is set, not a separate assignmentMode/poolState pair.
  assignmentMode: b.openForClaim ? 'open_pool' : 'manual',
  poolState: b.openForClaim ? 'open' : 'claimed',

  bookingBusinessData: {
    bookHours: b.bookHours ?? 0,
    bookMode: (b.bookMode as BookingBusinessData['bookMode']) ?? 'trip',
    car: { id: b.car?.carID ?? '', brand: b.car?.brand ?? '', model: b.car?.model ?? '' },
    carType: { id: b.carType?.carTypeID ?? '', name: b.carType?.name ?? '' },
    customer: {
      id: b.customer?.customerID ?? '',
      name: b.customer?.name ?? '',
      email: b.customer?.email ?? '',
      phone: b.customer?.phone ?? '',
    },
    driver: b.driver
      ? {
          id: b.driver.driverID ?? '',
          name: b.driver.name ?? '',
          email: b.driver.email ?? '',
          phone: b.driver.phone ?? '',
        }
      : undefined,
    pickupLocation: mapAddress(b.pickupLocation) ?? {
      id: '',
      displayName: '',
      formattedAddress: '',
      types: [],
    },
    dropoffLocation: mapAddress(b.dropoffLocation),
    totalPrice: {
      amount: b.totalPrice?.amount ?? 0,
      currencyCode: b.totalPrice?.currencyCode ?? 'USD',
    },
    extraServices: [],
  },
});

export const mapCodidgeBookings = (list?: ICodidgeBooking[] | null): Booking[] =>
  (list ?? []).map(mapCodidgeBooking);
