import { useReactiveVar } from '@apollo/client';
import React from 'react';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { crmSearhInput } from '../hooks/tabSelectionVar';
import * as Icons from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { theme } from '~/theme/theme';
import IconButton from '~/codidge_components/UI/button/IconButton';

export const SearchCrmBox = () => {
  const searchInputValue = useReactiveVar(crmSearhInput);

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <InputField
          value={searchInputValue}
          onChangeText={(e) => {
            crmSearhInput(e);
          }}
          placeholder="Search Contacts"
          placeholderTextColor="#fff"
          leftIcon={<Icons.Search size={16} color="#fff" />}
          style={{
            borderWidth: 0,
            backgroundColor: theme.colors.menuItemActive,
            color: '#fff',
            marginBottom: 0,
          }}
        />
      </View>
      <IconButton
        onPress={() => {
          console.log(':::show filters');
        }}
        style={styles.buttonStyles}
        icon={<Icons.ListFilter color="#fff" size={16} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  inputContainer: {
    flex: 1,
  },
  buttonStyles: {
    backgroundColor: theme.colors.menuItemActive,
    marginBottom: 12,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
