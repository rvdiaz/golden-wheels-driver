import { gql } from '@apollo/client';

export const getSystemConfig = gql`
  query getSystemConfig {
    getSystemConfig {
      config
      tasksConfiguration {
        key
        description
        goalKey
        goalType
        label
        fields {
          goalKey
          goalType
          label
        }
      }
    }
  }
`;
