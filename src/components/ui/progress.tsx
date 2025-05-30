"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

interface SegmentedProgressProps {
  segments: {
    label: string;
    value: number;
    isActive: boolean;
    isCompleted: boolean;
  }[];
  className?: string;
}

export function SegmentedProgress({ segments, className }: SegmentedProgressProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {segments.map((segment, index) => (
        <div key={segment.label} className="flex-1 relative">
          {/* Background bar (always greyed out) */}
          <div className="h-1.5 bg-primary/20" />
          {/* Progress bar (overlay) */}
          <div 
            className={cn(
              "h-1.5 transition-all duration-300 absolute top-0 left-0",
              segment.isActive ? "bg-primary" : segment.isCompleted ? "bg-primary" : "bg-transparent"
            )} 
            style={{ width: `${segment.value}%` }} 
          />
        </div>
      ))}
    </div>
  );
}

export { Progress }
