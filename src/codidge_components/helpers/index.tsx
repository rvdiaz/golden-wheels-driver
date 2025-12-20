import { COUNTRIES } from '../data';
import { CountryData } from '../interfaces';

// Utility functions
export const extractDigitsOnly = (text: string): string => {
  return text.replace(/\D/g, '');
};

export const parsePhoneNumber = (
  phoneNumber: string
): { dialCode: string; number: string; country?: CountryData } => {
  // Remove all non-digit characters except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // Check if it starts with +
  if (cleaned.startsWith('+')) {
    // Try to match with known dial codes (sort by length descending to match longest first)
    const sortedCountries = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);

    for (const country of sortedCountries) {
      if (cleaned.startsWith(country.dialCode)) {
        const number = cleaned.slice(country.dialCode.length);
        return { dialCode: country.dialCode, number, country };
      }
    }

    // If no match found, try to extract first 1-3 digits as dial code
    const match = cleaned.match(/^\+(\d{1,3})(.*)$/);
    if (match) {
      return { dialCode: `+${match[1]}`, number: match[2] };
    }
  }

  // No dial code found, return as-is
  return { dialCode: '', number: extractDigitsOnly(cleaned) };
};

export const formatPhoneNumber = (number: string, country?: CountryData): string => {
  const digits = extractDigitsOnly(number);

  if (!country || !country.format) {
    // Generic formatting: add spaces every 3-4 digits
    return digits.replace(/(\d{3})(?=\d)/g, '$1 ');
  }

  // Apply country-specific format
  if (country.code === 'US' || country.code === 'CA') {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  // Default: add spaces
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ');
};

export const validatePhoneNumber = (
  number: string,
  country?: CountryData
): { isValid: boolean; message?: string } => {
  const digits = extractDigitsOnly(number);

  if (digits.length === 0) {
    return { isValid: false, message: 'Phone number is required' };
  }

  if (country && country.maxLength) {
    if (digits.length < country.maxLength) {
      return { isValid: false, message: `Phone number must be ${country.maxLength} digits` };
    }
    if (digits.length > country.maxLength) {
      return { isValid: false, message: `Phone number cannot exceed ${country.maxLength} digits` };
    }
  } else {
    // Generic validation
    if (digits.length < 7) {
      return { isValid: false, message: 'Phone number is too short' };
    }
    if (digits.length > 15) {
      return { isValid: false, message: 'Phone number is too long' };
    }
  }

  return { isValid: true };
};
