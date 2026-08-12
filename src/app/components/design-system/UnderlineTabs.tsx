import { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface UnderlineTabItem {
  value: string;
  label: ReactNode;
}

export interface UnderlineTabsProps {
  items: UnderlineTabItem[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Bottom-border tab row — transparent background, brand-yellow underline on
 * the active tab. Distinct from `Tab`/`TabStrip` (segmented-control style,
 * grey pill background). Used for HomePage's Projects/Health Centers switch,
 * HealthCenterAdminPage's detail tabs, and ComplianceReviewPage's Tasks/Preview
 * panel switch.
 */
export function UnderlineTabs({ items, active, onChange, className }: UnderlineTabsProps) {
  return (
    <div role="tablist" className={clsx('flex gap-0 -mb-px', className)}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={active === item.value}
          onClick={() => onChange(item.value)}
          className={clsx(
            'px-4 py-2 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors',
            active === item.value
              ? 'border-[#fc6] text-[#18181b] dark:text-[#f4f4f5]'
              : 'border-transparent text-[#6b7280] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-[#f4f4f5] hover:border-[#e4e4e7] dark:hover:border-[#2a2f3a]'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
