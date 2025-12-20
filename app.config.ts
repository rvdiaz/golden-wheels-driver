import { ExpoConfig } from '@expo/config-types';
import { ConfigContext } from 'expo/config';

const isDevelopment = process.env.EAS_BUILD_PROFILE === 'development';

export default (arg: ConfigContext): ExpoConfig => {
  const { config } = arg;

  const devOnlyPlugins = isDevelopment ? ['expo-dev-client'] : [];

  return {
    ...config,
    plugins: [...config.plugins!, ...devOnlyPlugins],
    /*  android: {
      ...config.android,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
      package: process.env.ANDROID_PACKAGE_NAME || 'com.myvirtualboss.realestate',
    }, */
    extra: {
      ...config.extra,
      GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT || 'http://192.168.1.145:4001/graphql',
      //EAS_BUILD_PROFILE: process.env.EAS_BUILD_PROFILE || 'production',
    },
  } as ExpoConfig;
};
