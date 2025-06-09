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
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Define the base schema that all challenge types will have
const baseSchema = {
  objective: z.union([
    z.string(),
    z.object({
      value: z.number(),
      unit: z.enum(['kilometers', 'miles', 'steps'])
    }),
    z.object({
      steps: z.number(),
      trackingPeriod: z.enum(['Day', 'Total'])
    })
  ]),
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
        objective: z.object({
          value: z.number().min(1, 'Please enter a valid distance'),
          unit: z.enum(['kilometers', 'miles'])
        }),
      });
    case 'Steps':
      return z.object({
        ...baseSchema,
        objective: z.object({
          steps: z.number().min(1, 'Please enter a valid number of steps'),
          trackingPeriod: z.enum(['Day', 'Total'])
        }),
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
        measurement: z.enum(['miles', 'steps']),
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
        label: 'Enter distance',
        subtitle: 'Set the target distance for participants to achieve',
        render: (field: any, _form: any, fieldState: any) => (
          <div className="flex items-center justify-center min-h-[60vh] space-x-4">
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                value={field.value?.value || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  field.onChange({ 
                    value: isNaN(value) ? 0 : value,
                    unit: field.value?.unit || 'kilometers'
                  });
                }}
                className={cn(
                  'w-32 text-5xl text-center py-4 focus:outline-none transition-all bg-transparent font-bold border-none',
                  fieldState?.error ? 'text-destructive' : 'text-foreground'
                )}
                placeholder="Enter distance"
              />
              <Select
                value={field.value?.unit || 'kilometers'}
                onValueChange={(value) => field.onChange({ 
                  value: field.value?.value || 0,
                  unit: value 
                })}
              >
                <SelectTrigger className="w-24 h-16 bg-transparent border-none focus:ring-0 text-3xl font-bold">
                  <SelectValue placeholder="KM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kilometers" className="text-2xl">KM</SelectItem>
                  <SelectItem value="miles" className="text-2xl">MI</SelectItem>
                  <SelectItem value="steps" className="text-2xl">ST</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {fieldState?.error && (
              <p className="text-sm text-destructive mt-2 text-center">{fieldState.error.message}</p>
            )}
          </div>
        ),
      });
      break;

    case 'Steps':
      baseQuestions.push({
        name: 'objective',
        label: 'How many steps should participants take?',
        subtitle: 'Set the step goal and tracking period for this challenge',
        render: (field: any, _form: any, fieldState: any) => (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md space-y-8">
              {/* Steps Input */}
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <span className="text-2xl font-bold">Steps</span>
                  <Input
                    type="number"
                    value={field.value?.steps?.toString() || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      field.onChange({
                        ...field.value,
                        steps: isNaN(value) ? 0 : value
                      });
                    }}
                    className={cn(
                      'w-48 text-[4rem] leading-none text-center focus:outline-none transition-all bg-transparent font-bold border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 [&>input]:text-[4rem] [&>input]:h-auto [&>input]:py-0',
                      fieldState?.error?.message ? 'text-destructive' : 'text-foreground'
                    )}
                    placeholder="Enter"
                  />
                </div>
                {fieldState?.error?.message && (
                  <p className="text-sm text-destructive text-center">{fieldState.error.message}</p>
                )}
              </div>

              {/* Tracking Period Select */}
              <div className="space-y-4">
                <p className="text-lg font-medium text-center">Track steps</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={field.value?.trackingPeriod === 'Day' ? 'default' : 'outline'}
                    className="h-24 text-lg"
                    onClick={() => {
                      field.onChange({
                        ...field.value,
                        trackingPeriod: 'Day'
                      });
                    }}
                  >
                    Daily
                  </Button>
                  <Button
                    type="button"
                    variant={field.value?.trackingPeriod === 'Total' ? 'default' : 'outline'}
                    className="h-24 text-lg"
                    onClick={() => {
                      field.onChange({
                        ...field.value,
                        trackingPeriod: 'Total'
                      });
                    }}
                  >
                    Total
                  </Button>
                </div>
                {fieldState?.error?.message && (
                  <p className="text-sm text-destructive text-center">{fieldState.error.message}</p>
                )}
              </div>
            </div>
          </div>
        ),
      });
      break;

    case 'Team Challenge':
      baseQuestions.push({
        name: 'objective',
        label: 'What is the total number of steps required?',
        subtitle: 'Define the primary goal that participants should achieve through this challenge',
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
        subtitle: 'Specify the metrics and criteria that will determine if participants have achieved the objective',
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
        subtitle: 'Specify the metrics and criteria that will determine if participants have achieved the objective',
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
        subtitle: 'Specify the metrics and criteria that will determine if participants have achieved the objective',
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
        subtitle: 'Specify the metrics and criteria that will determine if participants have achieved the objective',
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
        subtitle: 'Define the primary goal that participants should achieve through this challenge',
        render: (field: any, form: any, fieldState: any) => (
          <div className="flex gap-4">
          <ModernTextInput
            value={field.value || ''}
            onChange={field.onChange}
            error={fieldState?.error?.message}
            label="Total"
            placeholder="Enter total"
            type="number"
          />
            <Select
              value={form.watch('measurement')}
              onValueChange={val => form.setValue('measurement', val)}
            >
            <SelectTrigger>
              <SelectValue placeholder="Select measurement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="miles">Miles</SelectItem>
              <SelectItem value="steps">Steps</SelectItem>
            </SelectContent>
          </Select>
          </div>
        ),
      }, {
        name: 'trackingPeriod',
        label: 'How should it be tracked?',
        subtitle: 'Specify the metrics and criteria that will determine if participants have achieved the objective',
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
        subtitle: 'Define the primary goal that participants should achieve through this challenge',
        render: (field: any, _form: any, fieldState: any) => (
          <ModernTextInput
            value={field.value || ''}
            onChange={field.onChange}
            error={fieldState?.error?.message}
            label="Objective"
            placeholder="Enter the main objective"
            maxLength={200}
          />
        ),
      },
      {
        name: 'successCriteria',
        label: 'How will you measure success?',
        subtitle: 'Specify the metrics and criteria that will determine if participants have achieved the objective',
        render: (field: any, _form: any, fieldState: any) => (
          <ModernTextInput
            value={field.value || ''}
            onChange={field.onChange}
            error={fieldState?.error?.message}
            label="Success Criteria"
            placeholder="Enter success criteria"
            maxLength={200}
          />
        ),
      },
    );
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
      objective: theme === 'Distance' ? {
        value: 0,
        unit: 'kilometers'
      } : formData.objective?.primaryGoal || '',
      measurement: formData.objective?.measurement || '',
      trackingPeriod: formData.objective?.trackingPeriod || '',
      squaresRequired: formData.objective?.squaresRequired || '',
      dailyChallenges: formData.objective?.dailyChallenges || '',
      questionsRequired: formData.objective?.questionsRequired || '',
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
      if (theme === 'Distance' && typeof value.objective === 'object' && 'value' in value.objective && value.objective.value && value.objective.unit) {
        dispatch(updateFormData({
          objective: {
            objective: value.objective.value.toString(),
            successCriteria: value.objective.unit,
            primaryGoal: value.objective.value.toString(),
            measurement: value.objective.unit,
            trackingPeriod: formData.objective?.trackingPeriod || '',
            squaresRequired: formData.objective?.squaresRequired || '',
            dailyChallenges: formData.objective?.dailyChallenges || '',
            questionsRequired: formData.objective?.questionsRequired || ''
          }
        }));
      } else if (theme === 'Steps' && typeof value.objective === 'object' && 'steps' in value.objective && value.objective.steps) {
        dispatch(updateFormData({
          objective: {
            objective: value.objective.steps.toString(),
            successCriteria: value.measurement || '',
            primaryGoal: value.objective.steps.toString(),
            measurement: value.measurement || '',
            trackingPeriod: value.trackingPeriod || '',
            squaresRequired: formData.objective?.squaresRequired || '',
            dailyChallenges: formData.objective?.dailyChallenges || '',
            questionsRequired: formData.objective?.questionsRequired || ''
          }
        }));
      } else {
        dispatch(updateFormData({
          objective: {
            objective: typeof value.objective === 'string' ? value.objective : '',
            successCriteria: value.measurement || '',
            primaryGoal: typeof value.objective === 'string' ? value.objective : '',
            measurement: value.measurement || '',
            trackingPeriod: value.trackingPeriod || '',
            squaresRequired: value.squaresRequired || '',
            dailyChallenges: value.dailyChallenges || '',
            questionsRequired: value.questionsRequired || ''
          }
        }));
      }
    });
    return () => subscription.unsubscribe();
  }, [form, dispatch, theme, formData.objective]);

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
                {currentQuestion.render(
                  { 
                    ...field, 
                    value: typeof currentValue === 'object' ? currentValue : field.value 
                  }, 
                  form, 
                  fieldState
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