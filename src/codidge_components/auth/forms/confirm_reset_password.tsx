import { StyleSheet, View } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

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
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 17,
    color: '#333',
  },
});
