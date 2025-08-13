import React from 'react';
import { StyleSheet, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '~/components/Header';

export const AddContactForm = ({ disposeModalHandler }: { disposeModalHandler: () => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="New Contact"
        showBack
        onBack={() => {
          disposeModalHandler();
        }}
      />
      <View>
        <TouchableOpacity style={styles.button} onPress={disposeModalHandler}>
          close
        </TouchableOpacity>
        <Text>sds</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  button: {
    backgroundColor: '#000',
  },
});
