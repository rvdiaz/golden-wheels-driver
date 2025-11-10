import { Alert, Linking } from 'react-native';
import { ContactCategory, ContactSort, ContactType, IContact } from '../interfaces';

export function capitalize(str: string) {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  return str;
}

export const CONTACT_CATEGORY_OPTIONS = Object.values(ContactCategory).map((value) => ({
  label: capitalize(value),
  value,
}));

// Email validation helper
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const CONTACT_TYPE_OPTIONS = Object.values(ContactType).map((value) => ({
  label: capitalize(value),
  value,
}));

export const getStatusColor = (status?: string) => {
  switch (status) {
    case 'qualified':
      return { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' };
    case 'contacted':
      return { bg: '#FFFBEB', text: '#92400E', border: '#FED7AA' };
    case 'new':
      return { bg: '#EFF6FF', text: '#1E40AF', border: '#DBEAFE' };
    default:
      return { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' };
  }
};

export const getTypeColor = (type?: string) => {
  switch (type) {
    case 'buyer':
      return { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' };
    case 'seller':
      return { bg: '#FFF7ED', text: '#9A3412', border: '#FED7AA' };
    case 'investor':
      return { bg: '#F3E8FF', text: '#6B21A8', border: '#DDD6FE' };
    default:
      return { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' };
  }
};

// Category color mapping
export const getCategoryColors = (category: string) => {
  const categoryColors = {
    [ContactCategory.AGENT]: {
      bg: '#BBF7D0',
      text: '#166534',
    },
    [ContactCategory.BUYER]: {
      bg: '#DDD6FE',
      text: '#5B21B6',
    },
    [ContactCategory.SELLER]: {
      bg: '#FECACA',
      text: '#991B1B',
    },
    [ContactCategory.RENTER]: {
      bg: '#FEF08A',
      text: '#A16207',
    },
    [ContactCategory.LANDLORD]: {
      bg: '#99F6E4',
      text: '#0F766E',
    },
    [ContactCategory.FSBO]: {
      bg: '#BFDBFE',
      text: '#1E40AF',
    },
    [ContactCategory.FRBO]: {
      bg: '#FED7AA',
      text: '#C2410C',
    },
    [ContactCategory.EXPIRED]: {
      bg: '#FCA5A5',
      text: '#7F1D1D',
    },
    // 🔄 updated
    [ContactCategory.INVESTOR]: {
      bg: '#D9F99D',
      text: '#365314',
    },
  };

  return (
    categoryColors[category as ContactCategory] || {
      bg: '#F3F4F6',
      text: '#374151',
    }
  );
};

// Generate initials
export const getUserInitials = (firstName: string, lastName: string) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${firstInitial}${lastInitial}`;
};

export const formatFollowUpDate = (followUpdate: string) => {
  const formatDate = new Date(followUpdate).toLocaleDateString();
  const date = new Date(followUpdate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return `Today at ${formatDate}`;
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow at ${formatDate}`;
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };
  return `${date.toLocaleDateString('en-US', options)} at ${formatDate}`;
};

export const handleCallContact = (phone: string) => {
  console.log(':::phone', phone);

  if (!phone) {
    Alert.alert('Error', 'No phone number available for this contact');
    return;
  }

  const url = `tel:${phone}`;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert('Error', 'Phone call not supported on this device');
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error('Error opening dialer', err));
};

export const handleSmsContact = (phone: string) => {
  if (!phone) {
    Alert.alert('Error', 'No phone number available for this contact');
    return;
  }

  const url = `sms:${phone}`;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert('Error', 'SMS not supported on this device');
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error('Error opening SMS app', err));
};

export const handleEmailContact = (email: string) => {
  if (!email) {
    Alert.alert('Error', 'No email address available for this contact');
    return;
  }

  const url = `mailto:${email}`;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert('Error', 'Email not supported on this device');
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error('Error opening email app', err));
};

export const formatPhoneNumber = (phone: string) => {
  if (!phone) return '';

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format only if it has 10 digits (U.S. standard)
  if (cleaned.length === 10) {
    const area = cleaned.slice(0, 3);
    const middle = cleaned.slice(3, 6);
    const last = cleaned.slice(6);
    return `(${area}) ${middle}-${last}`;
  }

  // For other lengths (international, etc.), just return as-is
  return phone;
};

export const formatPhoneNumberInput = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 10); // Limit to 10 digits

  const length = cleaned.length;

  if (length === 0) return '';
  if (length <= 3) return `(${cleaned}`;
  if (length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};
// To store in DB (unformatted)
export const normalizePhoneNumber = (value: string) => {
  return value.replace(/\D/g, '');
};

export const sortContacts = (contacts: IContact[], sort: ContactSort): IContact[] => {
  return [...contacts].sort((a, b) => {
    switch (sort) {
      case ContactSort.NAME_ASC:
        return a.firstName.localeCompare(b.firstName);
      case ContactSort.NAME_DESC:
        return b.firstName.localeCompare(a.firstName);
      case ContactSort.DATE_NEWEST:
        // Assuming you have a `createdAt` or `dateAdded` field
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case ContactSort.DATE_OLDEST:
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });
};
