import React from 'react';
import WebView from 'react-native-webview';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

export const PrivacyPolicyScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <PageSafeContainer>
      <Header showBack={true} title="Privacy Policy" onBack={onBack} />
      <WebView source={{ uri: 'https://www.goldenwheelsprivatechauffeur.com/?terms-conditions' }} />
    </PageSafeContainer>
  );
};
