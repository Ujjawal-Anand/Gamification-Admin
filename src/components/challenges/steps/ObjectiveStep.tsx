import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useMemo, useCallback } from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ModernTextInput } from '../ModernTextInput';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateFormData } from '@/store/challengeSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

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
const getFormSchema = (theme: string) => {
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
        squaresRequired: z.string().refine((val) => {
          const num = parseInt(val);
          return !isNaN(num) && num >= 5 && num <= 20;
        }, 'Please select a valid number of squares'),
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
                      'w-48 text-5xl leading-none text-center focus:outline-none transition-all bg-transparent font-bold border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 [&>input]:text-[4rem] [&>input]:h-auto [&>input]:py-0',
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
                  <div className="relative perspective-1000">
                    <div className={cn(
                      "relative w-full h-24 transition-transform duration-500 transform-style-3d",
                      field.value?.trackingPeriod === 'Day' ? 'rotate-y-180' : ''
                    )}>
                      {/* Front of card */}
                      <div className="absolute inset-0 backface-hidden">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-full text-lg"
                          onClick={() => {
                            field.onChange({
                              ...field.value,
                              trackingPeriod: 'Day'
                            });
                          }}
                        >
                          Daily
                        </Button>
                      </div>
                      {/* Back of card */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary text-primary-foreground rounded-md flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 className="h-8 w-8" />
                          <span className="text-lg font-medium">Daily</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative perspective-1000">
                    <div className={cn(
                      "relative w-full h-24 transition-transform duration-500 transform-style-3d",
                      field.value?.trackingPeriod === 'Total' ? 'rotate-y-180' : ''
                    )}>
                      {/* Front of card */}
                      <div className="absolute inset-0 backface-hidden">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-full text-lg"
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
                      {/* Back of card */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary text-primary-foreground rounded-md flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 className="h-8 w-8" />
                          <span className="text-lg font-medium">Total</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
        subtitle: 'Specify the number of squares needed to complete the bingo challenge',
        render: (field: any, _form: any, fieldState: any) => (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-2xl space-y-8">
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 16 }, (_, i) => i + 5).map((num) => (
                  <div key={num} className="relative perspective-1000">
                    <div className={cn(
                      "relative w-full aspect-square transition-transform duration-500 transform-style-3d",
                      field.value === num.toString() ? 'rotate-y-180' : ''
                    )}>
                      {/* Front of card */}
                      <div className="absolute inset-0 backface-hidden">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-full text-2xl font-bold"
                          onClick={() => {
                            field.onChange(num.toString());
                          }}
                        >
                          {num}
                        </Button>
                      </div>
                      {/* Back of card */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary text-primary-foreground rounded-md flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 className="h-8 w-8" />
                          <span className="text-2xl font-bold">{num}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {fieldState?.error?.message && (
                <p className="text-sm text-destructive text-center">{fieldState.error.message}</p>
              )}
            </div>
          </div>
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

interface ObjectiveStepProps {
  subStep: number;
  form: UseFormReturn<any>;
}

interface StoredObjective {
  objective?: string;
  measurement?: string;
  trackingPeriod?: string;
  squaresRequired?: string;
  dailyChallenges?: string;
  questionsRequired?: string;
  rawData?: any;
}

export function useObjectiveForm() {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.challenge);
  const category = formData.basicInformation?.category || '';
  const theme = formData.basicInformation?.theme || '';
  const storedObjective: StoredObjective = formData?.objective || {};

  // Initialize form with stored data
  const defaultValues = useMemo(() => {
    if (storedObjective.rawData) {
      return storedObjective.rawData;
    }

    switch (theme) {
      case 'Bingo':
        return {
          squaresRequired: storedObjective.squaresRequired || '',
          trackingPeriod: storedObjective.trackingPeriod || ''
        };
      case 'Steps':
        return {
          objective: {
            steps: storedObjective.objective?.split(' ')[0] || 0,
            trackingPeriod: storedObjective.trackingPeriod || 'Day'
          }
        };
      case 'Distance':
        const storedValue = storedObjective.objective?.split(' ')[0];
        const storedUnit = storedObjective.objective?.split(' ')[1] || 'kilometers';
        return {
          objective: {
            value: storedValue ? Number(storedValue) : '',
            unit: storedUnit
          }
        };
      default:
        return {
          objective: storedObjective.objective || '',
          measurement: storedObjective.measurement || '',
          trackingPeriod: storedObjective.trackingPeriod || '',
          squaresRequired: storedObjective.squaresRequired || '',
          dailyChallenges: storedObjective.dailyChallenges || '',
          questionsRequired: storedObjective.questionsRequired || ''
        };
    }
  }, [storedObjective, theme]);

  // Initialize form
  const form = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(getFormSchema(theme))
  });

  // Watch form values
  const { watch } = form;
  const objectiveValue = watch('objective');
  const squaresRequired = watch('squaresRequired');

  // Validation helpers
  const isBingoValid = theme === 'Bingo' ? Boolean(squaresRequired) : true;
  const isDistanceValid = theme === 'Distance' ? 
    Boolean(objectiveValue?.value) && objectiveValue?.value !== 0 && Boolean(objectiveValue?.unit) : true;
  const isStepsValid = theme === 'Steps' ? 
    Boolean(objectiveValue?.steps) && Boolean(objectiveValue?.trackingPeriod) : true;

  // Handle form changes and dispatch updates
  useEffect(() => {
    const subscription = watch((data) => {
      if (!data) return;

      let formattedObjective = '';
      let measurement = '';
      let objectiveData = {};
      
      switch (theme) {
        case 'Distance':
          if (data.objective?.value && data.objective.value !== 0) {
            formattedObjective = `${data.objective.value} ${data.objective.unit}`;
            measurement = data.objective.unit;
            objectiveData = {
              value: data.objective.value,
              unit: data.objective.unit
            };
          }
          break;
        case 'Steps':
          if (data.objective?.steps) {
            formattedObjective = `${data.objective.steps} steps`;
            measurement = 'steps';
            objectiveData = {
              steps: data.objective.steps,
              trackingPeriod: data.objective.trackingPeriod
            };
          }
          break;
        case 'Bingo':
          if (data.squaresRequired) {
            formattedObjective = `${data.squaresRequired} squares`;
            measurement = 'squares';
            objectiveData = {
              squaresRequired: data.squaresRequired
            };
          }
          break;
        case 'Mini Challenge':
          if (data.dailyChallenges) {
            formattedObjective = `${data.dailyChallenges} challenges`;
            measurement = 'challenges';
            objectiveData = {
              dailyChallenges: data.dailyChallenges
            };
          }
          break;
        case 'Nutrition Quiz':
          if (data.questionsRequired) {
            formattedObjective = `${data.questionsRequired} questions`;
            measurement = 'questions';
            objectiveData = {
              questionsRequired: data.questionsRequired
            };
          }
          break;
        default:
          if (data.objective) {
            formattedObjective = data.objective;
            measurement = data.measurement || '';
            objectiveData = {
              objective: data.objective
            };
          }
      }

      if (formattedObjective) {
        const finalObjectiveData = {
          objective: {
            objective: formattedObjective,
            measurement: measurement,
            trackingPeriod: data.trackingPeriod || '',
            squaresRequired: data.squaresRequired || '',
            dailyChallenges: data.dailyChallenges || '',
            questionsRequired: data.questionsRequired || '',
            rawData: {
              ...data,
              theme: theme,
              objectiveData: objectiveData
            }
          }
        };
        
        dispatch(updateFormData(finalObjectiveData));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, theme, dispatch]);

  return form;
}

export function ObjectiveStep({ subStep, form }: ObjectiveStepProps) {
  const { formData } = useAppSelector((state) => state.challenge);
  const category = formData.basicInformation?.category || '';
  const theme = formData.basicInformation?.theme || '';

  const questions = getObjectiveQuestions(category, theme);

  const renderQuestions = () => {
    return questions.map((question) => (
      <FormField
        key={question.name}
        control={form.control}
        name={question.name as any}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="text-xl font-semibold mb-2 block">{question.label}</FormLabel>
            {question.subtitle && (
              <p className="text-muted-foreground mb-4">{question.subtitle}</p>
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={question.name}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                {question.render(
                  { 
                    ...field, 
                    value: typeof field.value === 'object' ? field.value : field.value 
                  }, 
                  form, 
                  fieldState
                )}
              </motion.div>
            </AnimatePresence>
            {fieldState.error && (
              <p className="text-sm text-destructive mt-2">{fieldState.error.message}</p>
            )}
          </FormItem>
        )}
      />
    ));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background">
      <div className="w-full max-w-2xl">
        <Form {...form}>
          <form className="space-y-8">
            {renderQuestions()}
          </form>
        </Form>
      </div>
    </div>
  );
} 