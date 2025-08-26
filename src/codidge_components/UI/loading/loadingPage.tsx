import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LoadingSpinner } from './loadingSpinner';
import { Header } from '../header';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ILoadingPageProps {
  headerTitle?: string;
  style?: object; // optional extra style
}

export const PageLoading = ({ style, headerTitle }: ILoadingPageProps) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {headerTitle && (
        <Header showBack={true} title={headerTitle} onBack={() => navigation.goBack()} />
      )}
      <View style={styles.centerContent}>
        <LoadingSpinner color="gray" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
