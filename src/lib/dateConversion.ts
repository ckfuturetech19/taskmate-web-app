/**
 * Convert a local DateTime to UTC ISO string
 * @param localDate - Date object or ISO string in local time
 * @returns ISO string in UTC
 */
export const localToUtc = (localDate: Date | string): string => {
  const date = typeof localDate === 'string' ? new Date(localDate) : localDate;
  return date.toISOString();
};

/**
 * Convert UTC DateTime to local time Date object
 * @param utcString - ISO string in UTC
 * @returns Date object representing the UTC time
 */
export const utcToLocal = (utcString: string): Date => {
  return new Date(utcString);
};

/**
 * Get UTC offset in milliseconds
 * @returns UTC offset in milliseconds
 */
export const getUtcOffset = (): number => {
  return new Date().getTimezoneOffset() * 60 * 1000;
};

/**
 * Convert UTC ISO string to local display time
 * @param utcString - ISO string in UTC
 * @returns Date object representing local time equivalent
 */
export const utcToLocalDisplay = (utcString: string): Date => {
  const utcDate = new Date(utcString);
  // Add timezone offset to get local time equivalent
  const offset = new Date().getTimezoneOffset() * 60 * 1000;
  return new Date(utcDate.getTime() + offset);
};

/**
 * Format a date for time input (HH:mm)
 * @param date - Date object
 * @returns Formatted time string
 */
export const formatTimeForInput = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Combine a date and time for storing as UTC
 * @param date - Date object
 * @param timeString - Time string in format HH:mm
 * @returns UTC ISO string
 */
export const combineDateTimeToUtc = (date: Date, timeString: string): string => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const localDateTime = new Date(date);
  localDateTime.setHours(hours, minutes, 0, 0);
  return localDateTime.toISOString();
};
