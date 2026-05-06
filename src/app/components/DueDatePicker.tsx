import { useState, useRef } from 'react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format, parse, isValid, addDays, addMonths, addYears } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface DueDatePickerProps {
  value?: string; // Current date value in MM/dd/yyyy format or relative format like '7d', '1m'
  onSelect: (date: string) => void; // Callback when date is selected
  displayValue?: string; // Optional display value (e.g., "Within 7 days")
  placeholder?: string;
  triggerClassName?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  showToast?: boolean;
}

export function DueDatePicker({
  value,
  onSelect,
  displayValue,
  placeholder = 'Select',
  triggerClassName,
  align = 'start',
  side = 'bottom',
  showToast = true
}: DueDatePickerProps) {
  const [inputValue, setInputValue] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
          {displayValue || (value ? value : <span className="text-[#6b7280]">{placeholder}</span>)}
          <ChevronDown className="size-[16px] text-[#71717a] ml-1" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align} side={side}>
        <div className="flex">
          {/* Left Side - Quick Select */}
          <div className="p-3 border-r border-[#e4e4e7] w-[180px]">
            <div className="text-xs font-semibold text-[#18181b] mb-2">Quick Select</div>
            <div className="flex flex-col gap-1">
              <button
                className="w-full text-left px-3 py-2 text-xs bg-white hover:bg-[#f5f5f5] rounded transition-colors"
                onClick={() => {
                  const newDate = format(addDays(new Date(), 7), 'MM/dd/yyyy');
                  onSelect('7d');
                  if (showToast) toast.success(`Set to ${newDate} (Within 7 days)`);
                  setCalendarOpen(false);
                }}
              >
                Within 7 days
              </button>
              <button
                className="w-full text-left px-3 py-2 text-xs bg-white hover:bg-[#f5f5f5] rounded transition-colors"
                onClick={() => {
                  const newDate = format(addDays(new Date(), 14), 'MM/dd/yyyy');
                  onSelect('14d');
                  if (showToast) toast.success(`Set to ${newDate} (Within 14 days)`);
                  setCalendarOpen(false);
                }}
              >
                Within 14 days
              </button>
              <button
                className="w-full text-left px-3 py-2 text-xs bg-white hover:bg-[#f5f5f5] rounded transition-colors"
                onClick={() => {
                  const newDate = format(addMonths(new Date(), 1), 'MM/dd/yyyy');
                  onSelect('1m');
                  if (showToast) toast.success(`Set to ${newDate} (Within 1 month)`);
                  setCalendarOpen(false);
                }}
              >
                Within 1 month
              </button>
              <button
                className="w-full text-left px-3 py-2 text-xs bg-white hover:bg-[#f5f5f5] rounded transition-colors"
                onClick={() => {
                  const newDate = format(addMonths(new Date(), 3), 'MM/dd/yyyy');
                  onSelect('3m');
                  if (showToast) toast.success(`Set to ${newDate} (Within 3 months)`);
                  setCalendarOpen(false);
                }}
              >
                Within 3 months
              </button>
              <button
                className="w-full text-left px-3 py-2 text-xs bg-white hover:bg-[#f5f5f5] rounded transition-colors"
                onClick={() => {
                  const newDate = format(addMonths(new Date(), 6), 'MM/dd/yyyy');
                  onSelect('6m');
                  if (showToast) toast.success(`Set to ${newDate} (Within 6 months)`);
                  setCalendarOpen(false);
                }}
              >
                Within 6 months
              </button>
              <button
                className="w-full text-left px-3 py-2 text-xs bg-white hover:bg-[#f5f5f5] rounded transition-colors"
                onClick={() => {
                  const newDate = format(addYears(new Date(), 1), 'MM/dd/yyyy');
                  onSelect('1y');
                  if (showToast) toast.success(`Set to ${newDate} (Within 1 year)`);
                  setCalendarOpen(false);
                }}
              >
                Within 1 year
              </button>
            </div>
          </div>

          {/* Right Side - Type Date & Calendar */}
          <div className="flex flex-col">
            {/* Manual Input */}
            <div className="p-3 border-b border-[#e4e4e7]">
              <div className="text-xs font-semibold text-[#18181b] mb-2">Custom Date</div>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setInputValue(newValue);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
                    if (inputValue && dateRegex.test(inputValue)) {
                      const parsedDate = parse(inputValue, 'MM/dd/yyyy', new Date());
                      if (isValid(parsedDate)) {
                        onSelect(inputValue);
                        if (showToast) toast.success(`Set to ${inputValue}`);
                        setInputValue('');
                        setCalendarOpen(false);
                      }
                    }
                  }
                }}
                placeholder="mm/dd/yyyy"
                maxLength={10}
                className="w-full px-3 py-2 text-sm border border-[#e4e4e7] rounded focus:outline-none focus:border-[#fc6]"
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
                  setCalendarOpen(false);
                }
              }}
              initialFocus
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
