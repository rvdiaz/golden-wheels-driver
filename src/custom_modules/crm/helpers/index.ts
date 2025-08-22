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

export const getActivityIcon = (type: string) => {
  switch (type) {
    case 'call':
      return Icons.Phone;
    case 'email':
      return Icons.Mail;
    case 'meeting':
      return Icons.Calendar;
    default:
      return Icons.Activity;
  }
};

export const getActivityColor = (type: string) => {
  switch (type) {
    case 'call':
      return { bg: '#ECFDF5', icon: '#059669' };
    case 'email':
      return { bg: '#EFF6FF', icon: '#2563EB' };
    case 'meeting':
      return { bg: '#F3E8FF', icon: '#7C3AED' };
    default:
      return { bg: '#F9FAFB', icon: '#6B7280' };
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return '#FFFBEB';
    case 'medium':
      return '#FFF7ED';
    case 'low':
      return '#EFF6FF';
    default:
      return '#F9FAFB';
  }
};

export const getPriorityTextColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return '#D97706';
    case 'medium':
      return '#EA580C';
    case 'low':
      return '#2563EB';
    default:
      return '#374151';
  }
};

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
