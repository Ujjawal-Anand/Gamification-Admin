import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ModernTextInput, ModernMultiSelect, ModernSelect } from '@/components/ui/modern-input';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateFormData } from '@/store/challengeSlice';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  nextBestActions: z.array(z.string()).min(1, 'Select at least one next best action'),
  nutritionWidget: z.string().optional(),
  recipeDiet: z.string().optional(),
});

interface FeaturesFormData {
  nextBestActions: string[];
  nutritionWidget?: string;
  recipeDiet?: string;
}

const nutritionWidgetOptions = [
  {
    value: 'limit_sweet_treats',
    label: 'Limit Sweet Treats (7 day and 21 days)',
    description: 'If you have a sweet tooth, you don\'t have to give sweets up, just reduce them and eat them mindfully.',
    requirements: [
      'Enable product shopping of eligible items on goal page and Health dashboard',
      'Requirement applies to both 7 day and 21-day goals',
      'Action: DS: Fruits, cookies/frozen desserts/bakery/candy+ use updated FHI score',
      'Product: Update Goal description'
    ]
  },
  {
    value: 'drink_more_water',
    label: 'Drink More Water (7 day and 21 days)',
    description: 'Make drinking water part of your daily routine.',
    requirements: [
      'Enable product shopping of eligible items on goal page and Health dashboard',
      'Requirement applies to both 7 day and 21-day goals',
      'Action: Beverages→ Water & Sparkling Water',
      'Sgc(Vitamin Waters)'
    ]
  },
  {
    value: 'nutty_breakfast',
    label: 'Nutty Breakfast Boost (7 day and 21 days)',
    description: 'Start your day right by including nuts or nut butters in your breakfast',
    requirements: [
      'Enable product shopping of eligible items on goal page and Health dashboard',
      'Requirement applies to both 7 day and 21-day goals',
      'Nut Categories: Sub Classes',
      'Range of FHI thresholds',
      'Recipes Breakfast'
    ]
  },
  {
    value: 'start_with_salad',
    label: 'Start with a Salad (7 day and 21 days)',
    description: 'Start a meal with a salad',
    requirements: [
      'Enable product shopping of eligible items on goal page and Health dashboard',
      'Requirement applies to both 7 day and 21-day goals',
      'Salad within Produce (also look Salad Kits)',
      'Food Service & Ready Meals'
    ]
  },
  {
    value: 'fruit_dessert',
    label: 'Fruit as Dessert (7 day and 21 days)',
    description: 'Indulge your sweet tooth with fruit',
    requirements: [
      'Enable product shopping of eligible items on goal page and Health dashboard',
      'Requirement applies to both 7 day and 21-day goals',
      'Fresh Produce with FHI threshold',
      'Primary Food Group with "Fruit" & FHI thresholds'
    ]
  },
  {
    value: 'salad_meal',
    label: 'Salad as Meal (7 day and 21 days)',
    description: 'Enjoy the benefits of eating a salad as a main meal',
    requirements: [
      'Enable product shopping of eligible items on goal page and Health dashboard',
      'Requirement applies to both 7 day and 21-day goals',
      'Find where Ready Meal Salad is falling'
    ]
  },
  {
    value: 'eat_more_fiber',
    label: 'Eat More Fiber (7 day and 21 days)',
    description: 'Include more fiber in your diet',
    requirements: [
      'Enable product shopping of eligible items on goal page and Health dashboard',
      'Requirement applies to both 7 day and 21-day goals',
      'Leverage Fiber pick tag'
    ]
  },
  {
    value: 'seafood_focus',
    label: 'Seafood Focus (7 day and 21 days)',
    description: 'Enjoy seafood twice a week for quality protein and other important nutrients',
    requirements: [
      'Enable product shopping of eligible items on goal page and Health dashboard',
      'Requirement applies to both 7 day and 21-day goals'
    ]
  },
  {
    value: 'enjoy_salmon',
    label: 'Enjoy Salmon (7 day and 21 days)',
    description: 'Enjoy some savory salmon while providing vital nutrients to your body',
    requirements: [
      'Enable product shopping of eligible items on goal page and Health dashboard',
      'Requirement applies to both 7 day and 21-day goals'
    ]
  },
  {
    value: 'vegetable_snacks',
    label: 'Vegetable Snacks (7 day and 21 days)',
    description: 'Choose veggies as a snack option',
    requirements: [
      'Enable product shopping of eligible items on goal page and Health dashboard',
      'Requirement applies to both 7 day and 21-day goals'
    ]
  },
  {
    value: 'carry_water',
    label: 'Carry Water with You (7 day and 21 days)',
    description: 'Have a bottle of water always at hand',
    requirements: [
      'Enable product shopping of eligible items on goal page and Health dashboard',
      'Requirement applies to both 7 day and 21-day goals'
    ]
  }
];

const recipeDietOptions = [
  { 
    value: 'mediterranean', 
    label: 'Mediterranean Diet',
    description: 'A heart-healthy eating plan that emphasizes fruits, vegetables, whole grains, beans, nuts, legumes, olive oil, and flavorful herbs and spices.',
    icon: '🌊'
  },
  { 
    value: 'keto', 
    label: 'Keto Diet',
    description: 'A high-fat, low-carbohydrate diet that helps your body burn fat for energy instead of carbohydrates.',
    icon: '🥑'
  },
  { 
    value: 'vegetarian', 
    label: 'Vegetarian Diet',
    description: 'A plant-based diet that excludes meat but may include dairy products and eggs.',
    icon: '🥗'
  },
  { 
    value: 'vegan', 
    label: 'Vegan Diet',
    description: 'A plant-based diet that excludes all animal products, including meat, dairy, eggs, and honey.',
    icon: '🌱'
  },
  { 
    value: 'paleo', 
    label: 'Paleo Diet',
    description: 'A diet based on foods presumed to have been available to Paleolithic humans, including lean meats, fish, fruits, vegetables, nuts, and seeds.',
    icon: '🥩'
  },
];

