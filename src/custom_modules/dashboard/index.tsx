import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

export const Dashboard: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Dash here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bodyBackground,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
