import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import {
  extractDigitsOnly,
  formatPhoneNumber,
  parsePhoneNumber,
} from '~/codidge_components/helpers';
import { theme } from '~/theme/theme';

// Country data with phone codes and formats
export interface CountryData {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  format?: string; // e.g., "(XXX) XXX-XXXX" for US
  maxLength?: number;
}

export const COUNTRIES: CountryData[] = [
  {
    code: 'US',
    name: 'United States',
    dialCode: '+1',
    flag: '🇺🇸',
    format: '(XXX) XXX-XXXX',
    maxLength: 10,
  },
  {
    code: 'CA',
    name: 'Canada',
    dialCode: '+1',
    flag: '🇨🇦',
    format: '(XXX) XXX-XXXX',
    maxLength: 10,
  },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', maxLength: 10 },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', maxLength: 9 },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', maxLength: 11 },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', maxLength: 9 },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', maxLength: 9 },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', maxLength: 10 },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', maxLength: 10 },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', maxLength: 11 },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', maxLength: 10 },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', maxLength: 10 },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', maxLength: 11 },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', maxLength: 10 },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', maxLength: 10 },
];

// Main Component Props
export interface PhoneInputProps {
  value: string; // Full international format: +1234567890
  onChangeValue: (value: string) => void; // Returns full international format
  defaultCountry?: string; // Country code like 'US', 'GB', etc.
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  style?: any;
  inputStyle?: any;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeValue,
  defaultCountry = 'US',
  label,
  placeholder = 'Enter phone number',
  required = false,
  error = false,
  errorMessage,
  disabled = false,
  style,
  inputStyle,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(
    COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0]
  );
  const [displayNumber, setDisplayNumber] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize display number from value
  useEffect(() => {
    if (value) {
      const parsed = parsePhoneNumber(value);
      if (parsed.country) {
        setSelectedCountry(parsed.country);
        setDisplayNumber(formatPhoneNumber(parsed.number, parsed.country));
      } else {
        setDisplayNumber(formatPhoneNumber(parsed.number, selectedCountry));
      }
    } else {
      setDisplayNumber('');
    }
  }, []);

  const handleNumberChange = (text: string) => {
    // Extract only digits
    const digits = extractDigitsOnly(text);

    // Apply max length if specified
    const maxDigits = selectedCountry.maxLength || 15;
    const limitedDigits = digits.slice(0, maxDigits);

    // Format for display
    const formatted = formatPhoneNumber(limitedDigits, selectedCountry);
    setDisplayNumber(formatted);

    // Return full international format
    const fullNumber = `${selectedCountry.dialCode}${limitedDigits}`;
    onChangeValue(fullNumber);
  };

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
    setSearchQuery('');

    // Update the full number with new dial code
    const digits = extractDigitsOnly(displayNumber);
    const fullNumber = `${country.dialCode}${digits}`;
    onChangeValue(fullNumber);

    // Reformat display
    setDisplayNumber(formatPhoneNumber(digits, country));
  };

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}>
        {/* Country Selector */}
        <TouchableOpacity
          style={styles.countrySelector}
          onPress={() => !disabled && setShowCountryPicker(true)}
          disabled={disabled}>
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={styles.dialCode}>{selectedCountry.dialCode}</Text>
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Phone Number Input */}
        <TextInput
          style={[styles.input, inputStyle]}
          value={displayNumber}
          onChangeText={handleNumberChange}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          keyboardType="phone-pad"
          editable={!disabled}
          maxLength={selectedCountry.format ? 14 : 20} // Allow for formatting characters
        />
      </View>

      {error && errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search country..."
              placeholderTextColor="#9ca3af"
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    selectedCountry.code === item.code && styles.countryItemSelected,
                  ]}
                  onPress={() => handleCountrySelect(item)}>
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryDialCode}>{item.dialCode}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 5,
  },
  required: {
    color: 'red',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    minHeight: 48,
    paddingVertical: 10,
  },
  inputError: {
    borderColor: theme.colors.errorText,
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  flag: {
    fontSize: 24,
    marginRight: 8,
  },
  dialCode: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginRight: 4,
  },
  arrow: {
    fontSize: 10,
    color: '#6B7280',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    padding: 0,
  },
  errorText: {
    marginTop: 4,
    fontSize: 14,
    color: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalClose: {
    fontSize: 24,
    color: '#6B7280',
  },
  searchInput: {
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  countryItemSelected: {
    backgroundColor: '#EEF2FF',
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  countryDialCode: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default PhoneInput;
