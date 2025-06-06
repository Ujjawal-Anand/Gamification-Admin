import React from 'react';
import { cn } from '@/lib/utils';

interface ModernTextInputProps {
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export const ModernTextInput: React.FC<ModernTextInputProps> = ({
  value,
  onChange,
  type = 'text',
  error,
  label,
  placeholder,
  maxLength,
  className,
}) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(
          'w-full p-4 rounded-2xl border bg-background',
          error ? 'border-destructive' : 'border-input',
          className
        )}
      />
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );
};

interface ModernSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  options: { value: string; label: string }[];
  className?: string;
}

export const ModernSelect: React.FC<ModernSelectProps> = ({
  value,
  onChange,
  error,
  label,
  options,
  className,
}) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full p-4 rounded-2xl border bg-background',
          error ? 'border-destructive' : 'border-input',
          className
        )}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );
};

interface MultiSelectOption {
  value: string;
  label: string;
}

interface ModernMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  label?: string;
  options: MultiSelectOption[];
}

export function ModernMultiSelect({
  value = [],
  onChange,
  error,
  label,
  options,
}: ModernMultiSelectProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              const newValue = value.includes(option.value)
                ? value.filter((v) => v !== option.value)
                : [...value, option.value];
              onChange(newValue);
            }}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              value.includes(option.value)
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
} 