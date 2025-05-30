import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ModernTextInput } from '../ModernTextInput';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateFormData } from '@/store/challengeSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the base schema that all challenge types will have
const baseSchema = {
  objective: z.string().min(1, 'Objective is required'),
  measurement: z.string().optional(),
  trackingPeriod: z.string().optional(),
  squaresRequired: z.string().optional(),
  dailyChallenges: z.string().optional(),
  questionsRequired: z.string().optional(),
};

// Define the schema based on challenge type
const getFormSchema = (category: string, theme: string) => {
  switch (theme) {
    case 'Distance':
      return z.object({
        ...baseSchema,
        measurement: z.enum(['Miles', 'Kilometers']),
      });
    case 'Steps':
      return z.object({
        ...baseSchema,
        trackingPeriod: z.enum(['Day', 'Total']),
      });
    case 'Team Challenge':
      return z.object({
        ...baseSchema,
        trackingPeriod: z.enum(['Daily', 'Total']),
      });
    case 'Bingo':
      return z.object({
        ...baseSchema,
        squaresRequired: z.string().min(1, 'Number of squares is required'),
      });
    case 'Mini Challenge':
      return z.object({
        ...baseSchema,
        dailyChallenges: z.string().refine((val) => {
          const num = parseInt(val);
          return num >= 1 && num <= 30;
        }, 'Must be between 1 and 30'),
      });
    case 'Nutrition Quiz':
      return z.object({
        ...baseSchema,
        questionsRequired: z.string().refine((val) => {
          const num = parseInt(val);
          return num >= 1 && num <= 15;
        }, 'Must be between 1 and 15'),
      });
    case 'The Most':
      return z.object({
        ...baseSchema,
        measurement: z.enum(['Miles', 'Steps']),
        trackingPeriod: z.enum(['Daily', 'Total']),
      });
    default:
      return z.object(baseSchema);
  }
};

const getObjectiveQuestions = (category: string, theme: string) => {
  const baseQuestions = [];

  switch (theme) {
    case 'Distance':
      baseQuestions.push({
        name: 'objective',
        label: 'What is the total distance required?',
        render: (field: any, _form: any, fieldState: any) => (
          <ModernTextInput
            value={field.value || ''}
            onChange={field.onChange}
            error={fieldState?.error?.message}
            label="Distance"
            placeholder="Enter distance"
            type="number"
          />
        ),
      }, {
        name: 'measurement',
        label: 'Select measurement unit',
        render: (field: any, _form: any, fieldState: any) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Miles">Miles</SelectItem>
              <SelectItem value="Kilometers">Kilometers</SelectItem>
            </SelectContent>
          </Select>
        ),
      });
      break;

    case 'Steps':
      baseQuestions.push({
        name: 'objective',
        label: 'What is the total number of steps required?',
        render: (field: any, _form: any, fieldState: any) => (
          <ModernTextInput
            value={field.value || ''}
            onChange={field.onChange}
            error={fieldState?.error?.message}
            label="Steps"
            placeholder="Enter number of steps"
            type="number"
          />
        ),
      }, {
        name: 'trackingPeriod',
        label: 'How should steps be tracked?',
        render: (field: any, _form: any, fieldState: any) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select tracking period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Day">Daily</SelectItem>
              <SelectItem value="Total">Total</SelectItem>
            </SelectContent>
          </Select>
        ),
      });
      break;

    case 'Team Challenge':
      baseQuestions.push({
        name: 'objective',
        label: 'What is the total number of steps required?',
        render: (field: any, _form: any, fieldState: any) => (
          <ModernTextInput
            value={field.value || ''}
            onChange={field.onChange}
            error={fieldState?.error?.message}
            label="Steps"
            placeholder="Enter number of steps"
            type="number"
          />
        ),
      }, {
        name: 'trackingPeriod',
        label: 'How should steps be tracked?',
        render: (field: any, _form: any, fieldState: any) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select tracking period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Total">Total</SelectItem>
            </SelectContent>
          </Select>
        ),
      });
      break;

    case 'Bingo':
      baseQuestions.push({
        name: 'squaresRequired',
        label: 'How many squares are required to complete?',
        render: (field: any, _form: any, fieldState: any) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select number of squares" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 21 }, (_, i) => i + 5).map((num) => (
                <SelectItem key={num} value={String(num)}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      });
      break;

    case 'Mini Challenge':
      baseQuestions.push({
        name: 'dailyChallenges',
        label: 'How many daily challenges must be completed?',
        render: (field: any, _form: any, fieldState: any) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select number of challenges" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={String(num)}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      });
      break;

    case 'Nutrition Quiz':
      baseQuestions.push({
        name: 'questionsRequired',
        label: 'How many questions must be answered?',
        render: (field: any, _form: any, fieldState: any) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select number of questions" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={String(num)}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      });
      break;

    case 'The Most':
      baseQuestions.push({
        name: 'objective',
        label: 'What is the total required?',
        render: (field: any, _form: any, fieldState: any) => (
          <ModernTextInput
            value={field.value || ''}
            onChange={field.onChange}
            error={fieldState?.error?.message}
            label="Total"
            placeholder="Enter total"
            type="number"
          />
        ),
      }, {
        name: 'measurement',
        label: 'Select measurement type',
        render: (field: any, _form: any, fieldState: any) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select measurement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Miles">Miles</SelectItem>
              <SelectItem value="Steps">Steps</SelectItem>
            </SelectContent>
          </Select>
        ),
      }, {
        name: 'trackingPeriod',
        label: 'How should it be tracked?',
        render: (field: any, _form: any, fieldState: any) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select tracking period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Total">Total</SelectItem>
            </SelectContent>
          </Select>
        ),
      });
      break;

    default:
      baseQuestions.push({
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
      });
  }

  return baseQuestions;
};

