'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {  useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateFormData } from '@/store/challengeSlice';

const formSchema = z.object({
  enrollmentStartDate: z.date({
    required_error: 'Enrollment start date is required',
  }),
  enrollmentEndDate: z.date().optional(),
  activeStartDate: z.date({
    required_error: 'Active start date is required',
  }),
  activeEndDate: z.date({
    required_error: 'Active end date is required',
  }),
}).refine((data) => {
  // Enrollment end date must be after start date if provided
  if (data.enrollmentEndDate) {
    return data.enrollmentEndDate > data.enrollmentStartDate;
  }
  return true;
}, {
  message: 'Enrollment end date must be after start date',
  path: ['enrollmentEndDate'],
}).refine((data) => {
  // Active start date must be after enrollment start date
  return data.activeStartDate >= data.enrollmentStartDate;
}, {
  message: 'Active start date must be after enrollment start date',
  path: ['activeStartDate'],
}).refine((data) => {
  // Active end date must be after active start date
  return data.activeEndDate > data.activeStartDate;
}, {
  message: 'Active end date must be after active start date',
  path: ['activeEndDate'],
});

const questions = [
  {
    name: 'enrollmentStartDate',
    label: 'When does enrollment start?',
    render: (field: any) => (
      <DatePicker
        value={field.value}
        onChange={field.onChange}
        min={new Date()}
        placeholder="Pick a start date"
      />
    ),
  },
  {
    name: 'enrollmentEndDate',
    label: 'When does enrollment end? (optional)',
    render: (field: any, form: any) => (
      <DatePicker
        value={field.value}
        onChange={field.onChange}
        min={form.watch('enrollmentStartDate') || new Date()}
        placeholder="Pick an end date"
      />
    ),
  },
  {
    name: 'activeStartDate',
    label: 'When does the challenge become active?',
    render: (field: any, form: any) => (
      <DatePicker
        value={field.value}
        onChange={field.onChange}
        min={form.watch('enrollmentStartDate') || new Date()}
        placeholder="Pick an active start date"
      />
    ),
  },
  {
    name: 'activeEndDate',
    label: 'When does the challenge end?',
    render: (field: any, form: any) => (
      <DatePicker
        value={field.value}
        onChange={field.onChange}
        min={form.watch('activeStartDate') || new Date()}
        placeholder="Pick an active end date"
      />
    ),
  },
];

function DatePicker({ value, onChange, min, placeholder }: { value: Date | undefined, onChange: (date: Date | undefined) => void, min?: Date, placeholder?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal py-4 px-4 rounded-2xl text-lg bg-white shadow-sm',
            !value && 'text-muted-foreground'
          )}
        >
          {value ? value.toLocaleDateString() : <span>{placeholder}</span>}
          <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={min ? (date) => date < min : undefined}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function TimelineStep({
  subStep,
  form,
}: {
  subStep: number;
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
}) {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.challenge);

  useEffect(() => {
    const el = document.querySelector('button[aria-pressed],input');
    if (el) (el as HTMLElement).focus();
  }, [subStep]);

  // Update Redux store when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('Timeline form value changed:', value);
      // Convert dates to ISO strings for Redux
      const timelineData = {
        enrollmentStartDate: value.enrollmentStartDate?.toISOString() || '',
        enrollmentEndDate: value.enrollmentEndDate?.toISOString(),
        activeStartDate: value.activeStartDate?.toISOString() || '',
        activeEndDate: value.activeEndDate?.toISOString() || '',
      };
      dispatch(updateFormData({ timeline: timelineData }));
    });
    return () => subscription.unsubscribe();
  }, [form, dispatch]);

  const currentQuestion = questions[subStep];

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name={currentQuestion.name as any}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="text-xl font-semibold mb-4 block">{currentQuestion.label}</FormLabel>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentQuestion.name}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                {currentQuestion.render(field, form)}
              </motion.div>
            </AnimatePresence>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}

export function useTimelineForm() {
  const { formData } = useAppSelector((state) => state.challenge);
  
  return useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enrollmentStartDate: formData.timeline?.enrollmentStartDate ? new Date(formData.timeline.enrollmentStartDate) : undefined,
      enrollmentEndDate: formData.timeline?.enrollmentEndDate ? new Date(formData.timeline.enrollmentEndDate) : undefined,
      activeStartDate: formData.timeline?.activeStartDate ? new Date(formData.timeline.activeStartDate) : undefined,
      activeEndDate: formData.timeline?.activeEndDate ? new Date(formData.timeline.activeEndDate) : undefined,
    },
    mode: 'onChange',
  });
}

export const TIMELINE_TOTAL = questions.length; 