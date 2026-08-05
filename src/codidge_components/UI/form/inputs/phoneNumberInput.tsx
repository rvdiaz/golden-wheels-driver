import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, ChevronDown, Check } from 'lucide-react-native';
import { COUNTRIES } from '~/codidge_components/data';
import {
  extractDigitsOnly,
  formatPhoneNumber,
  parsePhoneNumber,
} from '~/codidge_components/helpers';
import { CountryData } from '~/codidge_components/interfaces';
import { theme } from '~/theme/theme';
import Text from '~/codidge_components/UI/text';
import { BottomSheetModal } from '~/components/bottomSheetModal';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PhoneInputProps {
  value: string;
  onChangeValue: (value: string) => void;
  defaultCountry?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  style?: any;
  inputStyle?: any;
  disabledSelection?: boolean;
  variant?: 'light' | 'dark';
}

// ─── Country row inside the picker sheet ─────────────────────────────────────

const CountryRow = ({
  item,
  isSelected,
  onPress,
}: {
  item: CountryData;
  isSelected: boolean;
  onPress: (item: CountryData) => void;
}) => (
  <TouchableOpacity
    style={[row.item, isSelected && row.itemSelected]}
    onPress={() => onPress(item)}
    activeOpacity={0.7}>
    <Text style={row.flag}>{item.flag}</Text>
    <Text style={[row.name, isSelected && row.nameSelected]} numberOfLines={1}>
      {item.name}
    </Text>
    <Text style={row.dial}>{item.dialCode}</Text>
    {isSelected && <Check size={14} color="#D4A853" />}
  </TouchableOpacity>
);

