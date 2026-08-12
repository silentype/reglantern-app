import { TextareaHTMLAttributes, ReactNode, forwardRef, useId } from 'react';
import { clsx } from 'clsx';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  /** Label rendered above the field. Omit for a bare textarea. */
  label?: ReactNode;
  /** Shows a red asterisk after the label. Purely visual — doesn't set `required` on the field itself. */
  required?: boolean;
  /** Red border + message below the field. */
  error?: string;
  className?: string;
  containerClassName?: string;
}

/**
 * Multi-line text field — same visual language as `<Input>`, sized by `rows`
 * instead of a fixed height. Matches AdminPage's project-description field
 * and HealthCenterAdminPage's notes fields.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, required, error, className, containerClassName, id, rows = 3, ...props }, ref) => {
    const autoId = useId();
    const textareaId = id ?? autoId;
    return (
      <div className={containerClassName}>
        {label && (
          <label htmlFor={textareaId} className="block text-[13px] font-medium text-[#18181b] dark:text-[#f4f4f5] mb-1.5">
            {label} {required && <span className="text-[#dc2626]">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={clsx(
            'w-full px-3 py-2 border rounded-[6px] text-[14px] bg-white dark:bg-[#1c1f26] text-[#18181b] dark:text-[#f4f4f5] placeholder:text-[#a1a1aa] transition-colors focus:outline-none resize-none',
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
Textarea.displayName = 'Textarea';
