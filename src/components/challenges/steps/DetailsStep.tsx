import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ModernTextInput } from '../ModernTextInput';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateFormData } from '@/store/challengeSlice';

const formSchema = z.object({
  headline: z.string().min(1, 'Headline is required'),
  summary: z.string().min(1, 'Summary is required'),
  image: z.string().min(1, 'Image is required'),
  heroImage: z.string().min(1, 'Hero image is required'),
});

const questions = [
  {
    name: 'headline',
    label: 'What is the headline for your challenge?',
    render: (field: any, _form: any, fieldState: any) => (
      <ModernTextInput
        value={field.value || ''}
        onChange={field.onChange}
        maxLength={55}
        error={fieldState?.error?.message}
        label="Headline"
        placeholder="Enter headline"
      />
    ),
  },
  {
    name: 'summary',
    label: 'Write a short summary for your challenge.',
    render: (field: any, _form: any, fieldState: any) => (
      <ModernTextInput
        value={field.value || ''}
        onChange={field.onChange}
        maxLength={120}
        error={fieldState?.error?.message}
        label="Summary"
        placeholder="Enter summary"
      />
    ),
  },
  {
    name: 'image',
    label: 'Upload an image for your challenge.',
    render: (field: any, _form: any, fieldState: any) => (
      <input type="file" onChange={e => field.onChange(e.target.value)} />
    ),
  },
  {
    name: 'heroImage',
    label: 'Upload a hero image for your challenge.',
    render: (field: any, _form: any, fieldState: any) => (
      <input type="file" onChange={e => field.onChange(e.target.value)} />
    ),
  },
];

export function useDetailsForm() {
  const { formData } = useAppSelector((state) => state.challenge);
  
  return useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      headline: formData.details?.description || '',
      summary: formData.details?.website || '',
      image: formData.details?.image || '',
      heroImage: formData.details?.video || '',
    },
    mode: 'onChange',
  });
}
export const DETAILS_TOTAL = questions.length;

export function DetailsStep({ subStep, form }: { subStep: number; form: ReturnType<typeof useDetailsForm> }) {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.challenge);

  useEffect(() => {
    const subscription = form.watch((value) => {
      dispatch(updateFormData({
        details: {
          description: value.headline || '',
          image: value.image || '',
          video: value.heroImage || '',
          website: value.summary || '',
        }
      }));
    });
    return () => subscription.unsubscribe();
  }, [form, dispatch]);

  useEffect(() => {
    const el = document.querySelector('input,button[aria-pressed]');
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