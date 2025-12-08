import { useNavigation } from '@react-navigation/native';
import React from 'react';
import WebView from 'react-native-webview';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

export const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <PageSafeContainer>
      <Header showBack={true} title="Privacy Policy" onBack={() => navigation.goBack()} />
      <WebView source={{ uri: 'https://myvirtualboss.com/privacy-policy/' }} />
    </PageSafeContainer>
  );
};
