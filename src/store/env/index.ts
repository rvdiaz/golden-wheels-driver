import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

function required(name: string, value?: string): string {
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export const ENV_Vars = {
  APP_ENV: required('APP_ENV', extra.APP_ENV),
  AWS_REGION: required('AWS_REGION', extra.AWS_REGION),
  COGNITO_CLIENT_ID: required('COGNITO_CLIENT_ID', extra.COGNITO_CLIENT_ID),
  COGNITO_USERPOOL_ID: required('COGNITO_USERPOOL_ID', extra.COGNITO_USERPOOL_ID),
  GRAPHQL_ENDPOINT: required('GRAPHQL_ENDPOINT', extra.GRAPHQL_ENDPOINT),
  GRAPHQL_API_KEY: required('GRAPHQL_API_KEY', extra.GRAPHQL_API_KEY),
  tenant: {
    tenantId: required('TENANTID', extra.TENANTID),
    solutionId: required('TENANT_SOLUTION', extra.TENANT_SOLUTION),
  },
  STRIPE_PUBLISHABLE_KEY: required('GRAPHQL_ENDPOINT', extra.STRIPE_PUBLISHABLE_KEY),
};
