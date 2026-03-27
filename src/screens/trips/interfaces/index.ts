import { IImage, IPrices } from '~/codidge_components/interfaces';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'in_progress';
export type TabKey = 'upcoming' | 'past' | 'cancelled';

export interface CarType {
  id: string;
  name: string;
  description?: string;
  maxPassengers: number;
  image: IImage;
  features: {
    label: string;
    value: string;
  }[];
  supportsHourly: boolean;
  supportsDistance: boolean;
  hourlyRate: number;
  pricePerMiles: number;
  baseFare: number;
  minimumFare: number;
  tripQuotePrice: number;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  carType: CarType;
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
}

export interface TotalPrice {
  amount: number;
  currencyCode: string;
}

export enum BookMode {
  trip = 'trip',
  hourly = 'hourly',
}

export interface BookingBusinessData {
  bookHours: number;
  bookMode: BookMode;
  car: Car;
  carType: CarType;
  customer: Customer;
  driver: Driver;
  pickupLocation: TripLocation;
  dropoffLocation: TripLocation;
  totalPrice: TotalPrice;
  extraServices: string[];
}

export interface Booking {
  id: string;
  bookingCode: string;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  note: string;
  bookingBusinessData: BookingBusinessData;
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
