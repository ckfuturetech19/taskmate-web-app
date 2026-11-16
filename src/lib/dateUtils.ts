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

export interface DetailedElapsed {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  remainingDays: number | null;
  progressPercentage: number | null;
  formattedShort: string;
  formattedLong: string;
}

/**
 * Calculates calendar-accurate elapsed time (years, months, days) between dates.
 * Fixes the flaw where days were calculated using `days % 30`.
 */
export const calculateDetailedElapsed = (
  startDateValue: any,
  endDateValue?: any,
  referenceDate: Date = new Date()
): DetailedElapsed => {
  const start = safeParseDate(startDateValue);
  if (!start) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      remainingDays: null,
      progressPercentage: null,
      formattedShort: '0d',
      formattedLong: '0 days',
    };
  }

  const end = endDateValue ? safeParseDate(endDateValue) : null;
  // If milestone has ended in the past, cap elapsed time at endDate
  const effectiveEnd = end && end < referenceDate ? end : referenceDate;

  if (start > effectiveEnd) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      remainingDays: end ? Math.max(0, Math.ceil((end.getTime() - referenceDate.getTime()) / (1000 * 3600 * 24))) : null,
      progressPercentage: 0,
      formattedShort: '0d',
      formattedLong: '0 days',
    };
  }

  let years = effectiveEnd.getFullYear() - start.getFullYear();
  let months = effectiveEnd.getMonth() - start.getMonth();
  let days = effectiveEnd.getDate() - start.getDate();

  if (days < 0) {
    // Borrow days from previous month
    const prevMonthDays = new Date(effectiveEnd.getFullYear(), effectiveEnd.getMonth(), 0).getDate();
    days += prevMonthDays;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const diffTime = Math.max(0, effectiveEnd.getTime() - start.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Compute remaining days and progress if endDate is set
  let remainingDays: number | null = null;
  let progressPercentage: number | null = null;

  if (end) {
    const todayMidnight = new Date(referenceDate);
    todayMidnight.setHours(0, 0, 0, 0);
    const endMidnight = new Date(end);
    endMidnight.setHours(0, 0, 0, 0);
    const startMidnight = new Date(start);
    startMidnight.setHours(0, 0, 0, 0);

    remainingDays = Math.round((endMidnight.getTime() - todayMidnight.getTime()) / (1000 * 3600 * 24));
    const totalDurationDays = Math.max(1, Math.round((endMidnight.getTime() - startMidnight.getTime()) / (1000 * 3600 * 24)));
    const elapsedDurationDays = Math.max(0, Math.min(totalDurationDays, Math.round((todayMidnight.getTime() - startMidnight.getTime()) / (1000 * 3600 * 24))));
    progressPercentage = Math.min(100, Math.round((elapsedDurationDays / totalDurationDays) * 100));
  }

  const shortParts: string[] = [];
  const longParts: string[] = [];

  if (years > 0) {
    shortParts.push(`${years}y`);
    longParts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }
  if (months > 0) {
    shortParts.push(`${months}m`);
    longParts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  }
  if (days > 0 || (years === 0 && months === 0)) {
    shortParts.push(`${days}d`);
    longParts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }

  return {
    years,
    months,
    days,
    totalDays,
    remainingDays,
    progressPercentage,
    formattedShort: shortParts.join(' '),
    formattedLong: longParts.join(' '),
  };
};
