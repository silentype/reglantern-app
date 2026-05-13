import { parse, differenceInCalendarDays } from 'date-fns';

/**
 * Formats a MM/dd/yyyy due date as a short "mm/dd/yy" label and returns
 * overdue/days-until metadata used by the inline badge styling.
 */
export function formatRelativeDate(dateString: string) {
  const date = parse(dateString, 'MM/dd/yyyy', new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const daysUntil = differenceInCalendarDays(targetDate, today);

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const formattedDate = `${month}/${day}/${year}`;

  const isOverdue = daysUntil < 0;
  const color = isOverdue ? 'text-red-600' : 'text-[#18181b]';

  return { text: formattedDate, color, isOverdue, daysUntil };
}

/**
 * Background + border tokens for the inline due-date badge. Overdue rows
 * read red; everything else uses the neutral surface. `daysUntil` is
 * accepted for parity with future "warning when due soon" styling but is
 * currently unused.
 */
export function getDateBadgeStyles(_daysUntil: number, isOverdue: boolean) {
  if (isOverdue) return { bg: 'bg-red-100', border: 'border-red-200' };
  return { bg: 'bg-white', border: 'border-[#e4e4e7]' };
}
