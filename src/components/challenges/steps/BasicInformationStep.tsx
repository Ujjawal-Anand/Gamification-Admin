'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectableCardGrid } from '../SelectableCardGrid';
import { Dumbbell, Salad, Moon, Activity } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { BottomSheetInfo } from '../BottomSheetInfo';
import { VerticalImportanceSlider } from '../VerticalImportanceSlider';
import { ModernTextInput } from '../ModernTextInput';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateFormData } from "@/store/challengeSlice";

const formSchema = z.object({
  category: z.enum(['Activity', 'Nutrition', 'Mindfulness', 'Sleep'], {
    required_error: 'Please select a category',
  }),
  theme: z.string({
    required_error: 'Please select a theme',
  }).refine((val) => val !== '', {
    message: 'Please select a theme',
  }),
  importance: z.string({
    required_error: 'Please select importance level',
  }),
});

const categoryThemes = {
  Activity: ['Distance', 'Steps', 'Team Challenge', 'The Most', 'Complete X'],
  Nutrition: ['Bingo', 'Nutrition Quiz'],
  Mindfulness: ['Mini Challenge'],
  Sleep: ['Hours of Sleep'],
};

export const TOTAL_SUBSTEPS = Object.keys(categoryThemes).length;
export const BASIC_INFO_TOTAL = 3;

const categoryOptions = [
  { value: 'Activity', label: 'Activity', icon: <Dumbbell /> },
  { value: 'Nutrition', label: 'Nutrition', icon: <Salad /> },
  { value: 'Mindfulness', label: 'Mindfulness', icon: <Activity /> },
  { value: 'Sleep', label: 'Sleep', icon: <Moon /> },
];

const themeOptions: Record<string, { value: string; label: string; icon: React.ReactNode; description: string }[]> = {
  Activity: [
    { value: 'Distance', label: 'Distance', icon: <Dumbbell />, description: 'Participants compete to cover a target distance (e.g., miles or kilometers) by walking, running, cycling, or other activities. Progress is tracked cumulatively over the challenge period.' },
    { value: 'Steps', label: 'Steps', icon: <Activity />, description: 'Track the total number of steps taken. Participants aim to reach a step goal, either daily or as a total, encouraging regular movement and activity.' },
    { value: 'Team Challenge', label: 'Team Challenge', icon: <Activity />, description: 'Join forces with others! Teams work together to achieve a shared activity goal, fostering collaboration and friendly competition.' },
    { value: 'The Most', label: 'The Most', icon: <Dumbbell />, description: 'A competitive challenge where participants strive to achieve the highest value (e.g., most steps, most distance) within the challenge period.' },
    { value: 'Complete X', label: 'Complete X', icon: <Dumbbell />, description: 'Complete a specific activity or reach a defined milestone, such as "Complete 10 runs" or "Finish 5 yoga sessions."' },
  ],
  Nutrition: [
    { value: 'Bingo', label: 'Bingo', icon: <Salad />, description: 'A fun, interactive bingo card filled with nutrition-related tasks (e.g., "Eat a green vegetable," "Try a new fruit"). Complete rows or the whole card to win!' },
    { value: 'Nutrition Quiz', label: 'Nutrition Quiz', icon: <Salad />, description: 'Test your nutrition knowledge! Answer daily or weekly quiz questions to earn points and learn healthy habits.' },
  ],
  Mindfulness: [
    { value: 'Mini Challenge', label: 'Mini Challenge', icon: <Activity />, description: 'Daily mindfulness or well-being tasks, such as meditation, journaling, or gratitude exercises. Build healthy mental habits one day at a time.' },
  ],
  Sleep: [
    { value: 'Hours of Sleep', label: 'Hours of Sleep', icon: <Moon />, description: 'Track your nightly sleep duration. Set a goal for hours of sleep and build better rest habits throughout the challenge.' },
  ],
};

interface BasicInformationStepProps {
  subStep: number;
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function BasicInformationStep({ subStep }: { subStep: number }) {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.challenge);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: formData.basicInformation?.category,
      theme: '',
      importance: formData.basicInformation?.importance || '',
    },
    mode: 'onChange',
  });

  // Info sheet state for theme
  const [infoTheme, setInfoTheme] = useState<null | { label: string; description: string; icon?: React.ReactNode }>(null);

  // Focus the first input/select on subStep change
  useEffect(() => {
    const el = document.querySelector('input,select,button[aria-pressed]');
    if (el) (el as HTMLElement).focus();
  }, [subStep]);

  // Questions array must be inside the component to access setInfoTheme
  const questions = [
    {
      name: 'category',
      label: 'Which category best fits your challenge?',
      render: (field: any, _form: any, _fieldState: any) => (
        <SelectableCardGrid
          options={categoryOptions}
          value={field.value}
          onChange={field.onChange}
        />
      ),
    },
    {
      name: 'theme',
      label: 'Select a theme for your challenge',
      subtitle: 'Choose a theme that best matches your challenge goals and objectives',
      render: (field: any, form: any, _fieldState: any) => {
        const selectedCategory = form.watch('category');
        if (!selectedCategory) return <div className="text-muted-foreground">Select a category first</div>;
        return (
          <SelectableCardGrid
            options={themeOptions[selectedCategory]}
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              form.trigger('theme'); // Trigger validation after change
            }}
            onInfoClick={(option) => setInfoTheme({ label: option.label, description: option.description || '', icon: option.icon })}
          />
        );
      },
    },
    {
      name: 'importance',
      label: 'How important is this challenge?',
      render: (field: any, _form: any, _fieldState: any) => (
        <VerticalImportanceSlider value={field.value} onChange={field.onChange} />
      ),
    },
  ];

  const currentQuestion = questions[subStep];
  const currentValue = form.watch(currentQuestion.name as any);
  console.log('Current Question:', currentQuestion.name, 'Value:', currentValue);

  // Update Redux store when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('Form value changed:', value);
      dispatch(updateFormData({ basicInformation: value as z.infer<typeof formSchema> }));
    });
    return () => subscription.unsubscribe();
  }, [form, dispatch]);

  // Custom render for theme question to inject info icon logic
  if (currentQuestion.name === 'theme') {
    const selectedCategory = form.watch('category');
    return (
      <>
        <Form {...form}>
          <FormField
            control={form.control}
            name={currentQuestion.name as any}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-xl font-semibold mb-4 block">{currentQuestion.label}</FormLabel>
                {selectedCategory ? (
                  <SelectableCardGrid
                    options={themeOptions[selectedCategory]}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      form.trigger('theme'); // Trigger validation after change
                    }}
                    onInfoClick={(option) => setInfoTheme({ label: option.label, description: option.description || '', icon: option.icon })}
                  />
                ) : (
                  <div className="text-muted-foreground">Select a category first</div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
        <BottomSheetInfo
          open={!!infoTheme}
          onOpenChange={(open) => !open && setInfoTheme(null)}
          icon={infoTheme?.icon}
          title={infoTheme?.label || ''}
          description={infoTheme?.description}
        />
      </>
    );
  }

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name={currentQuestion.name as any}
        render={({ field, fieldState }) => (
            <FormItem>
            <FormLabel className="text-xl font-semibold mb-2 block">{currentQuestion.label}</FormLabel>
            {currentQuestion.subtitle && (
              <p className="text-muted-foreground mb-4">{currentQuestion.subtitle}</p>
            )}
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

export function useBasicInformationForm() {
  return useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: undefined,
      theme: '',
      importance: '',
    },
    mode: 'onChange',
  });
} 