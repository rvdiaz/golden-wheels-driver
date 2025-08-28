import { ExpiredStatus } from '../interfaces';

export const EXP_STATUS_OPTIONS = Object.values(ExpiredStatus).map((value) => ({
  label: value,
  value,
}));

// Format price with commas
export const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

// Format number with commas
export const formatNumber = (num: string): string => {
  return parseInt(num).toLocaleString('en-US');
};
