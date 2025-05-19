import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ModernTextInput } from '../ModernTextInput';
import { SelectableCardGrid } from '../SelectableCardGrid';
import { Trophy, Star, Gift, Award } from 'lucide-react';
import { Input } from '@/components/ui/input';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const formSchema = z.object({
  rewardTypes: z.array(z.string()).min(1, 'Please select at least one reward type'),
  points: z.string().optional(),
  badge: z.string().optional(),
  sponsoredReward: z.string().optional(),
});

const rewardOptions = [
  { value: 'points', label: 'Points', icon: <Trophy />, description: 'Award points to participants' },
  { value: 'badge', label: 'Badge', icon: <Star />, description: 'Award a special badge' },
  { value: 'sponsored', label: 'Sponsored Reward', icon: <Gift />, description: 'Offer a sponsored reward' },
];

const questions = [
  {
    name: 'rewardTypes',
    label: 'What types of rewards will you offer?',
    render: (field: any, form: any) => {
      const selectedRewards = form.watch('rewardTypes') || [];
      return (
        <SelectableCardGrid
          options={rewardOptions}
          value={field.value}
          onChange={(value) => {
            const currentValues = form.getValues('rewardTypes') || [];
            if (currentValues.includes(value)) {
              field.onChange(currentValues.filter((v: string) => v !== value));
            } else {
              field.onChange([...currentValues, value]);
            }
          }}
        />
      );
    },
  },
  {
    name: 'points',
    label: 'How many points will participants earn?',
    render: (field: any, _form: any, fieldState: any) => (
      <div className="w-full">
        <label className="block text-sm text-muted-foreground mb-2">Points</label>
        <Input
          type="number"
          value={field.value || ''}
          onChange={field.onChange}
          placeholder="Enter points value"
          className={fieldState?.error?.message ? 'border-red-500' : ''}
        />
        {fieldState?.error?.message && (
          <div className="text-xs text-red-500 mt-1">{fieldState.error.message}</div>
        )}
      </div>
    ),
    shouldShow: (form: any) => form.watch('rewardTypes')?.includes('points'),
  },
  {
    name: 'badge',
    label: 'What badge will participants receive?',
    render: (field: any, _form: any, fieldState: any) => (
      <ModernTextInput
        value={field.value || ''}
        onChange={field.onChange}
        error={fieldState?.error?.message}
        label="Badge Name"
        placeholder="Enter badge name"
      />
    ),
    shouldShow: (form: any) => form.watch('rewardTypes')?.includes('badge'),
  },
  {
    name: 'sponsoredReward',
    label: 'What is the sponsored reward?',
    render: (field: any, _form: any, fieldState: any) => (
      <ModernTextInput
        value={field.value || ''}
        onChange={field.onChange}
        error={fieldState?.error?.message}
        label="Sponsored Reward"
        placeholder="Enter sponsored reward details"
      />
    ),
    shouldShow: (form: any) => form.watch('rewardTypes')?.includes('sponsored'),
  },
];

export function useRewardsForm() {
  return useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rewardTypes: [],
      points: '',
      badge: '',
      sponsoredReward: '',
    },
    mode: 'onChange',
  });
}

export function RewardsStep({
  subStep,
  form,
  onAdvanceSubStep,
}: {
  subStep: number;
  form: ReturnType<typeof useRewardsForm>;
  onAdvanceSubStep?: () => void;
}) {
  // Filter visible questions based on selected reward types
  const visibleQuestions = questions.filter(q => !q.shouldShow || q.shouldShow(form));
  const currentQuestion = visibleQuestions[subStep];

  // Track previous visibleQuestions length to detect when a new reward type is added
  const prevVisibleQuestionsRef = React.useRef(visibleQuestions.length);
  React.useEffect(() => {
    prevVisibleQuestionsRef.current = visibleQuestions.length;
  }, [visibleQuestions.length]);

  // Focus the first input/select on subStep change
  useEffect(() => {
    const el = document.querySelector('input,select,button[aria-pressed]');
    if (el) (el as HTMLElement).focus();
  }, [subStep]);

  if (!currentQuestion) return null;

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name={currentQuestion.name as any}
        render={({ field }) => (
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
                {currentQuestion.name === 'rewardTypes' ? (
                  <SelectableCardGrid
                    options={rewardOptions}
                    value={field.value}
                    onChange={(value) => {
                      const currentValues = form.getValues('rewardTypes') || [];
                      let newValues;
                      if (currentValues.includes(value)) {
                        newValues = currentValues.filter((v: string) => v !== value);
                      } else {
                        newValues = [...currentValues, value];
                      }
                      field.onChange(newValues);
                      setTimeout(() => {
                        const newVisibleQuestions = questions.filter(q => !q.shouldShow || q.shouldShow({ ...form, watch: (name: string) => {
                          if (name === 'rewardTypes') return newValues;
                          return form.watch(name as any);
                        }}));
                        if (
                          onAdvanceSubStep &&
                          newVisibleQuestions.length > prevVisibleQuestionsRef.current
                        ) {
                          onAdvanceSubStep();
                        }
                      }, 0);
                    }}
                  />
                ) : (
                  currentQuestion.render(field, form, form.formState.errors[currentQuestion.name as keyof typeof form.formState.errors])
                )}
              </motion.div>
            </AnimatePresence>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}

export function getRewardsVisibleQuestions(form: ReturnType<typeof useRewardsForm>) {
  return questions.filter(q => !q.shouldShow || q.shouldShow(form));
} 