import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm, UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateFormData } from '@/store/challengeSlice';
import { ModernTextInput, ModernSelect, ModernMultiSelect } from '@/components/ui/modern-input';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Trophy, Medal, Star, Award, Crown, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomSheetInfo } from '@/components/challenges/BottomSheetInfo';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  rewardTypes: z.array(z.string()).min(1, 'At least one reward type is required'),
  points: z.number().optional(),
  badgeId: z.string().optional(),
}).refine((data) => {
  // Only validate points if points type is selected
  // if (data.rewardTypes.includes('points')) {
  //   if (!data.points) {
  //     return false;
  //   }
  // }
  // // Only validate badge if badge type is selected
  // if (data.rewardTypes.includes('badge')) {
  //   if (!data.badgeId) {
  //     return false;
  //   }
  // }
  return true;
}, {
  message: "Please complete the reward details for your selected reward types",
  path: ["rewardTypes"]
});

interface RewardsFormData {
  rewardTypes: string[];
  points?: number;
  badgeId?: string;
}

// Mock data for badges - replace with actual API call
const challengeBadges = [
  { 
    value: 'badge1', 
    label: 'Challenge Master',
    icon: Trophy,
    description: 'Awarded for completing multiple challenges'
  },
  { 
    value: 'badge2', 
    label: 'Health Champion',
    icon: Medal,
    description: 'Achieved for maintaining healthy habits'
  },
  { 
    value: 'badge3', 
    label: 'Wellness Warrior',
    icon: Star,
    description: 'Earned through consistent wellness activities'
  },
  { 
    value: 'badge4', 
    label: 'Fitness Pro',
    icon: Award,
    description: 'Given for exceptional fitness achievements'
  },
  { 
    value: 'badge5', 
    label: 'Wellness Leader',
    icon: Crown,
    description: 'Awarded for leading wellness initiatives'
  },
  { 
    value: 'badge6', 
    label: 'Goal Achiever',
    icon: Target,
    description: 'Earned by reaching significant milestones'
  },
];

// Create a separate component for the badge selection
function BadgeSelection({ field, fieldState }: { field: any; fieldState: any }) {
  const [selectedBadge, setSelectedBadge] = useState<typeof challengeBadges[0] | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-3 gap-6 mt-8">
        {challengeBadges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.value}
              onClick={() => {
                setSelectedBadge(badge);
                setIsSheetOpen(true);
              }}
              className={cn(
                'flex flex-col items-center p-6 rounded-xl cursor-pointer transition-all',
                'hover:bg-primary/5 hover:scale-105',
                field.value === badge.value
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'border-2 border-transparent'
              )}
            >
              <div className={cn(
                'p-4 rounded-full mb-4',
                field.value === badge.value ? 'bg-primary/20' : 'bg-muted'
              )}>
                <Icon className={cn(
                  'w-12 h-12',
                  field.value === badge.value ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>
              <h3 className="text-lg font-semibold text-center">{badge.label}</h3>
            </div>
          );
        })}
      </div>

      <BottomSheetInfo
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        icon={selectedBadge?.icon && <selectedBadge.icon className="w-16 h-16 text-primary" />}
        title={selectedBadge?.label || ''}
        subtitle="Badge Details"
        description={selectedBadge?.description}
      >
        <div className="w-full mt-6">
          <Button 
            className="w-full" 
            onClick={() => {
              if (selectedBadge) {
                field.onChange(selectedBadge.value);
                setIsSheetOpen(false);
              }
            }}
          >
            Select Badge
          </Button>
        </div>
      </BottomSheetInfo>
    </>
  );
}

const questions = [
  {
    name: 'rewardTypes',
    label: 'What types of rewards will you offer?',
    subtitle: 'Select at least one type of reward that participants will receive upon completing the challenge',
    render: (field: any, _form: any, fieldState: any) => (
      <ModernMultiSelect
        value={field.value || []}
        onChange={field.onChange}
        error={fieldState?.error?.message}
        label="Reward Types"
        options={[
          { value: 'points', label: 'Points' },
          { value: 'badge', label: 'Badge' },
        ]}
      />
    ),
  },
  {
    name: 'points',
    label: 'How many healthy points will participants earn?',
    subtitle: 'Enter the number of points that will be awarded upon challenge completion',
    render: (field: any, _form: any, fieldState: any) => (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-4">
          <Input
            type="number"
            value={field.value || ''}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              field.onChange(isNaN(value) ? 0 : value);
            }}
            className={cn(
              'w-32 text-5xl text-center py-4 focus:outline-none transition-all bg-transparent font-bold border-none',
              fieldState?.error ? 'text-destructive' : 'text-foreground'
            )}
            placeholder="Enter points"
          />
          <span className="text-3xl font-bold">Points</span>
        </div>
        {fieldState?.error && (
          <p className="text-sm text-destructive mt-2 text-center">{fieldState.error.message}</p>
        )}
      </div>
    ),
  },
  {
    name: 'badgeId',
    label: 'Which badge will participants earn?',
    subtitle: 'Select the badge that will be awarded upon challenge completion',
    render: (field: any, _form: any, fieldState: any) => (
      <BadgeSelection field={field} fieldState={fieldState} />
    ),
  },
];

interface RewardsStepProps {
  subStep: number;
  form: UseFormReturn<RewardsFormData>;
  onAdvanceSubStep: () => void;
}

const RewardsStep = ({ subStep, form, onAdvanceSubStep }: RewardsStepProps) => {
  const dispatch = useAppDispatch();
  const { rewards } = useAppSelector((state) => state.challenge.formData);
  const selectedRewardTypes = form.watch('rewardTypes') || [];

  // Ensure subStep is within bounds
  const validSubStep = Math.min(subStep, questions.length - 1);
  const currentQuestion = questions[validSubStep];
  const currentValue = form.watch(currentQuestion.name as keyof RewardsFormData);

  useEffect(() => {
    const subscription = form.watch((value) => {
      dispatch(updateFormData({ 
        rewards: {
          types: (value.rewardTypes || []).filter((type): type is string => type !== undefined),
          points: value.points,
          badgeId: value.badgeId
        } 
      }));
    });
    return () => subscription.unsubscribe();
  }, [form, dispatch]);

  // Handle step advancement based on selected reward types
  useEffect(() => {
    if (currentQuestion.name === 'points' && !selectedRewardTypes.includes('points')) {
      onAdvanceSubStep();
    } else if (currentQuestion.name === 'badgeId' && !selectedRewardTypes.includes('badge')) {
      onAdvanceSubStep();
    }
  }, [currentQuestion.name, selectedRewardTypes, onAdvanceSubStep]);

  // If we're beyond the last question, advance to the next step
  if (subStep >= questions.length) {
    onAdvanceSubStep();
    return null;
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
                {currentQuestion.render({ ...field, value: currentValue }, form, fieldState)}
              </motion.div>
            </AnimatePresence>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
};

export function useRewardsForm() {
  const { rewards } = useAppSelector((state) => state.challenge.formData);
  
  return useForm<RewardsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rewardTypes: rewards?.types || [],
      points: rewards?.points,
      badgeId: rewards?.badgeId,
    },
    mode: 'onChange',
  });
}

export default RewardsStep; 