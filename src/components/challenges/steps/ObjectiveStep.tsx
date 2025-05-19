import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ModernTextInput } from '../ModernTextInput';
import { AnimatePresence, motion } from 'framer-motion';

const formSchema = z.object({
  objective: z.string().min(1, 'Objective is required'),
  criteria: z.string().optional(),
});

const questions = [
  {
    name: 'objective',
    label: 'What is the main objective of this challenge?',
    render: (field: any, _form: any, fieldState: any) => (
      <ModernTextInput
        value={field.value || ''}
        onChange={field.onChange}
        error={fieldState?.error?.message}
        label="Objective"
        placeholder="Describe the objective"
      />
    ),
  },
  {
    name: 'criteria',
    label: 'Any additional completion criteria?',
    render: (field: any, _form: any, fieldState: any) => (
      <ModernTextInput
        value={field.value || ''}
        onChange={field.onChange}
        error={fieldState?.error?.message}
        label="Criteria (optional)"
        placeholder="Describe any extra criteria"
      />
    ),
  },
];

export function useObjectiveForm() {
  return useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objective: '',
      criteria: '',
    },
    mode: 'onChange',
  });
}
export const OBJECTIVE_TOTAL = questions.length;

export function ObjectiveStep({ subStep, form }: { subStep: number; form: ReturnType<typeof useObjectiveForm> }) {
  useEffect(() => {
    const el = document.querySelector('input,button[aria-pressed]');
    if (el) (el as HTMLElement).focus();
  }, [subStep]);
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
                {currentQuestion.render(field, form, fieldState)}
              </motion.div>
            </AnimatePresence>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
} 