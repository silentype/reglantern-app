import { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '../ui/command';

export interface MultiSelectFilterOption {
  value: string;
  label: string;
}

export interface MultiSelectFilterChipProps {
  icon: ReactNode;
  label: string;
  /** Currently-selected values. Include `'all'` to represent the unfiltered state. */
  selected: string[];
  options: MultiSelectFilterOption[];
  /** Called with the toggled value — `'all'` included. Caller owns the array logic. */
  onToggle: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The sentinel value in `selected`/`onToggle` that means "unfiltered". Defaults to `'all'`. */
  allValue?: string;
  allLabel?: string;
  /** Set false to hide the search box — for short static lists like Needs Attention. */
  showSearch?: boolean;
  searchPlaceholder?: string;
  emptyLabel?: string;
  className?: string;
}

/**
 * Filter-bar chip that opens a searchable, multi-select checklist —
 * the Assigned / Project / Category pattern on the Tasks page. Selecting
 * "all" clears the filter and closes the popover; individual options stay
 * open so several can be picked in a row.
 */
export function MultiSelectFilterChip({
  icon,
  label,
  selected,
  options,
  onToggle,
  open,
  onOpenChange,
  allValue = 'all',
  allLabel = 'All',
  showSearch = true,
  searchPlaceholder = 'Search…',
  emptyLabel = 'No results found.',
  className,
}: MultiSelectFilterChipProps) {
  const isFiltered = !selected.includes(allValue);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 text-[12px] ${
            isFiltered
              ? 'border border-[#fc6] bg-[#fc6] text-[#18181b]'
              : 'border border-[#e4e4e7] dark:border-[#2a2f3a] bg-[#f4f4f5] dark:bg-[#1c1f26] text-[#6b7280] dark:text-[#a1a1aa] hover:bg-[#e4e4e7] dark:hover:bg-[#2a2f3a]'
          } ${className ?? ''}`}
        >
          {icon}
          {label} {isFiltered && `(${selected.length})`}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          {showSearch && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            <CommandEmpty>{emptyLabel}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onToggle('all');
                  onOpenChange(false);
                }}
              >
                <FilterCheckbox checked={selected.includes('all')} />
                {allLabel}
              </CommandItem>
              {options.map((opt) => (
                <CommandItem key={opt.value} value={opt.value} onSelect={() => onToggle(opt.value)}>
                  <FilterCheckbox checked={selected.includes(opt.value)} />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function FilterCheckbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
        checked ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7] dark:border-[#2a2f3a]'
      }`}
    >
      {checked && <Check className="h-3 w-3" />}
    </div>
  );
}
