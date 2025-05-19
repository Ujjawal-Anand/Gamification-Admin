import React from 'react';

interface ImportanceSelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  minLabel?: string;
  maxLabel?: string;
}

const options = [0, 1, 2, 3, 4, 5];

export function ImportanceSelector({ value, onChange, minLabel = 'Least', maxLabel = 'Most' }: ImportanceSelectorProps) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex w-full justify-between items-center gap-2 mb-2">
        <span className="text-xs text-muted-foreground w-10 text-left">{minLabel}</span>
        <div className="flex-1 flex justify-between gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold border transition-all
                ${value === String(opt)
                  ? 'bg-black text-white border-black shadow-md'
                  : 'bg-white text-black border-muted hover:border-black'}
                focus:outline-none focus:ring-2 focus:ring-black`}
              onClick={() => onChange(String(opt))}
              aria-pressed={value === String(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground w-10 text-right">{maxLabel}</span>
      </div>
    </div>
  );
} 