import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LoadingSpinner } from '~/codidge_components/UI/loading/loadingSpinner';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

export const LoadingFirstScreen = () => {
  return (
    <PageSafeContainer style={styles.container}>
      <View style={styles.gradientContainer}>
        {/* Base gradient */}
        <LinearGradient
          colors={['#1D0D66', '#2D1B8F', '#1D0D66']}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <View style={styles.centerContent}>
        <LoadingSpinner />
      </View>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
