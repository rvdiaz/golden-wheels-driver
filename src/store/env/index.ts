import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};
const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

function required(name: string, value?: string): string {
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export const ENV_Vars = {
  APP_ENV: required('APP_ENV', extra.APP_ENV),
  APP_VERSION: required('VERSION', extra.VERSION),
  EAS_PROJECT_ID: projectId,
  AWS_REGION: required('AWS_REGION', extra.AWS_REGION),
  COGNITO_CLIENT_ID: required('COGNITO_CLIENT_ID', extra.COGNITO_CLIENT_ID),
  COGNITO_USERPOOL_ID: required('COGNITO_USERPOOL_ID', extra.COGNITO_USERPOOL_ID),
  GRAPHQL_ENDPOINT: required('GRAPHQL_ENDPOINT', extra.GRAPHQL_ENDPOINT),
  GRAPHQL_API_KEY: required('GRAPHQL_API_KEY', extra.GRAPHQL_API_KEY),

  // ── Codidge identifiers ────────────────────────────────────────────────────
  // Codidge scopes by organization + location (tenant). There is no "solution" dimension.
  TENANT_ID: required('TENANTID', extra.TENANTID),
  ORGANIZATION_ID: required('ORGANIZATION_ID', extra.ORGANIZATION_ID),

  /**
   * @deprecated Rentra's `TenantData` argument shape — `{ tenantId, solutionId }`.
   *
   * Still exported because ~23 call sites pass it to queries that have **not been ported to
   * Codidge**: trips, the open-trip pool, the earnings ledger, notifications (see
   * codidge-backend/docs/auth-architecture.md Appendix A.3). Those screens cannot work against
   * Codidge whatever we pass them, so rewriting the call sites now would only disguise that.
   *
   * `solutionId` is no longer *required* from the environment — Codidge has no such concept,
   * and keeping it required crashed the app at startup the moment TENANT_SOLUTION left .env.
   * The auth path uses TENANT_ID above; migrate the rest as each query is ported.
   */
  tenant: {
    tenantId: required('TENANTID', extra.TENANTID),
    solutionId: extra.TENANT_SOLUTION ?? '',
  },
};

/**
 * The customer app's Expo project id. The driver app was forked from it, so
 * until `eas init` is run here EAS_PROJECT_ID still points at the wrong project
 * and push tokens minted against it are unroutable.
 */
export const CUSTOMER_APP_EAS_PROJECT_ID = 'bf4ea28e-ea3b-4071-9b5c-b6fba74685dc';
