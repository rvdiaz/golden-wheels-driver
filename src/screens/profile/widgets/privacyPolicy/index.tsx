import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

export const PrivacyPolicyScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <BodyWrapper>
      <PageSafeContainer>
        <Header
          contentContainerStyle={{
            backgroundColor: 'transparent',
          }}
          titleStyles={{
            color: '#FFF',
          }}
          leftWidget={
            <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
              <ArrowLeft size={18} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          }
          title="Terms And Conditions"
          showBack
        />
        <WebView source={{ uri: 'https://www.goldenwheelsprivatechauffeur.com/?terms=true' }} />
      </PageSafeContainer>
    </BodyWrapper>
  );
};

const styles = StyleSheet.create({
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
