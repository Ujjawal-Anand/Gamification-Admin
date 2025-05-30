import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateFormData } from '@/store/challengeSlice';

const formSchema = z.object({
  cohort: z.string().min(1, 'Cohort is required'),
});

const questions = [
  {
    name: 'cohort',
    label: 'Who can participate in this challenge?',
    render: (field: any, _form: any, fieldState: any) => (
      <select value={field.value} onChange={e => field.onChange(e.target.value)} className="w-full p-4 rounded-2xl border">
        <option value="">Select cohort</option>
        <option value="ACI Associates Only">ACI Associates Only</option>
        <option value="All SH customers">All SH customers</option>
        <option value="TBD">TBD</option>
      </select>
    ),
  },
];

export function useEligibilityForm() {
  const { formData } = useAppSelector((state) => state.challenge);
  
  return useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cohort: formData.eligibility?.otherRequirements || '',
    },
    mode: 'onChange',
  });
}
export const ELIGIBILITY_TOTAL = questions.length;

export function EligibilityStep({ subStep, form }: { subStep: number; form: ReturnType<typeof useEligibilityForm> }) {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.challenge);

  useEffect(() => {
    const subscription = form.watch((value) => {
      dispatch(updateFormData({
        eligibility: {
          ageRange: { min: 0, max: 100 },
          gender: [],
          location: [],
          healthConditions: [],
          otherRequirements: value.cohort || '',
        }
      }));
    });
    return () => subscription.unsubscribe();
  }, [form, dispatch]);

  useEffect(() => {
    const el = document.querySelector('select,button[aria-pressed]');
    if (el) (el as HTMLElement).focus();
  }, [subStep]);

  const currentQuestion = questions[subStep];
  const currentValue = form.watch(currentQuestion.name as any);

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
                {currentQuestion.render({ ...field, value: currentValue }, form, fieldState)}
              </motion.div>
            </AnimatePresence>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
} 