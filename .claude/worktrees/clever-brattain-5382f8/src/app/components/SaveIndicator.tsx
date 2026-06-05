import { Check } from 'lucide-react';
import { useEffect, useState, memo } from 'react';

interface SaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved';
}

export const SaveIndicator = memo(function SaveIndicator({ status }: SaveIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      setIsFading(true);
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setIsFading(false);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setIsVisible(true);
      setIsFading(false);
    }
  }, [status]);

  if (!isVisible) return null;

  if (status === 'saving') {
    return (
      <div className="flex items-center gap-1.5 text-[#71717a] text-xs transition-opacity duration-300">
        <div className="flex gap-0.5">
          <span className="animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}>•</span>
          <span className="animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }}>•</span>
          <span className="animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }}>•</span>
        </div>
      </div>
    );
  }

  if (status === 'saved') {
    return (
      <div className={`flex items-center gap-1.5 text-[#16a34a] text-xs transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="rounded-full bg-[#16a34a] p-0.5">
          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
        </div>
        <span>Saved</span>
      </div>
    );
  }

  return null;
});