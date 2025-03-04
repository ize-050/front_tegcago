/**
 * Utility functions for formatting data in the application
 */

/**
 * Format a date string to a localized format
 * @param dateString - Date string to format
 * @returns Formatted date string in Thai locale (DD/MM/YYYY)
 */
export const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return '-';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Check if date is valid
  if (isNaN(date.getTime())) return '-';
  
  return date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Format a number as currency
 * @param value - Number to format
 * @param currency - Currency code (default: THB)
 * @param locale - Locale for formatting (default: th-TH)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  currency: string = 'THB',
  locale: string = 'th-TH'
): string => {
  if (value === null || value === undefined || value === '') return '-';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if value is a valid number
  if (isNaN(numValue)) return '-';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
};

/**
 * Format a number with commas and decimal places
 * @param value - Number to format
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number | string | null | undefined,
  decimalPlaces: number = 2
): string => {
  if (value === null || value === undefined || value === '') return '-';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if value is a valid number
  if (isNaN(numValue)) return '-';
  
  return numValue.toLocaleString('th-TH', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

/**
 * Format a phone number to a readable format
 * @param phoneNumber - Phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string | null | undefined): string => {
  if (!phoneNumber) return '-';
  
  // Remove non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phoneNumber;
};

/**
 * Truncate text to a specified length and add ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength: number = 50
): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};
