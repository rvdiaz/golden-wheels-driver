import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LoadingSpinner } from './loadingSpinner';

interface ILoadingPageProps {
  style?: object; // optional extra style
}

export const PageLoading = ({ style }: ILoadingPageProps) => {
  return (
    <View style={[styles.container, style]}>
      <LoadingSpinner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // fill the screen
    justifyContent: 'center',
    alignItems: 'center',
  },
});
