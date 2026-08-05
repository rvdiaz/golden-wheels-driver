/** EARNING credits the driver, PAYMENT settles part of what they are owed. */
export type LedgerEntryType = 'EARNING' | 'PAYMENT';

export interface LedgerEntry {
  entryId: string;
  /** Widened to string on purpose — the server may add entry types (adjustments,
   *  reversals) before this app ships again, and an unknown value must render
   *  rather than crash. */
  type: LedgerEntryType | string;
  /** Signed: positive is owed to the driver, negative is a payment received. */
  amount: number;
  currencyCode: string;
  occurredAt: string;
  createdAt: string;
  description?: string | null;
  sourceBookingId?: string | null;
  bookingCode?: string | null;
  paymentMethod?: string | null;
  paymentReference?: string | null;
}

export interface DriverBalance {
  driverId: string;
  /** What the owner still owes. */
  balance: number;
  totalEarned: number;
  totalPaid: number;
  currencyCode: string;
  lastEntryAt?: string | null;
  updatedAt?: string | null;
}

export interface DriverLedgerPage {
  items: LedgerEntry[];
  nextToken?: string | null;
}
