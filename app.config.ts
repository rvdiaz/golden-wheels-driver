import { ExpoConfig } from '@expo/config-types';
import { ConfigContext } from 'expo/config';

// Driver app's own EAS project, under the `rvdiaz1994` account. Distinct from
// the customer app's project (bf4ea28e-ea3b-4071-9b5c-b6fba74685dc). Drives
// updates.url AND getExpoPushTokenAsync({ projectId }), so it must stay in sync
// with the account you are logged into as `eas whoami`.
const EAS_PROJECT_ID = '906f0570-999c-4ab9-8ff3-23a02e9e2538';

const PROJECT_SLUG = 'golden-wheels-driver';
const OWNER = 'rvdiaz1994';
// App production config
const APP_NAME = 'Golden Wheels Driver';
const BUNDLE_IDENTIFIER = 'com.codidge.goldenwheelsdriver';
const PACKAGE_NAME = 'com.codidge.goldenwheelsdriver';
// Both derived from assets/logo.png. iOS takes the lockup full-bleed and opaque at 1024
// (Apple's required size — the old logo512.jpg was only 512). Android adaptive icons crop
// the outer 18dp of a 108dp canvas, so the foreground is a transparent PNG with the lockup
// scaled into the center 52%.
const ICON = './assets/icon-ios.png';
const ADAPTIVE_ICON = './assets/icon-android-foreground.png';
const MONOCHROME_ICON = './assets/icon-android-monochrome.png';
const VERSION = '1.1.3';
const BUILD_NUMBER = 4;

export default (arg: ConfigContext): ExpoConfig => {
  const { config } = arg;
  const isDevelopment = process.env.APP_ENV === 'development';

  const { name, bundleIdentifier, icon, adaptiveIcon, packageName } = getDynamicAppConfig(
    (process.env.APP_ENV as 'development' | 'preview' | 'production') || 'development'
  );

  const devOnlyPlugins = isDevelopment ? ['expo-dev-client'] : [];

  return {
    ...config,
    name: name,
    version: VERSION, // Automatically bump your project version with `npm version patch`, `npm version minor` or `npm version major`.
    slug: PROJECT_SLUG, // Must be consistent across all environments.
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    icon: icon,
    owner: OWNER,
    plugins: [
      'expo-notifications',
      'expo-font',
      [
        'expo-build-properties',
        {
          android: {
            compileSdkVersion: 36,
            targetSdkVersion: 36,
            kotlinVersion: '2.0.21',
          },
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
        NSCameraUsageDescription:
          'This app may use the camera for uploading photos related to vehicle listings.',
        ITSAppUsesNonExemptEncryption: false,
      },
      icon: icon,
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
        monochromeImage: MONOCHROME_ICON,
        backgroundColor: '#000000',
      },
      buildProperties: {
        kotlinVersion: '2.0.21',
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
    },
    extra: {
      ...config.extra,
      APPLE_APP_ID: process.env.APPLE_APP_ID,
      APP_ENV: process.env.APP_ENV,
      AWS_REGION: process.env.AWS_REGION,
      COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
      COGNITO_USERPOOL_ID: process.env.COGNITO_USERPOOL_ID,
      GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
      GRAPHQL_API_KEY: process.env.GRAPHQL_API_KEY,
      TENANTID: process.env.TENANTID,
      ORGANIZATION_ID: process.env.ORGANIZATION_ID,
      eas: {
        projectId: EAS_PROJECT_ID,
      },
      VERSION: `${VERSION}(${BUILD_NUMBER})`,
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
    };
  }

  if (environment === 'preview') {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}`,
      packageName: `${PACKAGE_NAME}.preview`,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
    };
  }

  return {
    name: `${APP_NAME} Development`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}`,
    icon: ICON,
    adaptiveIcon: ADAPTIVE_ICON,
  };
};
