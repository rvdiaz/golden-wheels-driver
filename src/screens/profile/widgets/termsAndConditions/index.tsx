import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { theme } from '~/theme/theme';
import { TAB_BAR_CLEARANCE } from '~/navigation/bottomBar';

export const TermsAndConditions = ({ onBack }: { onBack: () => void }) => {
  return (
    <BodyWrapper>
      <PageSafeContainer>
        <Header
          contentContainerStyle={{
            backgroundColor: 'transparent',
          }}
          titleStyles={{
            color: theme.colors.primaryText,
          }}
          leftWidget={
            <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
              <ArrowLeft size={18} color={theme.colors.secondaryText} />
            </TouchableOpacity>
          }
          title="Terms And Conditions"
          showBack
        />
        <WebView source={{ uri: 'https://www.goldenwheelsprivatechauffeur.com/?terms=true' }}
          style={styles.webview}
        />
      </PageSafeContainer>
    </BodyWrapper>
  );
};

const styles = StyleSheet.create({
  // The floating tab bar overlays this screen, so end the web view above it.
  webview: { flex: 1, marginBottom: TAB_BAR_CLEARANCE },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
