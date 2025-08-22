import React, { ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownProps {
  data: DropdownItem[];
  placeholder?: string;
  value: string | null;
  onChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  search?: boolean;
  label?: string;
  required?: boolean;
  icon?: React.ReactElement; // <-- must be ReactElement, not ReactNode
}

const DropdownComponent: React.FC<DropdownProps> = ({
  data,
  placeholder = 'Select item',
  value,
  onChange,
  error,
  errorMessage,
  search = false,
  label,
  required,
  icon,
}) => {
  const renderItem = (item: DropdownItem) => (
    <View style={styles.item}>
      <Text style={styles.textItem}>{item.label}</Text>
      {item.value === value && icon}
    </View>
  );

  return (
    <View>
      {label && (
        <Text style={styles.labelStyle}>
          {label} {required && <Text style={{ color: 'red' }}> *</Text>}
        </Text>
      )}
      <Dropdown
        style={[styles.dropdown, error ? styles.errorBorder : null]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search={search}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Search..."
        value={value}
        onChange={(item) => onChange(item.value)}
        renderLeftIcon={() => (
          <View style={styles.icon}>
            {icon ? icon : <AntDesign color="black" name="Safety" size={16} />}
          </View>
        )} // <-
        renderItem={renderItem}
      />
      {error && errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    height: 48,
    backgroundColor: 'white',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    marginBottom: 12,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#ccc',
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    marginLeft: 16,
    color: 'red',
    fontSize: 12,
  },
  labelStyle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 5,
  },
});
