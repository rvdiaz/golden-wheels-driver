import { gql } from '@apollo/client';

export const getSystemConfig = gql`
  query getSystemConfig {
    getSystemConfig {
      config
    }
  }
`;
