import { addDays, addWeeks, addMonths, addYears, parse, isValid } from 'date-fns';
import { DATE_FILTER_PRESETS } from '../constants';

/**
 * Utility Functions
 * Reusable helper functions for date parsing, formatting, and task operations
 */

/**
 * Parses a relative date filter string and returns the target date
 * Supports presets (overdue, today, week, month, year, none, 7d, 14d, 1m, 3m, 6m, 1y), hard dates (MM/dd/yyyy), and custom formats (e.g., "10d", "3w")
 * 
 * @param filterValue - The filter string to parse
 * @returns The calculated date or null if invalid
 */
export function parseDueDateFilter(filterValue: string): Date | null {
  if (!filterValue) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Special handling for "none" - this means tasks with NO due date
  if (filterValue === 'none') {
    return null; // Special marker for filtering tasks without due dates
  }
  
  // Special handling for "overdue" - returns yesterday (anything before today)
  if (filterValue === 'overdue') {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday;
  }
  
  // Special handling for "today" - returns today's date
  if (filterValue === 'today') {
    return today;
  }
  
  // Special handling for "week" - returns end of current week (Sunday)
  if (filterValue === 'week') {
    const endOfWeek = new Date(today);
    const daysUntilSunday = 7 - today.getDay();
    endOfWeek.setDate(today.getDate() + daysUntilSunday);
    return endOfWeek;
  }
  
  // Special handling for "2weeks" - returns 14 days from today
  if (filterValue === '2weeks') {
    return addDays(today, 14);
  }
  
  // Special handling for "month" - returns end of current month
  if (filterValue === 'month') {
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return endOfMonth;
  }
  
  // Special handling for "year" - returns end of current year
  if (filterValue === 'year') {
    const endOfYear = new Date(today.getFullYear(), 11, 31); // December 31st
    return endOfYear;
  }
  
  // Check for preset values
  const presetMap: Record<string, Date> = {
    '7d': addDays(today, 7),
    '14d': addDays(today, 14),
    '1m': addMonths(today, 1),
    '3m': addMonths(today, 3),
    '6m': addMonths(today, 6),
    '1y': addYears(today, 1),
  };
  
  if (presetMap[filterValue]) {
    return presetMap[filterValue];
  }
  
  // Check if it's a hard date (MM/dd/yyyy)
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (dateRegex.test(filterValue)) {
    const parsedDate = parse(filterValue, 'MM/dd/yyyy', new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }
  
  // Check for custom relative format (e.g., "10d", "3w", "2m", "1y")
  const relativeRegex = /^(\d+)([dwmy])$/;
  const match = filterValue.match(relativeRegex);
  if (match) {
    const amount = parseInt(match[1], 10);
    const unit = match[2];
    
    const unitMap: Record<string, (date: Date, amount: number) => Date> = {
      'd': addDays,
      'w': addWeeks,
      'm': addMonths,
      'y': addYears,
    };
    
    if (unitMap[unit]) {
      return unitMap[unit](today, amount);
    }
  }
  
  return null;
}

/**
 * Displays a date filter value in a user-friendly format
 * 
 * @param filterValue - The filter value to display
 * @returns A human-readable string representation
 */
export function displayDueDateFilter(filterValue: string): string {
  if (!filterValue) return 'All';
  
  // Check for preset values
  const preset = DATE_FILTER_PRESETS.find(p => p.value === filterValue);
  if (preset) {
    return preset.label;
  }
  
  // Check if it's a hard date
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (dateRegex.test(filterValue)) {
    return filterValue;
  }
  
  // Check for custom relative format
  const relativeRegex = /^(\d+)([dwmy])$/;
  const match = filterValue.match(relativeRegex);
  if (match) {
    const amount = match[1];
    const unit = match[2];
    const unitName = unit === 'd' ? 'day' : unit === 'w' ? 'week' : unit === 'm' ? 'month' : 'year';
    const plural = amount === '1' ? '' : 's';
    return `Within ${amount} ${unitName}${plural}`;
  }
  
  return filterValue;
}

/**
 * Gets the display value for a relative date (used in DueDatePicker)
 * Returns a friendly label for preset values, undefined for hard dates
 * 
 * @param dateValue - The date value to display
 * @returns Display label or undefined
 */
export function getDisplayValueForDate(dateValue?: string): string | undefined {
  if (!dateValue) return undefined;
  
  const preset = DATE_FILTER_PRESETS.find(p => p.value === dateValue);
  return preset?.label;
}

/**
 * Generates a contextual description based on task title
 * Used in MultiFileUploadPanel to provide helpful context
 * 
 * @param taskTitle - The title of the task
 * @returns A descriptive string explaining what to upload
 */
export function getTaskDescription(taskTitle: string): string {
  const title = taskTitle.toLowerCase();
  
  const descriptionMap: Array<[string[], string]> = [
    [['enrollment', 'documents'], 'Upload and verify all required enrollment documentation for patient records'],
    [['compliance', 'training'], 'Complete training materials and upload certificate of completion'],
    [['clinical report', 'submit'], 'Compile and upload quarterly clinical data reports for regulatory submission'],
    [['irb', 'review meeting', 'schedule'], 'Upload required documentation for institutional review board meeting preparation'],
    [['protocol', 'documentation'], 'Update and upload revised protocol documents with tracked changes'],
    [['verify', 'data entry'], 'Upload verified data validation reports and corrective action logs'],
    [['monitoring', 'checklist'], 'Prepare and upload all required documents for site monitoring visit'],
    [['safety', 'assessment'], 'Upload patient safety reports and adverse event documentation'],
    [['archive', 'materials'], 'Upload final study materials and closeout documentation for archival'],
    [['consent', 'forms'], 'Review and upload updated informed consent forms for all study participants'],
    [['budget', 'amendments'], 'Upload revised budget documentation and financial amendment requests'],
    [['ethics', 'committee'], 'Upload complete ethics committee application package with supporting documents'],
  ];
  
  for (const [keywords, description] of descriptionMap) {
    if (keywords.some(keyword => title.includes(keyword))) {
      return description;
    }
  }
  
  return '';
}

/**
 * Formats a file size in bytes to a human-readable string
 * 
 * @param bytes - The file size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Debounces a function call
 * Used for performance optimization in search and filter operations
 * 
 * @param func - The function to debounce
 * @param wait - The delay in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}