import { gql } from '@apollo/client';

/**
 * "Who am I", called immediately after sign-in.
 *
 * Codidge resolves the driver from the **verified token**, so this takes no driver id — only
 * the location whose roster to search. `tenantID` is a plain ID, not Rentra's `TenantData`
 * object, because Codidge has no "solution" dimension.
 *
 * `id` is aliased from `driverID` so the app's `IUser` shape is unchanged.
 *
 * Two Rentra fields are deliberately not selected yet:
 *   • `pushToken` — Codidge's Driver has no such field; push registration is part of the
 *     notification work that has not been ported (auth-architecture.md Appendix A.3).
 *   • `preferredLanguages` — the language preference is a later concern, not part of getting
 *     login working.
 */
export const getDriverProfileQuery = gql`
  query getDriverProfile($tenantID: ID!) {
    getDriverProfile(tenantID: $tenantID) {
      id: driverID
      name
      email
      phone
      licenseNumber
      available
      accountStatus
    }
  }
`;
