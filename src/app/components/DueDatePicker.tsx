import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format, parse, isValid, addDays, addMonths, addYears } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Tab, TabStrip } from './design-system/Tab';
import { RelativeDuePicker } from './RelativeDuePicker';
import type { DueDateRule, Task } from './TaskTableDynamic';

export interface DueDatePickerContentProps {
  /** Currently-selected date, parsed, for calendar highlighting. */
  selectedDate?: Date;
  onSelect: (date: string) => void;
  showToast?: boolean;
  /** Called after a selection is made (e.g. to close the enclosing popover). Omit for an inline, non-popover usage. */
  onAfterSelect?: () => void;
}

/**
 * The Quick Select / Custom Date / Calendar body of DueDatePicker, without
 * the Popover wrapper — so it can be shown as a plain inline box (e.g. on
 * the Components catalog page) as well as inside the real floating popover.
 */
export function DueDatePickerContent({ selectedDate, onSelect, showToast = true, onAfterSelect }: DueDatePickerContentProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const presets: { label: string; code: string; compute: () => Date }[] = [
    { label: 'Within 7 days', code: '7d', compute: () => addDays(new Date(), 7) },
    { label: 'Within 14 days', code: '14d', compute: () => addDays(new Date(), 14) },
    { label: 'Within 1 month', code: '1m', compute: () => addMonths(new Date(), 1) },
    { label: 'Within 3 months', code: '3m', compute: () => addMonths(new Date(), 3) },
    { label: 'Within 6 months', code: '6m', compute: () => addMonths(new Date(), 6) },
    { label: 'Within 1 year', code: '1y', compute: () => addYears(new Date(), 1) },
  ];

  return (
    <div className="flex">
      {/* Left Side - Quick Select */}
      <div className="p-3 border-r border-[#e4e4e7] dark:border-[#2a2f3a] w-[180px]">
        <div className="text-xs font-semibold text-[#18181b] dark:text-[#f4f4f5] mb-2">Quick Select</div>
        <div className="flex flex-col gap-1">
          {presets.map((preset) => (
            <button
              key={preset.code}
              className="w-full text-left px-3 py-2 text-xs text-[#18181b] dark:text-[#f4f4f5] bg-white dark:bg-[#1e2129] hover:bg-[#f4f4f5] dark:hover:bg-[#2a2f3a] rounded transition-colors"
              onClick={() => {
                const newDate = format(preset.compute(), 'MM/dd/yyyy');
                onSelect(preset.code);
                if (showToast) toast.success(`Set to ${newDate} (${preset.label})`);
                onAfterSelect?.();
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Side - Type Date & Calendar */}
      <div className="flex flex-col">
        {/* Manual Input */}
        <div className="p-3 border-b border-[#e4e4e7] dark:border-[#2a2f3a]">
          <div className="text-xs font-semibold text-[#18181b] dark:text-[#f4f4f5] mb-2">Custom Date</div>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
                if (inputValue && dateRegex.test(inputValue)) {
                  const parsedDate = parse(inputValue, 'MM/dd/yyyy', new Date());
                  if (isValid(parsedDate)) {
                    onSelect(inputValue);
                    if (showToast) toast.success(`Set to ${inputValue}`);
                    setInputValue('');
                    onAfterSelect?.();
                  }
                }
              }
            }}
            placeholder="mm/dd/yyyy"
            maxLength={10}
            className="w-full px-3 py-2 text-sm text-[#18181b] dark:text-[#f4f4f5] bg-white dark:bg-[#1e2129] border border-[#e4e4e7] dark:border-[#2a2f3a] rounded focus:outline-none focus:border-[#fc6]"
          />
        </div>

        {/* Calendar */}
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              const formattedDate = format(date, 'MM/dd/yyyy');
              onSelect(formattedDate);
              setInputValue('');
              if (showToast) toast.success(`Set to ${formattedDate}`);
              onAfterSelect?.();
            }
          }}
          initialFocus
        />
      </div>
    </div>
  );
}

