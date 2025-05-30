import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ModernTextInput } from '../ModernTextInput';
import { SelectableCardGrid } from '../SelectableCardGrid';
import { Salad, BookOpen, Ticket } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateFormData } from '@/store/challengeSlice';

const formSchema = z.object({
  nextBestActions: z.array(z.string()).min(1, 'Select at least one action'),
  promoHeadline: z.string().optional(),
  promoDetails: z.string().optional(),
  promoImage: z.string().optional(),
  leaderboardType: z.string().optional(),
});

const nextBestActionOptions = [
  { value: 'Nutrition Widget', label: 'Nutrition Widget', icon: <Salad />, description: 'Show a nutrition widget to users' },
  { value: 'Recipes', label: 'Recipes', icon: <BookOpen />, description: 'Provide healthy recipes' },
  { value: 'Coupons', label: 'Coupons', icon: <Ticket />, description: 'Offer coupons for healthy products' },
];

const questions = [
  {
    name: 'nextBestActions',
    label: 'Select next best actions for the challenge.',
    render: (field: any, _form: any, fieldState: any) => {
      return (
        <SelectableCardGrid
          options={nextBestActionOptions}
          value={field.value}
          onChange={(value) => {
            const currentValues = field.value || [];
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
    name: 'promoHeadline',
    label: 'Promo tile headline',
    render: (field: any, _form: any, fieldState: any) => (
      <ModernTextInput
        value={field.value || ''}
        onChange={field.onChange}
        error={fieldState?.error?.message}
        label="Promo Headline"
        placeholder="Enter promo headline"
      />
    ),
  },
  {
    name: 'promoDetails',
    label: 'Promo tile details',
    render: (field: any, _form: any, fieldState: any) => (
      <ModernTextInput
        value={field.value || ''}
        onChange={field.onChange}
        error={fieldState?.error?.message}
        label="Promo Details"
        placeholder="Enter promo details"
      />
    ),
  },
  {
    name: 'promoImage',
    label: 'Promo tile image',
    render: (field: any, _form: any, fieldState: any) => (
      <input type="file" onChange={e => field.onChange(e.target.value)} />
    ),
  },
  {
    name: 'leaderboardType',
    label: 'Leaderboard or self-tracked?',
    render: (field: any) => (
      <select value={field.value} onChange={e => field.onChange(e.target.value)} className="w-full p-4 rounded-2xl border">
        <option value="">Select type</option>
        <option value="Leaderboard">Leaderboard</option>
        <option value="Self tracked">Self tracked</option>
      </select>
    ),
  },
];

export function useFeaturesForm() {
  const { formData } = useAppSelector((state) => state.challenge);
  
  return useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nextBestActions: formData.features?.tracking || [],
      promoHeadline: '',
      promoDetails: '',
      promoImage: '',
      leaderboardType: formData.features?.gamification?.[0] || '',
    },
    mode: 'onChange',
  });
}

export const FEATURES_TOTAL = questions.length;

export function FeaturesStep({ subStep, form }: { subStep: number; form: ReturnType<typeof useFeaturesForm> }) {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.challenge);

  useEffect(() => {
    const subscription = form.watch((value) => {
      dispatch(updateFormData({
        features: {
          tracking: (value.nextBestActions || []).filter((item): item is string => item !== undefined),
          social: [],
          gamification: value.leaderboardType ? [value.leaderboardType] : [],
          support: [],
        }
      }));
    });
    return () => subscription.unsubscribe();
  }, [form, dispatch]);

  useEffect(() => {
    const el = document.querySelector('input,select,button[aria-pressed]');
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