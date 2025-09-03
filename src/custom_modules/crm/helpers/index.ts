import { ContactCategory, ContactType } from '../interfaces';
import * as Icons from 'lucide-react-native';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const CONTACT_CATEGORY_OPTIONS = Object.values(ContactCategory).map((value) => ({
  label: capitalize(value),
  value,
}));

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
