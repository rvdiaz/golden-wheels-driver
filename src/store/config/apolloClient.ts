import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ENV_Vars } from '../env';

export const apiKeyClient = new ApolloClient({
  link: new HttpLink({
    uri: ENV_Vars.GRAPHQL_ENDPOINT,
    headers: {
      'x-api-key': ENV_Vars.GRAPHQL_API_KEY,
    },
  }),
  cache: new InMemoryCache(),
});
