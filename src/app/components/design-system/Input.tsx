import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  /** Label rendered above the field. Omit for a bare input (e.g. inline table-row editing). */
  label?: ReactNode;
  /** Shows a red asterisk after the label. Purely visual — doesn't set `required` on the input itself. */
  required?: boolean;
  /** Red border + message below the field. */
  error?: string;
  className?: string;
  containerClassName?: string;
}

/**
 * Plain text field — the canonical `w-full h-[40px] px-3 border rounded-[6px]
 * focus:border-[#fc6]` pattern hand-rolled across AdminPage, SettingsPage,
 * HealthCenterAdminPage, and others. Single source of truth for that styling.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, required, error, className, containerClassName, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
      <div className={containerClassName}>
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-medium text-[#18181b] dark:text-[#f4f4f5] mb-1.5">
            {label} {required && <span className="text-[#dc2626]">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full h-[40px] px-3 py-2 border rounded-[6px] text-[14px] bg-white dark:bg-[#1c1f26] text-[#18181b] dark:text-[#f4f4f5] placeholder:text-[#a1a1aa] transition-colors focus:outline-none',
            error
              ? 'border-[#dc2626] focus:border-[#dc2626]'
              : 'border-[#e4e4e7] dark:border-[#2a2f3a] focus:border-[#fc6]',
            'disabled:bg-[#f4f4f5] dark:disabled:bg-[#1c1f26] disabled:text-[#a1a1aa] disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-[12px] text-[#dc2626]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
