import { gql } from '@apollo/client';

import { DriverBalance, DriverLedgerPage, LedgerEntry } from '../interfaces';

/**
 * Neither query takes a driverId — the server resolves the driver from the
 * Cognito token, so this app cannot ask for anyone else's money.
 *
 * ## Codidge shape vs rentra's
 *
 * Ported to codidge, the wire format changed in three ways while the screen did not:
 *
 * | | rentra | codidge |
 * |---|---|---|
 * | scope argument | `tenant: TenantData!` | `tenantID: ID!` |
 * | money | `amount: Float` + sibling `currencyCode` | `Prices { amount currencyCode }` |
 * | booking id | `sourceBookingId` | `sourceBookingID` |
 *
 * The components below this file are unchanged and still read the flat
 * `{ amount, currencyCode }` interfaces, so the two shapes are reconciled *here*
 * by the normalizers rather than by touching the UI. That keeps the blast radius
 * of the port at the data boundary, which is the only thing that actually moved.
 */

export const getDriverBalanceQuery = gql`
  query getDriverBalance($tenantID: ID!) {
    getDriverBalance(tenantID: $tenantID) {
      driverID
      balance {
        amount
        currencyCode
      }
      totalEarned {
        amount
        currencyCode
      }
      totalPaid {
        amount
        currencyCode
      }
      lastEntryAt
      updatedAt
    }
  }
`;

export const getDriverLedgerQuery = gql`
  query getDriverLedger($tenantID: ID!, $limit: Int, $nextToken: String) {
    getDriverLedger(tenantID: $tenantID, limit: $limit, nextToken: $nextToken) {
      items {
        entryId
        type
        amount {
          amount
          currencyCode
        }
        occurredAt
        createdAt
        description
        sourceBookingID
        bookingCode
        paymentMethod
        paymentReference
      }
      nextToken
    }
  }
`;

// ─── Wire types ───────────────────────────────────────────────────────────────

interface Prices {
  amount: number;
  currencyCode?: string | null;
}

export interface RawDriverBalance {
  driverID: string;
  balance: Prices;
  totalEarned: Prices;
  totalPaid: Prices;
  lastEntryAt?: string | null;
  updatedAt?: string | null;
}

export interface RawLedgerEntry {
  entryId: string;
  type: string;
  amount: Prices;
  occurredAt: string;
  createdAt: string;
  description?: string | null;
  sourceBookingID?: string | null;
  bookingCode?: string | null;
  paymentMethod?: string | null;
  paymentReference?: string | null;
}

export interface RawDriverLedgerPage {
  items: RawLedgerEntry[];
  nextToken?: string | null;
}

// ─── Normalizers ──────────────────────────────────────────────────────────────

/** USD is the fallback, not an assumption: `Prices` always carries a code in practice. */
const DEFAULT_CURRENCY = 'USD';

export const toDriverBalance = (raw?: RawDriverBalance | null): DriverBalance | undefined =>
  raw
    ? {
        driverId: raw.driverID,
        balance: raw.balance?.amount ?? 0,
        totalEarned: raw.totalEarned?.amount ?? 0,
        totalPaid: raw.totalPaid?.amount ?? 0,
        // The three figures are the same currency by construction — the ledger writer
        // refuses to mix them — so the balance's code speaks for the card.
        currencyCode: raw.balance?.currencyCode ?? DEFAULT_CURRENCY,
        lastEntryAt: raw.lastEntryAt,
        updatedAt: raw.updatedAt,
      }
    : undefined;

export const toLedgerEntry = (raw: RawLedgerEntry): LedgerEntry => ({
  entryId: raw.entryId,
  type: raw.type,
  amount: raw.amount?.amount ?? 0,
  currencyCode: raw.amount?.currencyCode ?? DEFAULT_CURRENCY,
  occurredAt: raw.occurredAt,
  createdAt: raw.createdAt,
  description: raw.description,
  sourceBookingId: raw.sourceBookingID,
  bookingCode: raw.bookingCode,
  paymentMethod: raw.paymentMethod,
  paymentReference: raw.paymentReference,
});

export const toLedgerItems = (raw?: RawDriverLedgerPage | null): LedgerEntry[] =>
  (raw?.items ?? []).map(toLedgerEntry);
