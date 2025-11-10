import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import Constants from 'expo-constants';
import Navigation from './src/navigation';
import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AUTH_TYPE, AuthOptions, createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { PricingPlanModal } from '~/custom_modules/iap/components/pricingPlanModal';

if (Constants.expoConfig?.extra?.EAS_BUILD_PROFILE === 'development') {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const httpLink = new HttpLink({
  uri: Constants.expoConfig?.extra?.GRAPHQL_ENDPOINT,
});

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: Constants.expoConfig?.extra?.COGNITO_USERPOOL_ID,
      userPoolClientId: Constants.expoConfig?.extra?.COGNITO_CLIENT_ID,
      loginWith: {
        email: true,
      },
    },
  },
});

const auth: AuthOptions = {
  type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
  jwtToken: async () => {
    try {
      const tokens = await cognitoUserPoolsTokenProvider.getTokens();
      const token = tokens?.idToken?.toString();

      if (!token) {
        throw new Error('No ID token available');
      }

      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      throw error;
    }
  },
};

const authLink = createAuthLink({
  url: Constants.expoConfig?.extra?.GRAPHQL_ENDPOINT,
  region: Constants.expoConfig?.extra?.AWS_REGION,
  auth,
});

const removeTypeName = (key: unknown, value: unknown) => (key === '__typename' ? undefined : value);

const removeTypeNameLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    if (response.data) {
      response.data = JSON.parse(JSON.stringify(response.data), removeTypeName);
    }
    return response;
  });
});

const client = new ApolloClient({
  link: ApolloLink.from([
    removeTypeNameLink,
    authLink,
    createSubscriptionHandshakeLink(
      {
        url: Constants.expoConfig?.extra?.GRAPHQL_ENDPOINT,
        region: Constants.expoConfig?.extra?.AWS_REGION,
        auth,
      },
      httpLink
    ),
  ]),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <Navigation />
        <PricingPlanModal />
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
