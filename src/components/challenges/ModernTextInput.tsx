import React from 'react';

interface ModernTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  label?: string;
}

export function ModernTextInput({ value, onChange, placeholder, maxLength, error, label }: ModernTextInputProps) {
  const [focused, setFocused] = React.useState(false);
  const showFloating = focused || value.length > 0;
  return (
    <div className="w-full relative mb-2">
      {label && (
        <label
          className={`absolute left-4 transition-all duration-200 pointer-events-none
            ${showFloating ? 'top-1 text-xs text-muted-foreground' : 'top-1/2 -translate-y-1/2 text-base text-muted-foreground'}
          `}
        >
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full px-4 py-4 text-lg rounded-2xl border transition-all bg-white shadow-sm
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-muted-foreground focus:border-black focus:ring-2 focus:ring-black'}
          outline-none
        `}
        aria-invalid={!!error}
        aria-describedby={error ? 'input-error' : undefined}
      />
      {maxLength && (
        <span className="absolute right-4 bottom-2 text-xs text-muted-foreground">
          {value.length}/{maxLength}
        </span>
      )}
      {error && (
        <div id="input-error" className="text-xs text-red-500 mt-1 ml-1">
          {error}
        </div>
      )}
    </div>
  );
} 