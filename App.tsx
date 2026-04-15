import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AUTH_TYPE, AuthOptions, createAuthLink } from 'aws-appsync-auth-link';
import { Navigation } from '~/navigation';
import { UserRefresherWrapper } from '~/navigation/userRefresherWrapper';
import { ENV_Vars } from '~/store/env';
import { AuthProvider } from '~/codidge_components/auth/context';
import { AuthenticateScreen } from '~/store/user/authenticateScreen';
import { StripeWrapper } from '~/store/stripeConfig';

if (ENV_Vars.APP_ENV === 'development') {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const httpLink = new HttpLink({
  uri: ENV_Vars.GRAPHQL_ENDPOINT,
});

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: ENV_Vars.COGNITO_USERPOOL_ID,
      userPoolClientId: ENV_Vars.COGNITO_CLIENT_ID,
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

      return token || '';
    } catch (error) {
      console.error('Error getting token:', error);
      return '';
    }
  },
};

const authLink = createAuthLink({
  url: ENV_Vars.GRAPHQL_ENDPOINT,
  region: ENV_Vars.AWS_REGION,
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
  link: ApolloLink.from([removeTypeNameLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <AuthProvider>
          <UserRefresherWrapper>
            <Navigation />
          </UserRefresherWrapper>
          <AuthenticateScreen />
        </AuthProvider>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
