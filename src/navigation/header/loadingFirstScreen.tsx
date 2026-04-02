import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { LoadingSpinner } from '~/codidge_components/UI/loading/loadingSpinner';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

export const LoadingFirstScreen = () => {
  return (
    <BodyWrapper>
      <PageSafeContainer style={styles.container}>
        <View style={styles.centerContent}>
          <Image
            source={require('/assets/logo_welcome.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <LoadingSpinner />
        </View>
      </PageSafeContainer>
    </BodyWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 210,
    height: 100,
  },
});
