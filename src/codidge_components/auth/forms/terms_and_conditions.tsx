import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import { Header } from '~/codidge_components/UI/header';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

export const TermsAndConditions = ({ title, sourceUrl }: { title: string; sourceUrl: string }) => {
  const [modal, setmodal] = useState(false);

  return (
    <>
      <Text
        style={styles.termsLink}
        onPress={() => {
          setmodal(true);
        }}>
        {title}
      </Text>
      <View style={{ flex: 1 }}>
        <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
          <Header
            title={title}
            onBack={() => {
              setmodal(false);
            }}
            showBack={true}
          />
          <WebView source={{ uri: sourceUrl }} />
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  termsLink: {
    color: theme.colors.info,
    fontWeight: '600',
  },
});
