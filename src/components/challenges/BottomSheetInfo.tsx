import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { X } from 'lucide-react';
import React from 'react';

interface BottomSheetInfoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode; // for actions
}

export function BottomSheetInfo({ open, onOpenChange, icon, title, subtitle, description, children }: BottomSheetInfoProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-w-lg mx-auto rounded-t-3xl px-6 pt-6 pb-10">
        <button
          className="absolute left-4 top-4 p-2 rounded-full hover:bg-muted"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center mt-4">
          {icon && <div className="mb-6 text-5xl">{icon}</div>}
          <SheetTitle asChild>
            <div className="text-xl font-bold text-center mb-1">{title}</div>
          </SheetTitle>
          {subtitle && <div className="text-base text-muted-foreground text-center mb-2">{subtitle}</div>}
          {description && <div className="text-base text-center mb-6 text-muted-foreground">{description}</div>}
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
} 