import { IImage, IPrices } from '~/codidge_components/interfaces';

export type BookingStatus =
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'in_progress';

export type BookingDriverStatus = 'assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed';

export type TabKey = 'upcoming' | 'past' | 'cancelled' | 'draft';

export type AssignmentMode = 'manual' | 'open_pool';
export type PoolState = 'open' | 'claimed';

/**
 * The driver's share of a trip. The only money field the backend returns to a
 * driver — totalPrice and the operator's commission are stripped server-side.
 */
export interface DriverEarnings {
  amount: number;
  currencyCode: string;
}

export interface CarType {
  id: string;
  name: string;
  description?: string;
  // The rest is only ever populated from Rentra's richer carType payload — Codidge's booking
  // snapshot carries just carTypeID/name (see mapCodidgeBooking.ts), and nothing in this app's
  // trip screens reads beyond `name` today, so these stay optional rather than faked.
  maxPassengers?: number;
  image?: IImage;
  features?: {
    label: string;
    value: string;
  }[];
  supportsHourly?: boolean;
  supportsDistance?: boolean;
  hourlyRate?: number;
  pricePerMiles?: number;
  baseFare?: number;
  minimumFare?: number;
  tripQuotePrice?: number;
}

export interface ICar {
  id: string;
  brand: string;
  model: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface TripLocation {
  id: string;
  displayName: string;
  formattedAddress: string;
  types: string[];
}

export interface TotalPrice {
  amount: number;
  currencyCode: string;
}

export enum BookMode {
  trip = 'trip',
  hourly = 'hourly',
}

export type BookingCartTypesPriceQueryInput = Pick<
  BookingBusinessData,
  'pickupLocation' | 'dropoffLocation' | 'bookMode' | 'bookHours'
>;

export interface BookingBusinessData {
  bookHours: number;
  bookMode: BookMode;
  car: ICar;
  carType: CarType;
  customer: Customer;
  // Absent until an admin (or the driver, via claimBooking) actually assigns someone —
  // Codidge has no placeholder driver row, unlike Rentra which always sent one.
  driver?: Driver;
  pickupLocation: TripLocation;
  dropoffLocation?: TripLocation;
  totalPrice: TotalPrice;
  extraServices: IExtraService[];
}

export interface BookingForm {
  id: string;
  bookingCode: string;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  note: string;
  flightNumber?: string;
  terminal?: string;
  flightDestinationNumber?: string;
  terminalDestination?: string;

  extraNotes?: string;
  bookingBusinessData: BookingBusinessData;
}

export enum PaymentStatus {
  none = 'none',
  authorized = 'authorized',
  captured = 'captured',
  capture_failed = 'capture_failed',
  cancelled = 'cancelled',
  refunded = 'refunded',
  payment_failed = 'payment_failed',
}

export interface Booking {
  id: string;
  bookingCode: string;
  status: BookingStatus;
  driverStatus?: BookingDriverStatus;
  paymentStatus: PaymentStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  note: string;
  bookingBusinessData: BookingBusinessData;
  paymentFailureCode: string;
  paymentFailureMessageCustomer: string;
  externalChargeReference?: {
    sourceHandler: string;
    referenceId: string;
    chargeId: string;
  };

  assignmentMode?: AssignmentMode;
  poolState?: PoolState;
  offeredAt?: string;
  claimedAt?: string;
  /** What this trip pays the driver. Absent if no commission is configured. */
  driverEarnings?: DriverEarnings;
}

export interface IExtraService {
  id: string;
  name: string;
  description?: string;
  price: IPrices;
  createdAt: string;
  available: boolean;
  image?: IImage;
}