const questions = [
  {
    name: 'nextBestActions',
    label: 'What next best actions will appear on the active challenge page?',
    subtitle: 'Select the next best actions that will be shown to participants',
    render: (field: any, _form: any, fieldState: any) => (
      <ModernMultiSelect
        value={field.value || []}
        onChange={field.onChange}
        error={fieldState?.error?.message}
        label="Next Best Actions"
        options={[
          { value: 'Nutrition Widget', label: 'Nutrition Widget' },
          { value: 'Recipes', label: 'Recipes' },
        ]}
      />
    ),
  },
  {
    name: 'nutritionWidget',
    label: 'Which nutrition widget will appear?',
    subtitle: 'Select the nutrition widget that will be shown to participants',
    render: (field: any, _form: any, fieldState: any) => (
      <div className="space-y-4">
        {nutritionWidgetOptions.map((option) => (
          <div
            key={option.value}
            className={cn(
              'p-4 rounded-2xl border cursor-pointer transition-colors',
              field.value === option.value
                ? 'border-primary bg-primary/10'
                : 'border-input hover:border-primary/50'
            )}
            onClick={() => field.onChange(option.value)}
          >
            <h3 className="font-semibold mb-2">{option.label}</h3>
            <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
            <div className="space-y-1">
              {option.requirements.map((req, index) => (
                <p key={index} className="text-sm text-muted-foreground">• {req}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    name: 'recipeDiet',
    label: 'Which diet will recipes be surfaced from?',
    subtitle: 'Select the diet type for recipe recommendations',
    render: (field: any, _form: any, fieldState: any) => (
      <div className="space-y-4">
        {recipeDietOptions.map((option) => (
          <div
            key={option.value}
            className={cn(
              'p-6 rounded-2xl border cursor-pointer transition-all',
              'hover:scale-[1.02]',
              field.value === option.value
                ? 'border-primary bg-primary/10'
                : 'border-input hover:border-primary/50'
            )}
            onClick={() => field.onChange(option.value)}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{option.icon}</span>
              <h3 className="font-semibold text-lg">{option.label}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{option.description}</p>
          </div>
        ))}
      </div>
    ),
  },
];

export function useFeaturesForm() {
  const { formData } = useAppSelector((state) => state.challenge);
  
  return useForm<FeaturesFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nextBestActions: formData.features?.nextBestActions || [],
      nutritionWidget: formData.features?.nutritionWidget || '',
      recipeDiet: formData.features?.recipeDiet || '',
    },
    mode: 'onChange',
  });
}

interface FeaturesStepProps {
  subStep: number;
  form: ReturnType<typeof useFeaturesForm>;
  onAdvanceSubStep: () => void;
  totalSteps: number;
}

export function FeaturesStep({ subStep, form, onAdvanceSubStep, totalSteps }: FeaturesStepProps) {
  const dispatch = useAppDispatch();
  const selectedActions = form.watch('nextBestActions') || [];

  // Get the current question based on subStep and selected actions
  const getCurrentQuestion = () => {
    if (subStep === 0) {
      return questions[0]; // Always show the first question (nextBestActions)
    }

    // If Nutrition Widget is selected and we're on step 1
    if (selectedActions.includes('Nutrition Widget') && subStep === 1) {
      return questions[1]; // Show nutrition widget question
    }

    // If Recipes is selected and we're on step 1 (and Nutrition Widget is not selected)
    // or if we're on step 2 and both are selected
    if (selectedActions.includes('Recipes') && 
        ((subStep === 1 && !selectedActions.includes('Nutrition Widget')) || 
         (subStep === 2 && selectedActions.includes('Nutrition Widget')))) {
      return questions[2]; // Show recipe diet question
    }

    return null;
  };

  const currentQuestion = getCurrentQuestion();

  // If no valid question for current state, return null
  if (!currentQuestion) {
    return null;
  }

  const currentValue = form.watch(currentQuestion.name as keyof FeaturesFormData);

  // Validate the current question based on the context
  const validateCurrentQuestion = () => {
    if (currentQuestion.name === 'nextBestActions') {
      return Array.isArray(currentValue) && currentValue.length > 0;
    }
    if (currentQuestion.name === 'nutritionWidget') {
      return selectedActions.includes('Nutrition Widget') ? !!currentValue : true;
    }
    if (currentQuestion.name === 'recipeDiet') {
      return selectedActions.includes('Recipes') ? !!currentValue : true;
    }
    return false;
  };

  // Update form validation state
  useEffect(() => {
    const isValid = validateCurrentQuestion();
    if (isValid) {
      form.clearErrors(currentQuestion.name as any);
    } else {
      form.setError(currentQuestion.name as any, {
        type: 'manual',
        message: 'This field is required'
      });
    }
  }, [currentValue, selectedActions, currentQuestion.name, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      dispatch(updateFormData({
        features: {
          nextBestActions: (value.nextBestActions || []).filter((item): item is string => item !== undefined),
          nutritionWidget: value.nutritionWidget,
          recipeDiet: value.recipeDiet,
        }
      }));
    });
    return () => subscription.unsubscribe();
  }, [form, dispatch]);

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

export function getFeaturesTotalSteps(selectedActions: string[]) {
  if (!selectedActions.length) return 1;
  if (selectedActions.includes('Nutrition Widget') && selectedActions.includes('Recipes')) return 3;
  return 2;
} 