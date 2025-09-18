module.exports = ({ config }) => {
  const isDevelopment = process.env.EAS_BUILD_PROFILE === 'development';
  const devPlugins = isDevelopment ? ['expo-dev-client'] : [];

  return {
    ...config,
    expo: {
      name: 'My Virtual Voss',
      slug: 'my-own-boss',
      version: '1.0.0',
      web: {
        favicon: './src/assets/favicon.png',
      },
      experiments: {
        tsconfigPaths: true,
      },
      plugins: [
        [
          'expo-contacts',
          {
            contactsPermission:
              'Allow $(PRODUCT_NAME) to access your contacts to import business contacts.',
          },
        ],
        'expo-notifications',
        ...devPlugins,
      ],
      orientation: 'portrait',
      icon: './src/assets/icon.png',
      userInterfaceStyle: 'light',
      splash: {
        image: './src/assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        supportsTablet: true,
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './src/assets/adaptive-icon.png',
          backgroundColor: '#ffffff',
        },
        "googleServicesFile": "./google-services.json",
        "package": "com.pedroprcm.pushtests"
      },
      extra: {
        /* "GRAPHQL_ENDPOINT": "http://localhost:4000/graphql", */
        GRAPHQL_ENDPOINT:
          'https://mliqeu5tf5hqnafxp55hwaekd4.appsync-api.us-east-1.amazonaws.com/graphql',
        COGNITO_USERPOOL_ID: 'us-east-1_4aq3CuAAr',
        COGNITO_CLIENT_ID: '77e3rsh7jds1lmvsuq4jt8j0h0',
        TENANTID: 'usa-my-own-boss',
        eas: {
          // projectId: '777406c6-4dff-46d3-a876-88315ae37291',
          projectId: '9b532a27-2e37-4304-92e1-19fc698ee6c3',
        },
        EAS_BUILD_PROFILE: process.env.EAS_BUILD_PROFILE
      },
    },
  };
};
