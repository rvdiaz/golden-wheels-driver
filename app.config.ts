import { ExpoConfig } from '@expo/config-types';
import { ConfigContext } from 'expo/config';

const EAS_PROJECT_ID = 'bf4ea28e-ea3b-4071-9b5c-b6fba74685dc';
const PROJECT_SLUG = 'golden-wheels';
const OWNER = 'rvdiaz1994';
// App production config
const APP_NAME = 'Golden Wheels';
const BUNDLE_IDENTIFIER = 'com.codidge.goldenwheels';
const PACKAGE_NAME = 'com.codidge.goldenwheels';
const ICON = './assets/logo.jpeg';
const ADAPTIVE_ICON = './assets/logo.jpeg';
const SCHEME = 'app-scheme';
const VERSION = '1.0.2';
const BUILD_NUMBER = 2;

export default (arg: ConfigContext): ExpoConfig => {
  const { config } = arg;
  const isDevelopment = process.env.APP_ENV === 'development';

  const { name, bundleIdentifier, icon, adaptiveIcon, packageName, scheme } = getDynamicAppConfig(
    (process.env.APP_ENV as 'development' | 'preview' | 'production') || 'development'
  );

  const devOnlyPlugins = isDevelopment ? ['expo-dev-client'] : [];

  return {
    ...config,
    name: name,
    version: VERSION, // Automatically bump your project version with `npm version patch`, `npm version minor` or `npm version major`.
    slug: PROJECT_SLUG, // Must be consistent across all environments.
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    icon: icon,
    scheme: scheme,
    owner: OWNER,
    plugins: [
      'expo-notifications',
      [
        '@stripe/stripe-react-native',
        {
          merchantIdentifier: bundleIdentifier,
          enableGooglePay: true,
        },
      ],
      ...devOnlyPlugins,
    ],
    ios: {
      supportsTablet: false,
      bundleIdentifier: bundleIdentifier,
      buildNumber: `${BUILD_NUMBER}`,
      infoPlist: {
        // existing
        ITSAppUsesNonExemptEncryption: false,
      },
      icon: 'assets/logo.png',
    },
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    android: {
      package: process.env.ANDROID_PACKAGE_NAME || packageName,
      versionCode: BUILD_NUMBER,
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        backgroundColor: '#ffffff',
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
    },
    extra: {
      ...config.extra,
      //TODO::: TAKE APPLE APP ID FROM APPLE
      /*  "APPLE_APP_ID": 6752781766,*/
      APP_ENV: process.env.APP_ENV,
      AWS_REGION: process.env.AWS_REGION,
      COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
      COGNITO_USERPOOL_ID: process.env.COGNITO_USERPOOL_ID,
      GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
      //GRAPHQL_ENDPOINT: 'http://localhost:4001/graphql',
      GRAPHQL_API_KEY: process.env.GRAPHQL_API_KEY,
      TENANTID: process.env.TENANTID,
      TENANT_SOLUTION: process.env.TENANT_SOLUTION,
      eas: {
        projectId: EAS_PROJECT_ID,
      },
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  } as ExpoConfig;
};

// Dynamically configure the app based on the environment.
// Update these placeholders with your actual values.
export const getDynamicAppConfig = (environment: 'development' | 'preview' | 'production') => {
  if (environment === 'production') {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: SCHEME,
    };
  }

  if (environment === 'preview') {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      icon: ICON,
      adaptiveIcon: ICON,
      scheme: `${SCHEME}-prev`,
    };
  }

  return {
    name: `${APP_NAME} Development`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    icon: ICON,
    adaptiveIcon: ICON,
    scheme: `${SCHEME}-dev`,
  };
};
