// ─── Types ───────────────────────────────────────────────────────────────────

export enum BookMode {
  trip = 'trip',
  hourly = 'hourly',
}

export interface IBookingFormInput {
  bookMode: BookMode;
  pickupLocation: { displayName: string; formattedAddress: string; id: string };
  dropoffLocation: { displayName: string; formattedAddress: string; id: string };
  startDate: string | Date;
  endDate: string;
  bookHours: number;
}
