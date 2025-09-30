import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '~/theme/theme';

interface IProfileWrapper {
  header?: React.ReactNode;
  children: React.ReactNode;
}

export const ProfileScreensWrapper = ({ header, children }: IProfileWrapper) => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>{header}</View>
      {/* Form Container */}
      <View style={styles.formContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.headerBackground,
  },
  headerContainer: {
    paddingTop: 80,
  },
  formContainer: {
    flex: 1,
    backgroundColor: theme.colors.headerModal,
    marginTop: 24,
    borderTopLeftRadius: theme.borderRadius.xxl,
    borderTopRightRadius: theme.borderRadius.xxl,
    overflow: 'hidden',
  },
});