// Get the total number of questions for a given category and theme
export const getObjectiveTotal = (category: string, theme: string) => {
  return getObjectiveQuestions(category, theme).length;
};

export function useObjectiveForm() {
  const { formData } = useAppSelector((state) => state.challenge);
  const category = formData.basicInformation?.category;
  const theme = formData.basicInformation?.theme;
  
  const formSchema = getFormSchema(category || '', theme || '');
  type FormData = z.infer<typeof formSchema>;
  
  return useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objective: formData.objective?.primaryGoal || '',
      measurement: formData.objective?.measurement || '',
      trackingPeriod: formData.objective?.trackingPeriod || '',
      squaresRequired: formData.objective?.squaresRequired || '5',
      dailyChallenges: formData.objective?.dailyChallenges || '5',
      questionsRequired: formData.objective?.questionsRequired || '5',
    },
    mode: 'onChange',
  });
}

export function ObjectiveStep({ subStep, form }: { subStep: number; form: ReturnType<typeof useObjectiveForm> }) {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.challenge);
  const category = formData.basicInformation?.category;
  const theme = formData.basicInformation?.theme;

  const questions = getObjectiveQuestions(category || '', theme || '');
  const formSchema = getFormSchema(category || '', theme || '');
  type FormData = z.infer<typeof formSchema>;

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('Objective Form Values:', value);
      dispatch(updateFormData({
        objective: {
          primaryGoal: value.objective || '',
          measurement: value.measurement || '',
          trackingPeriod: value.trackingPeriod || '',
          squaresRequired: value.squaresRequired || '',
          dailyChallenges: value.dailyChallenges || '',
          questionsRequired: value.questionsRequired || '',
        }
      }));
    });
    return () => subscription.unsubscribe();
  }, [form, dispatch]);

  useEffect(() => {
    const el = document.querySelector('input,button[aria-pressed],select');
    if (el) (el as HTMLElement).focus();
  }, [subStep]);

  const currentQuestion = questions[subStep];
  const currentValue = form.watch(currentQuestion.name as keyof FormData);
  console.log('Current Question:', currentQuestion.name, 'Value:', currentValue, 'Form State:', form.formState);

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