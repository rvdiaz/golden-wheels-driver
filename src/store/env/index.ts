import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

function required(name: string, value?: string): string {
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export const ENV = {
  APP_ENV: required('APP_ENV', extra.APP_ENV),
  AWS_REGION: required('AWS_REGION', extra.AWS_REGION),
  COGNITO_CLIENT_ID: required('COGNITO_CLIENT_ID', extra.COGNITO_CLIENT_ID),
  COGNITO_USERPOOL_ID: required('COGNITO_USERPOOL_ID', extra.COGNITO_USERPOOL_ID),
  GRAPHQL_ENDPOINT: required('GRAPHQL_ENDPOINT', extra.GRAPHQL_ENDPOINT),
};