// ─── Main Component ───────────────────────────────────────────────────────────

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
  disabledSelection = false,
  variant = 'light',
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(
    COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0]
  );
  const [displayNumber, setDisplayNumber] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    const digits = extractDigitsOnly(text);
    const maxDigits = selectedCountry.maxLength || 15;
    const limited = digits.slice(0, maxDigits);
    setDisplayNumber(formatPhoneNumber(limited, selectedCountry));
    onChangeValue(`${selectedCountry.dialCode}${limited}`);
  };

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country);
    setShowPicker(false);
    setSearchQuery('');
    const digits = extractDigitsOnly(displayNumber);
    onChangeValue(`${country.dialCode}${digits}`);
    setDisplayNumber(formatPhoneNumber(digits, country));
  };

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dialCode.includes(searchQuery) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDark = variant === 'dark';

  // ── Dark variant ────────────────────────────────────────────────────────────

  if (isDark) {
    return (
      <>
        <View style={[dk.wrapper, style]}>
          {label && (
            <Text style={dk.label}>
              {label}
              {required && <Text style={{ color: '#EF4444' }}> *</Text>}
            </Text>
          )}

          <LinearGradient
            colors={['rgba(212,168,83,0.08)', 'rgba(212,168,83,0.03)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[dk.inputRow, error && dk.inputRowError, disabled && dk.disabled]}>
            {/* Country selector */}
            <TouchableOpacity
              style={dk.selector}
              onPress={() => !disabled && !disabledSelection && setShowPicker(true)}
              disabled={disabled || disabledSelection}
              activeOpacity={0.7}>
              <Text style={dk.flag}>{selectedCountry.flag}</Text>
              <Text style={dk.dial}>{selectedCountry.dialCode}</Text>
              {!disabledSelection && <ChevronDown size={14} color="rgba(212,168,83,0.6)" />}
            </TouchableOpacity>

            <View style={dk.divider} />

            <TextInput
              style={[dk.input, inputStyle]}
              value={displayNumber}
              onChangeText={handleNumberChange}
              placeholder={placeholder}
              placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="phone-pad"
              editable={!disabled}
              allowFontScaling={false}
              maxLength={selectedCountry.format ? 14 : 20}
            />
          </LinearGradient>

          {errorMessage && <Text style={dk.error}>{errorMessage}</Text>}
        </View>

        {/* Country picker — branded bottom sheet */}
        <BottomSheetModal
          visible={showPicker}
          onClose={() => {
            setShowPicker(false);
            setSearchQuery('');
          }}
          title="Select Country"
          scrollable={false}
          heightFraction={0.88}
          contentStyle={{ paddingHorizontal: 0, paddingTop: 0 }}>
          {/* Search bar */}
          <View style={picker.searchWrap}>
            <Search size={16} color="rgba(212,168,83,0.6)" style={{ marginRight: 10 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search country or dial code…"
              placeholderTextColor="rgba(255,255,255,0.3)"
              style={picker.searchInput}
              allowFontScaling={false}
              autoCorrect={false}
            />
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.code}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <CountryRow
                item={item}
                isSelected={selectedCountry.code === item.code}
                onPress={handleCountrySelect}
              />
            )}
          />
        </BottomSheetModal>
      </>
    );
  }

  // ── Light variant (original styling) ────────────────────────────────────────

  return (
    <>
      <View style={[lt.container, style]}>
        {label && (
          <Text style={lt.label}>
            {label}
            {required && <Text style={lt.required}> *</Text>}
          </Text>
        )}

        <View style={[lt.inputContainer, error && lt.inputError, disabled && lt.inputDisabled]}>
          <TouchableOpacity
            style={lt.countrySelector}
            onPress={() => !disabled && !disabledSelection && setShowPicker(true)}
            disabled={disabled}>
            <Text style={lt.flag}>{selectedCountry.flag}</Text>
            <Text style={lt.dialCode}>{selectedCountry.dialCode}</Text>
            {!disabledSelection && <Text style={lt.arrow}>▼</Text>}
          </TouchableOpacity>

          <View style={lt.divider} />

          <TextInput
            style={[lt.input, inputStyle]}
            value={displayNumber}
            onChangeText={handleNumberChange}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            editable={!disabled}
            maxLength={selectedCountry.format ? 14 : 20}
          />
        </View>

        {error && errorMessage && <Text style={lt.errorText}>{errorMessage}</Text>}
      </View>

      {/* Country picker — branded bottom sheet (consistent even in light mode) */}
      <BottomSheetModal
        visible={showPicker}
        onClose={() => {
          setShowPicker(false);
          setSearchQuery('');
        }}
        title="Select Country"
        scrollable={false}
        heightFraction={0.88}
        contentStyle={{ paddingHorizontal: 0, paddingTop: 0 }}>
        <View style={picker.searchWrap}>
          <Search size={16} color="rgba(212,168,83,0.6)" style={{ marginRight: 10 }} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search country or dial code…"
            placeholderTextColor="rgba(255,255,255,0.3)"
            style={picker.searchInput}
            allowFontScaling={false}
            autoCorrect={false}
          />
        </View>

        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.code}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <CountryRow
              item={item}
              isSelected={selectedCountry.code === item.code}
              onPress={handleCountrySelect}
            />
          )}
        />
      </BottomSheetModal>
    </>
  );
};

export default PhoneInput;

// ─── Dark styles ──────────────────────────────────────────────────────────────

const dk = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: 'white',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    gap: 10,
  },
  inputRowError: {
    borderColor: 'rgba(239,68,68,0.6)',
  },
  disabled: {
    opacity: 0.5,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flag: {
    fontSize: 20,
  },
  dial: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(212,168,83,0.2)',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    padding: 0,
    margin: 0,
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 5,
    marginLeft: 2,
  },
});

// ─── Picker sheet styles (shared by both variants) ────────────────────────────

const picker = StyleSheet.create({
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    backgroundColor: 'rgba(212,168,83,0.05)',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#ffffff',
    padding: 0,
    margin: 0,
  },
});

// ─── Country row styles ───────────────────────────────────────────────────────

const row = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(212,168,83,0.08)',
    gap: 12,
  },
  itemSelected: {
    backgroundColor: 'rgba(212,168,83,0.07)',
  },
  flag: {
    fontSize: 22,
  },
  name: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '400',
  },
  nameSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  dial: {
    fontSize: 13,
    color: 'rgba(212,168,83,0.7)',
    fontWeight: '500',
  },
});

// ─── Light styles (original, unchanged) ──────────────────────────────────────

const lt = StyleSheet.create({
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
    borderColor: '#EF4444',
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
});
