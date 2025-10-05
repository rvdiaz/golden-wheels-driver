import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import InputField from './inputField';
import Text from '../../text';

interface Option {
  value: string;
  valueToShow: React.ReactNode;
}

interface AutocompleteInputProps {
  options: Option[];
  onSelect: (value: string) => void;
  placeholder?: string;
  label?: string;
  defaultValue?: Option;
  required?: boolean;
}

export const AutoCompleteInput: React.FC<AutocompleteInputProps> = ({
  options,
  onSelect,
  label,
  placeholder = 'Type to search...',
  defaultValue,
  required = false,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue?.value ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<Option[]>([]);

  const isValidOption = (val: string) => options.some((opt) => opt.value === val);

  useEffect(() => {
    const lowerInput = inputValue.toLowerCase();
    setFiltered(options.filter((opt) => opt.value.toLowerCase().includes(lowerInput)));
  }, [inputValue, options]);

  const handleSelect = (value: string) => {
    setInputValue(value);
    onSelect(value);
    setIsOpen(false);
    Keyboard.dismiss();
  };

  // Handle outside press by listening to keyboard dismiss
  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsOpen(false);
      if (!isValidOption(inputValue) && required) {
        setInputValue('');
        onSelect('');
      } else if (isValidOption(inputValue)) {
        onSelect(inputValue);
      }
    });

    return () => keyboardHideListener.remove();
  }, [inputValue, required]);

  return (
    <View style={{ width: '100%' }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <InputField
        value={inputValue}
        placeholder={placeholder}
        style={styles.input}
        onChangeText={(text) => {
          setInputValue(text);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && filtered.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.value}
          style={styles.dropdown}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => handleSelect(item.value)}>
              {typeof item.valueToShow === 'string' ? (
                <Text>{item.valueToShow}</Text>
              ) : (
                item.valueToShow
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  dropdown: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: '#fff',
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
