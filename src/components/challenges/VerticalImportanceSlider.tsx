import React from 'react';

interface VerticalImportanceSliderProps {
  value: string | undefined;
  onChange: (value: string) => void;
  minLabel?: string;
  maxLabel?: string;
}

const options = [5, 4, 3, 2, 1, 0]; // Top is 5 (Most), bottom is 0 (Least)
const TRACK_HEIGHT = 224; // px (h-56)
const STOP_COUNT = options.length;

export function VerticalImportanceSlider({ value, onChange, minLabel = 'Least', maxLabel = 'Most' }: VerticalImportanceSliderProps) {
  // Calculate fill height for the track
  const selectedIdx = value ? options.indexOf(Number(value)) : STOP_COUNT - 1;
  const fillHeight = ((STOP_COUNT - 1 - selectedIdx) / (STOP_COUNT - 1)) * TRACK_HEIGHT;

  return (
    <div className="flex flex-row items-center justify-center w-full min-h-[260px]">
      {/* Labels */}
      <div className="flex flex-col justify-between h-56 mr-3">
        <span className="text-sm font-semibold text-black mb-1">{maxLabel}</span>
        <span className="text-sm font-semibold text-black mt-1">{minLabel}</span>
      </div>
      {/* Slider track */}
      <div className="relative flex flex-col items-center h-56 w-14">
        {/* Track background */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-3 bg-muted-foreground/10 rounded-full" style={{ height: TRACK_HEIGHT }} />
        {/* Track fill */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3 bg-black rounded-full transition-all duration-300"
          style={{ height: fillHeight }}
        />
        {/* Stops and thumb */}
        <div className="flex flex-col justify-between h-full z-10">
          {options.map((opt, idx) => {
            const selected = value === String(opt);
            return (
              <div key={opt} className="relative flex items-center justify-center h-10">
                <button
                  type="button"
                  className={`relative w-8 h-8 flex items-center justify-center group focus:outline-none transition-all duration-200
                    ${selected ? 'scale-125 z-10' : 'hover:scale-110'}
                  `}
                  onClick={() => onChange(String(opt))}
                  aria-pressed={selected}
                  tabIndex={0}
                >
                  <span
                    className={`block w-6 h-6 rounded-full border-2 transition-all duration-200
                      ${selected ? 'bg-black border-black shadow-lg' : 'bg-white border-muted-foreground'}
                    `}
                  />
                  {selected && (
                    <span className="absolute left-10 text-base font-bold text-white bg-black rounded-full px-3 py-1 shadow-lg animate-fade-in">
                      {opt}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 