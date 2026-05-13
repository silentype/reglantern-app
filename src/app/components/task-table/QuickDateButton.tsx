import { memo } from 'react';

export const QuickDateButton = memo(
  ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      className="w-full text-left px-3 py-2 text-xs bg-white hover:bg-[#f5f5f5] rounded transition-colors"
      onClick={onClick}
    >
      {label}
    </button>
  ),
);
QuickDateButton.displayName = 'QuickDateButton';
