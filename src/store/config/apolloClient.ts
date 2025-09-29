import Constants from 'expo-constants';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const apiKeyClient = new ApolloClient({
  link: new HttpLink({
    uri: Constants.expoConfig?.extra?.GRAPHQL_ENDPOINT,
    headers: {
      'x-api-key': Constants.expoConfig?.extra?.GRAPHQL_API_KEY,
    },
  }),
  cache: new InMemoryCache(),
});
