import { useQuery } from '@apollo/client';
import {
  IProfileCategory,
  IProfileTask,
  ISystemSetting,
  ITaskSchemaItem,
  OnBoardingSchema,
} from '../interfaces';
import { getSystemConfig } from '~/system_setting/graphql/queries';
import { apiKeyClient } from '~/store/config/apolloClient';

interface UseProfileSetupConfigResult {
  loading: boolean;
  categories: IProfileCategory[];
  allTasks: IProfileTask[];
  onBoardingSchema: OnBoardingSchema;
  tasksConfiguration: ITaskSchemaItem[];
  legal: {
    mvbTemrs: string;
    mvbTemrsOfUse: string;
    mvbPolicy: string;
    tuTerms: string;
  };
}

export const useSystemSettings = (): UseProfileSetupConfigResult => {
  const { data, loading } = useQuery<{
    getSystemConfig: {
      config: ISystemSetting | string;
      tasksConfiguration: [ITaskSchemaItem];
    };
  }>(getSystemConfig, {
    client: apiKeyClient,
  });

  const rawConfig = data?.getSystemConfig?.config;

  const parsedConfig =
    typeof rawConfig === 'string' ? JSON.parse(rawConfig) : (rawConfig ?? { categories: [] });

  const categories: IProfileCategory[] = parsedConfig.categories ?? [];

  const allTasks: IProfileTask[] = categories.flatMap((category) => category.tasks || []);

  const onBoardingSchema = parsedConfig.onBoardingSchema;

  const legal = parsedConfig.legal;

  return {
    loading,
    categories,
    allTasks,
    onBoardingSchema,
    tasksConfiguration: data?.getSystemConfig?.tasksConfiguration ?? [],
    legal,
  };
};
