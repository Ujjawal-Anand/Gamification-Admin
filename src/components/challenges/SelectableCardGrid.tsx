import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Info } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  icon: ReactNode;
  description?: string;
}

interface SelectableCardGridProps {
  options: Option[];
  value: string | undefined;
  onChange: (value: string) => void;
  className?: string;
  onInfoClick?: (option: Option) => void;
}

export function SelectableCardGrid({ options, value, onChange, className, onInfoClick }: SelectableCardGridProps) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 gap-4', className)}>
      {options.map((option) => (
        <div key={option.value} className="relative">
          <button
            type="button"
            className={cn(
              'flex flex-col items-center justify-center border rounded-xl p-6 bg-white transition-all shadow-sm w-full',
              value === option.value
                ? 'border-black shadow-md ring-2 ring-black'
                : 'border-muted hover:border-black',
              'focus:outline-none focus:ring-2 focus:ring-black'
            )}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
          >
            <div className="mb-2 text-3xl">{option.icon}</div>
            <div className="text-base font-medium text-center">{option.label}</div>
          </button>
          {onInfoClick && (
            <button
              type="button"
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
              onClick={() => onInfoClick(option)}
              tabIndex={-1}
              aria-label={`Info about ${option.label}`}
            >
              <Info className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
} 