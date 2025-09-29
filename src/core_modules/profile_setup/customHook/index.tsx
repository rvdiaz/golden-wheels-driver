import { useQuery } from '@apollo/client';
import { IProfileCategory, IProfileTask } from '../interfaces';
import { getSystemConfig } from '~/system_setting/graphql/queries';
import { apiKeyClient } from '~/store/config/apolloClient';

interface UseProfileSetupConfigResult {
  loading: boolean;
  categories: IProfileCategory[];
  allTasks: IProfileTask[];
}

export const useProfileSetupConfig = (): UseProfileSetupConfigResult => {
  const { data, loading } = useQuery<{
    getSystemConfig: {
      config:
        | {
            categories: IProfileCategory[];
          }
        | string;
    };
  }>(getSystemConfig, {
    client: apiKeyClient,
  });

  const rawConfig = data?.getSystemConfig?.config;

  const parsedConfig =
    typeof rawConfig === 'string' ? JSON.parse(rawConfig) : (rawConfig ?? { categories: [] });

  const categories: IProfileCategory[] = parsedConfig.categories ?? [];

  const allTasks: IProfileTask[] = categories.flatMap((category) => category.tasks || []);

  return {
    loading,
    categories,
    allTasks,
  };
};
