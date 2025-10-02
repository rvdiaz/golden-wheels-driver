import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Constants from 'expo-constants';
import Navigation from './src/navigation';
import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

const authLink = setContext(async (_, { headers }) => {
  try {
    const tokenTest = await cognitoUserPoolsTokenProvider.getTokens();

    const idToken = tokenTest?.idToken?.toString();

    return {
      headers: {
        ...headers,
        Authorization: idToken,
      },
    };
  } catch (error) {
    console.warn('No token found, continuing without auth header');
    return {
      headers: {
        ...headers,
      },
    };
  }
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
        <Navigation />
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
