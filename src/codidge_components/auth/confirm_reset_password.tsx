import { StyleSheet, Text, View } from 'react-native';

export const ConfirmResetPassword = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ConfirmResetPassword widget</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
