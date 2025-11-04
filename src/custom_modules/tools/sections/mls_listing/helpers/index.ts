import { ExpiredStatus } from '../interfaces';
import moment from 'moment';

export const EXP_STATUS_OPTIONS = Object.values(ExpiredStatus).map((value) => ({
  label: value,
  value,
}));

// Format price with commas
export const formatPrice = (price: number, digits = 0): string => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};

// Format number with commas
export const formatNumber = (num: string): string => {
  return parseInt(num).toLocaleString('en-US');
};

export const calculateDaysOnMarket = (mlsLastStatusDate: string) => {
  try {
    // Parse the date string with moment
    const mlsDate = moment.utc(mlsLastStatusDate, 'YYYY-MM-DD HH:mm:ss UTC');

    if (!mlsDate.isValid()) {
      console.log('Invalid date:', mlsLastStatusDate);
      return 0;
    }

    const currentDate = moment();
    const daysDifference = currentDate.diff(mlsDate, 'days');

    return Math.abs(daysDifference); // Use Math.abs to handle future dates
  } catch (error) {
    console.error('Date parsing error:', error);
    return 0;
  }
};