interface DueDatePickerProps {
  value?: string; // Current date value in MM/dd/yyyy format or relative format like '7d', '1m'
  onSelect: (date: string) => void; // Callback when date is selected
  displayValue?: string; // Optional display value (e.g., "Within 7 days")
  placeholder?: string;
  triggerClassName?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  showToast?: boolean;
  /**
   * When provided, the popover offers a "Relative to / Specific date" tab
   * toggle and shows the rule picker in relative mode. Used for
   * Project Builder tasks; omit elsewhere.
   */
  relative?: {
    initialRule?: DueDateRule;
    siblingTasks?: Task[];
    projectStartDate?: string;
    projectEndDate?: string;
    excludeTaskId?: number;
    currentProjectName?: string;
    availableProjects?: Array<{ id: number; name: string; startDate?: string; endDate?: string }>;
    onSave: (rule: DueDateRule) => void;
  };
  /**
   * When provided, opening the popover writes ?<urlParam>=open to the URL
   * (and removes it on close) so the open state is shareable / screenshottable.
   * Each picker instance on a page should pass a unique key.
   */
  urlParam?: string;
}

export function DueDatePicker({
  value,
  onSelect,
  displayValue,
  placeholder = 'Select',
  triggerClassName,
  align = 'start',
  side = 'bottom',
  showToast = true,
  relative,
  urlParam,
}: DueDatePickerProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlOpen = urlParam ? searchParams.get(urlParam) === 'open' : false;
  const [calendarOpen, setCalendarOpenLocal] = useState(urlOpen);

  // When urlParam is provided, mirror open state in the URL so screengrabs
  // captured at the URL level reflect the popover-open view.
  const setCalendarOpen = (next: boolean) => {
    setCalendarOpenLocal(next);
    if (!urlParam) return;
    const params = new URLSearchParams(searchParams);
    if (next) params.set(urlParam, 'open');
    else params.delete(urlParam);
    setSearchParams(params, { replace: true });
  };

  // Keep local state in sync if URL changes externally (back/forward, paste).
  useEffect(() => {
    if (!urlParam) return;
    setCalendarOpenLocal(urlOpen);
  }, [urlParam, urlOpen]);
  // In project-builder context (relative prop provided), always default to
  // 'relative' per user preference -- even if the task already has a hard date.
  const [dateMode, setDateMode] = useState<'specific' | 'relative'>(
    relative ? 'relative' : 'specific'
  );

  // Parse the current value for the calendar
  const selectedDate = value && /^\d{2}\/\d{2}\/\d{4}$/.test(value)
    ? parse(value, 'MM/dd/yyyy', new Date())
    : undefined;

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <button
          className={triggerClassName}
          onClick={(e) => e.stopPropagation()}
        >
          {displayValue || (value ? value : <span className="text-[#6b7280] dark:text-[#a1a1aa]">{placeholder}</span>)}
          <ChevronDown className="size-[16px] text-[#6b7280] dark:text-[#a1a1aa] ml-1" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 max-h-[var(--radix-popover-content-available-height)] overflow-y-auto"
        align={align}
        side={side}
        collisionPadding={16}
      >
        {relative && (
          <div className="sticky top-0 z-10 bg-white dark:bg-[#1e2129] px-3 pt-3 pb-2 border-b border-[#e4e4e7] dark:border-[#2a2f3a]">
            <TabStrip>
              <Tab active={dateMode === 'relative'} onClick={() => setDateMode('relative')}>
                Relative to
              </Tab>
              <Tab active={dateMode === 'specific'} onClick={() => setDateMode('specific')}>
                Specific date
              </Tab>
            </TabStrip>
          </div>
        )}
        {relative && dateMode === 'relative' ? (
          <RelativeDuePicker
            initialRule={relative.initialRule}
            siblingTasks={relative.siblingTasks}
            projectStartDate={relative.projectStartDate}
            projectEndDate={relative.projectEndDate}
            excludeTaskId={relative.excludeTaskId}
            currentProjectName={relative.currentProjectName}
            availableProjects={relative.availableProjects}
            onSave={(rule) => {
              relative.onSave(rule);
              setCalendarOpen(false);
            }}
          />
        ) : (
          <DueDatePickerContent
            selectedDate={selectedDate}
            onSelect={onSelect}
            showToast={showToast}
            onAfterSelect={() => setCalendarOpen(false)}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
