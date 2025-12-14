import { isToday as dateFnsIsToday, isPast as dateFnsIsPast, format as dateFnsFormat } from 'date-fns';

/**
 * Safely parse a date string or value into a Date object
 * Returns null if the date is invalid
 */
export const safeParseDate = (dateValue: any): Date | null => {
  if (!dateValue) return null;
  
  try {
    const date = new Date(dateValue);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch (error) {
    console.error('Error parsing date:', error, dateValue);
    return null;
  }
};

/**
 * Safely format a date string
 * Returns a default value if the date is invalid
 */
export const safeDateString = (dateValue: any, defaultValue: string = ''): string => {
  const date = safeParseDate(dateValue);
  return date ? date.toISOString() : defaultValue;
};

/**
 * Check if a date value is valid
 */
export const isValidDate = (dateValue: any): boolean => {
  return safeParseDate(dateValue) !== null;
};

/**
 * Safely check if a date is today
 */
export const safeIsToday = (dateValue: any): boolean => {
  const date = safeParseDate(dateValue);
  if (!date) return false;
  try {
    return dateFnsIsToday(date);
  } catch (error) {
    console.error('Error checking isToday:', error, dateValue);
    return false;
  }
};

/**
 * Safely check if a date is in the past
 */
export const safeIsPast = (dateValue: any): boolean => {
  const date = safeParseDate(dateValue);
  if (!date) return false;
  try {
    return dateFnsIsPast(date);
  } catch (error) {
    console.error('Error checking isPast:', error, dateValue);
    return false;
  }
};

/**
 * Safely format a date
 */
export const safeFormat = (dateValue: any, formatStr: string, defaultValue: string = ''): string => {
  const date = safeParseDate(dateValue);
  if (!date) return defaultValue;
  try {
    return dateFnsFormat(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error, dateValue);
    return defaultValue;
  }
};
