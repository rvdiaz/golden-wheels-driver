import { ICustomer } from '../interfaces';

/**
 * Get customer's full name
 */
export const getCustomerFullName = (customer: ICustomer): string => {
  return `${customer.firstName} ${customer.lastName}`.trim();
};

/**
 * Get customer's initials
 */
export const getCustomerInitials = (customer: ICustomer): string => {
  const firstInitial = customer.firstName.charAt(0).toUpperCase();
  const lastInitial = customer.lastName.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // Format as +X (XXX) XXX-XXXX for international
  if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  // Return original if doesn't match expected formats
  return phone;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Format date for display
 */
export const formatCustomerDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};

/**
 * Get color for customer avatar based on name
 */
export const getAvatarColor = (name: string): string => {
  const colors = [
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Green
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
  ];

  const charCode = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
  return colors[charCode % colors.length];
};

/**
 * Search customers by query
 */
export const searchCustomers = (customers: ICustomer[], query: string): ICustomer[] => {
  if (!query.trim()) {
    return customers;
  }

  const lowercaseQuery = query.toLowerCase().trim();

  return customers.filter((customer) => {
    const fullName = getCustomerFullName(customer).toLowerCase();
    const email = customer.email.toLowerCase();
    const phone = customer.phone.replace(/\D/g, '');
    const searchPhone = query.replace(/\D/g, '');

    return (
      fullName.includes(lowercaseQuery) ||
      email.includes(lowercaseQuery) ||
      phone.includes(searchPhone) ||
      customer.customerID.toLowerCase().includes(lowercaseQuery)
    );
  });
};

/**
 * Check if customer was created recently (within last 7 days)
 */
export const isRecentCustomer = (customer: ICustomer): boolean => {
  const now = new Date();
  const createdDate = new Date(customer.createdAt);
  const diffMs = now.getTime() - createdDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};
