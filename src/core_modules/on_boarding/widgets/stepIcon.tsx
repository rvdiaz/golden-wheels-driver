import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

export const StepIcon = ({
  icon: Icon,
  keyboardVisible,
}: {
  icon: FC<SvgProps>;
  keyboardVisible?: boolean;
}) => {
  return (
    <View
      style={[
        styles.iconContainer,
        keyboardVisible && {
          padding: 8,
        },
      ]}>
      <Text style={styles.mainIcon}>
        <Icon color="#FFF" />
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: theme.colors.accent,
    padding: 12,
    borderRadius: theme.borderRadius.lg,
  },
  mainIcon: {
    fontSize: 30,
    textAlign: 'center',
    color: '#fff',
  },
});
