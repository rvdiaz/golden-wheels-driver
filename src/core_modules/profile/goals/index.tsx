import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';

export const GoalsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Goals" showBack onBack={() => navigation.goBack()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});
