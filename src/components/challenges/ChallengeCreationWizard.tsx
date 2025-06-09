'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress, SegmentedProgress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicInformationStep, useBasicInformationForm, BASIC_INFO_TOTAL } from './steps/BasicInformationStep';
import { DetailsStep, useDetailsForm, DETAILS_TOTAL } from './steps/DetailsStep';
import { ObjectiveStep, useObjectiveForm, getObjectiveTotal } from './steps/ObjectiveStep';
import RewardsStep, { useRewardsForm } from './steps/RewardsStep';
import { FeaturesStep, useFeaturesForm, getFeaturesTotalSteps } from './steps/FeaturesStep';
import { ReviewStep } from './steps/ReviewStep';
import { StepIntroduction } from './steps/StepIntroduction';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentStep, setCurrentSubStep, setChallengeId, updateFormData } from '@/store/challengeSlice';
import { 
  Info, 
  Target, 
  Calendar, 
  FileText, 
  Trophy, 
  Users, 
  Settings,
  CheckCircle2,
  Star,
  Clock,
  Award,
  Heart,
  Sparkles
} from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { persistor } from '@/store';
import { useRouter, useSearchParams } from 'next/navigation';

// Add RewardsFormData interface
interface RewardsFormData {
  rewardTypes: string[];
  points?: number;
  badgeId?: string;
}

const steps = [
  { 
    id: 'basic', 
    label: 'Basic Information',
    description: 'Let\'s start with the essential details about your challenge.',
    videoSrc: '/video/step_1.mp4',
    features: [
      {
        title: 'Category & Theme',
        description: 'Choose the right category and theme to match your challenge goals.',
        icon: <Target className="h-5 w-5" />
      },
      {
        title: 'Importance Level',
        description: 'Set the priority level for your challenge.',
        icon: <Award className="h-5 w-5" />
      }
    ]
  },
  { 
    id: 'objective', 
    label: 'Challenge Objective',
    videoSrc: '/video/step_2.mp4',
    description: 'Define what you want to achieve with this challenge.',
    features: [
      {
        title: 'Primary Goal',
        description: 'Set clear, measurable objectives for your challenge.',
        icon: <Target className="h-5 w-5" />
      },
      {
        title: 'Measurement',
        description: 'Define how progress will be tracked and measured.',
        icon: <CheckCircle2 className="h-5 w-5" />
      },
    ]
  },
  { 
    id: 'details', 
    label: 'Challenge Details',
    videoSrc: '/video/step_3.mp4',
    description: 'Add rich content to make your challenge engaging.',
    features: [
      {
        title: 'Description',
        description: 'Provide detailed information about your challenge.',
        icon: <FileText className="h-5 w-5" />
      },
      {
        title: 'Media',
        description: 'Add images and videos to make it visually appealing.',
        icon: <Sparkles className="h-5 w-5" />
      },
      {
        title: 'Timeline',
        description: 'Set the duration and milestones for your challenge.',
        icon: <Clock className="h-5 w-5" />
      }
    ]
  },
  { 
    id: 'rewards', 
    label: 'Rewards & Recognition',
    videoSrc: '/video/step_4.mp4',
    description: 'Define how participants will be rewarded.',
    features: [
      {
        title: 'Reward Types',
        description: 'Choose from various reward options.',
        icon: <Trophy className="h-5 w-5" />
      },
      {
        title: 'Recognition',
        description: 'Set up badges and achievements.',
        icon: <Award className="h-5 w-5" />
      }
    ]
  },
  { 
    id: 'features', 
    label: 'Additional Features',
    videoSrc: '/video/step_3.mp4',
    description: 'Enhance your challenge with extra features.',
    features: [
      {
        title: 'Tracking',
        description: 'Set up progress tracking mechanisms.',
        icon: <Target className="h-5 w-5" />
      },
      {
        title: 'Social Features',
        description: 'Enable community interaction and sharing.',
        icon: <Users className="h-5 w-5" />
      }
    ]
  },
  { 
    id: 'review', 
    label: 'Review & Publish',
    videoSrc: '/video/step_4.mp4',
    description: 'Review all details before publishing your challenge.',
    features: [
      {
        title: 'Final Check',
        description: 'Review all challenge details and settings.',
        icon: <CheckCircle2 className="h-5 w-5" />
      },
      {
        title: 'Publish',
        description: 'Make your challenge live for participants.',
        icon: <Sparkles className="h-5 w-5" />
      }
    ]
  }
];

export function ChallengeCreationWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { id, currentStep, currentSubStep, formData } = useAppSelector((state) => state.challenge);
  const [showIntroduction, setShowIntroduction] = useState(true);
  
  // For Basic Information step, manage subStep
  const [basicInfoSubStep, setBasicInfoSubStep] = useState(0);
  const basicInfoForm = useBasicInformationForm();

  // For Timeline step, manage subStep
  const [timelineSubStep, setTimelineSubStep] = useState(0);

  // For Details step, manage subStep
  const [detailsSubStep, setDetailsSubStep] = useState(0);
  const detailsForm = useDetailsForm();

  // For Objective step, manage subStep
  const [objectiveSubStep, setObjectiveSubStep] = useState(0);
  const objectiveForm = useObjectiveForm();

  // For Rewards step, manage subStep
  const [rewardsSubStep, setRewardsSubStep] = useState(0);
  const rewardsForm = useRewardsForm() as UseFormReturn<RewardsFormData>;

  
  // For Features step, manage subStep
  const [featuresSubStep, setFeaturesSubStep] = useState(0);
  const featuresForm = useFeaturesForm();

  // Step helpers
  const isBasicInfoStep = steps[currentStep].id === 'basic';
  const isTimelineStep = steps[currentStep].id === 'timeline';
  const isDetailsStep = steps[currentStep].id === 'details';
  const isObjectiveStep = steps[currentStep].id === 'objective';
  const isRewardsStep = steps[currentStep].id === 'rewards';
  const isEligibilityStep = steps[currentStep].id === 'eligibility';
  const isFeaturesStep = steps[currentStep].id === 'features';

  const category = formData.basicInformation?.category || '';
  const theme = formData.basicInformation?.theme || '';
  const objectiveTotal = getObjectiveTotal(category, theme);

  // Calculate features total based on selected actions
  const featuresTotal = getFeaturesTotalSteps(formData.features?.nextBestActions || []);

  // Substep field arrays
  const basicInfoQuestions: ('category' | 'theme' | 'importance')[] = ['category', 'theme', 'importance'];
  const detailsQuestions: ('name' | 'headline' | 'summary' | 'image' | 'heroImage')[] = ['name', 'headline', 'summary', 'image', 'heroImage'];
  const objectiveQuestions: ('objective' | 'measurement' | 'trackingPeriod' | 'squaresRequired' | 'dailyChallenges' | 'questionsRequired')[] = ['objective', 'measurement', 'trackingPeriod', 'squaresRequired', 'dailyChallenges', 'questionsRequired'];
  const rewardsQuestions: ('rewardTypes' | 'points' | 'badgeId')[] = ['rewardTypes', 'points', 'badgeId'];
  const eligibilityQuestions: ('cohort')[] = ['cohort'];
  const featuresQuestions: ('nextBestActions' | 'nutritionWidget' | 'recipeDiet')[] = [
    'nextBestActions',
    'nutritionWidget',
    'recipeDiet',
  ];

  // Dynamic rewards total
  const rewardsVisibleQuestions = rewardsQuestions;
  const REWARDS_TOTAL_DYNAMIC = rewardsVisibleQuestions.length;
  // Dynamic features visible questions (for future-proofing, in case you want to make features step dynamic)
  const featuresVisibleQuestions = featuresQuestions;
  const FEATURES_TOTAL_DYNAMIC = featuresVisibleQuestions.length || featuresTotal;

  // Reset rewards substep if visible questions change
  useEffect(() => {
    if (isRewardsStep && rewardsSubStep >= REWARDS_TOTAL_DYNAMIC) {
      setRewardsSubStep(0);
    }
  }, [REWARDS_TOTAL_DYNAMIC, isRewardsStep]);

  // Reset features substep if visible questions change
  useEffect(() => {
    if (isFeaturesStep && featuresSubStep >= FEATURES_TOTAL_DYNAMIC) {
      setFeaturesSubStep(0);
    }
  }, [FEATURES_TOTAL_DYNAMIC, isFeaturesStep]);

  // isFirst and isLast logic
  const isFirst = currentStep === 0 && currentSubStep === 0;

  const isLast =
    (isBasicInfoStep && basicInfoSubStep === BASIC_INFO_TOTAL - 1 && currentStep === steps.length - 1) ||
    (isDetailsStep && detailsSubStep === DETAILS_TOTAL - 1 && currentStep === steps.length - 1) ||
    (isObjectiveStep && objectiveSubStep === objectiveTotal - 1 && currentStep === steps.length - 1) ||
    (isRewardsStep && rewardsSubStep === REWARDS_TOTAL_DYNAMIC - 1 && currentStep === steps.length - 1) ||
    (isFeaturesStep && featuresSubStep === featuresTotal - 1 && currentStep === steps.length - 1) ||
    (!isBasicInfoStep && !isTimelineStep && !isDetailsStep && !isObjectiveStep && !isRewardsStep && !isEligibilityStep && !isFeaturesStep && currentStep === steps.length);

  // isValid logic
  const [isValid, setIsValid] = useState(true);

  // Generate or get challenge ID
  useEffect(() => {
    const challengeId = searchParams.get('id');
    if (challengeId) {
      dispatch(setChallengeId(challengeId));
    } else {
      // Generate new ID if none exists
      const newId = crypto.randomUUID();
      dispatch(setChallengeId(newId));
      // Update URL with new ID
      const params = new URLSearchParams(searchParams.toString());
      params.set('id', newId);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, dispatch, router]);

  // Sync URL with current step and substep
  useEffect(() => {
    const step = searchParams.get('step');
    const substep = searchParams.get('substep');
    
    if (step && !isNaN(Number(step))) {
      const stepNum = Number(step);
      dispatch(setCurrentStep(stepNum));
      
      // Set the appropriate substep based on the current step
      if (substep && !isNaN(Number(substep))) {
        const substepNum = Number(substep);
        dispatch(setCurrentSubStep(substepNum));
        
        if (stepNum === 0) {
          setBasicInfoSubStep(substepNum);
        } else if (stepNum === 1) {
          setDetailsSubStep(substepNum);
        } else if (stepNum === 2) {
          setObjectiveSubStep(substepNum);
        } else if (stepNum === 3) {
          setRewardsSubStep(substepNum);
        } else if (stepNum === 4) {
          setFeaturesSubStep(substepNum);
        }
      }
    }
  }, [searchParams, dispatch]);

  // Handle back step
  function handleBack() {
    if (showIntroduction) {
      setShowIntroduction(false);
      return;
    }

    // Handle substeps first
    if (isBasicInfoStep && basicInfoSubStep > 0) {
      setBasicInfoSubStep((s) => s - 1);
      return;
    }
    if (isDetailsStep && detailsSubStep > 0) {
      setDetailsSubStep((s) => s - 1);
      return;
    }
    if (isObjectiveStep && objectiveSubStep > 0) {
      setObjectiveSubStep((s) => s - 1);
      return;
    }
    if (isRewardsStep && rewardsSubStep > 0) {
      setRewardsSubStep((s) => s - 1);
      return;
    }
    if (isFeaturesStep && featuresSubStep > 0) {
      setFeaturesSubStep((s) => s - 1);
      return;
    }

    // If we're at the first substep, go back to previous main step
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
      // Set the last substep of the previous step
      if (currentStep === 1) {
        setBasicInfoSubStep(BASIC_INFO_TOTAL - 1);
      } else if (currentStep === 2) {
        setDetailsSubStep(DETAILS_TOTAL - 1);
      } else if (currentStep === 3) {
        setObjectiveSubStep(objectiveTotal - 1);
      } else if (currentStep === 4) {
        setRewardsSubStep(REWARDS_TOTAL_DYNAMIC - 1);
      } else if (currentStep === 5) {
        setFeaturesSubStep(featuresTotal - 1);
      }
    }
  }

  // Update URL when step or substep changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set('id', id);
    }
    params.set('step', currentStep.toString());
    
    // Set the appropriate substep based on the current step
    let currentSubStepValue = 0;
    if (isBasicInfoStep) {
      currentSubStepValue = basicInfoSubStep;
    } else if (isDetailsStep) {
      currentSubStepValue = detailsSubStep;
    } else if (isObjectiveStep) {
      currentSubStepValue = objectiveSubStep;
    } else if (isRewardsStep) {
      currentSubStepValue = rewardsSubStep;
    } else if (isFeaturesStep) {
      currentSubStepValue = featuresSubStep;
    }
    
    params.set('substep', currentSubStepValue.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [
    id,
    currentStep,
    basicInfoSubStep,
    detailsSubStep,
    objectiveSubStep,
    rewardsSubStep,
    featuresSubStep,
    router,
    searchParams,
    isBasicInfoStep,
    isDetailsStep,
    isObjectiveStep,
    isRewardsStep,
    isFeaturesStep
  ]);

  useEffect(() => {
    if (showIntroduction) {
      setIsValid(true);
      return;
    }

    let currentIsValid = false;

    if (isBasicInfoStep) {
      const field = basicInfoQuestions[basicInfoSubStep];
      const value = formData.basicInformation?.[field];
      currentIsValid = value !== undefined && value !== null && value !== '';
    } else if (isDetailsStep) {
      const field = detailsQuestions[detailsSubStep];
      const value = detailsForm.getValues(field);
      currentIsValid = value !== undefined && value !== null && value !== '';
    } else if (isObjectiveStep) {
      const field = objectiveQuestions[objectiveSubStep];
      const value = objectiveForm.getValues(field);
      if (theme === 'Bingo') {
        currentIsValid = Boolean(objectiveForm.getValues('squaresRequired'));
      } else if (theme === 'Steps' && field === 'objective' && typeof value === 'object' && 'steps' in value) {
        currentIsValid = Boolean(value.steps) && Boolean(value.trackingPeriod);
      } else if (theme === 'Distance' && field === 'objective' && typeof value === 'object' && 'value' in value) {
        currentIsValid = Boolean(value.value) && Boolean(value.unit);
      } else if (theme === 'Mini Challenge') {
        currentIsValid = Boolean(objectiveForm.getValues('dailyChallenges'));
      } else if (theme === 'Nutrition Quiz') {
        currentIsValid = Boolean(objectiveForm.getValues('questionsRequired'));
      } else {
        currentIsValid = value !== undefined && value !== null && value !== '';
      }
    } else if (isRewardsStep) {
      const field = rewardsQuestions[rewardsSubStep];
      const value = rewardsForm.getValues(field);
      if (field === 'rewardTypes') {
        currentIsValid = Array.isArray(value) && value.length > 0;
      } else {
        currentIsValid = value !== undefined && value !== null && value !== '';
      }
    } else if (isFeaturesStep) {
      const field = featuresVisibleQuestions[featuresSubStep];
      const value = featuresForm.getValues(field as any);
      if (field === 'nextBestActions') {
        currentIsValid = Array.isArray(value) && value.length > 0;
      } else {
        currentIsValid = value !== undefined && value !== null && value !== '';
      }
    }

    console.log('Validation Debug:', {
      step: currentStep,
      subStep: {
        basicInfo: basicInfoSubStep,
        details: detailsSubStep,
        objective: objectiveSubStep,
        rewards: rewardsSubStep,
        features: featuresSubStep
      },
      field: isBasicInfoStep ? basicInfoQuestions[basicInfoSubStep] :
             isDetailsStep ? detailsQuestions[detailsSubStep] :
             isObjectiveStep ? objectiveQuestions[objectiveSubStep] :
             isRewardsStep ? rewardsQuestions[rewardsSubStep] :
             isFeaturesStep ? featuresVisibleQuestions[featuresSubStep] : null,
      value: isBasicInfoStep ? formData.basicInformation?.[basicInfoQuestions[basicInfoSubStep]] :
             isDetailsStep ? detailsForm.getValues(detailsQuestions[detailsSubStep]) :
             isObjectiveStep ? objectiveForm.getValues(objectiveQuestions[objectiveSubStep]) :
             isRewardsStep ? rewardsForm.getValues(rewardsQuestions[rewardsSubStep]) :
             isFeaturesStep ? featuresForm.getValues(featuresVisibleQuestions[featuresSubStep] as any) : null,
      isValid: currentIsValid
    });

    setIsValid(currentIsValid);
  }, [
    showIntroduction,
    isBasicInfoStep,
    isDetailsStep,
    isObjectiveStep,
    isRewardsStep,
    isFeaturesStep,
    basicInfoSubStep,
    detailsSubStep,
    objectiveSubStep,
    rewardsSubStep,
    featuresSubStep,
    formData.basicInformation,
    detailsForm.formState,
    objectiveForm.formState,
    rewardsForm.formState,
    featuresForm.formState,
    theme,
    basicInfoQuestions,
    detailsQuestions,
    objectiveQuestions,
    rewardsQuestions,
    featuresVisibleQuestions
  ]);

  function handleNext() {
    if (showIntroduction) {
      setShowIntroduction(false);
      return;
    }
    if (isBasicInfoStep) {
      if (basicInfoSubStep < BASIC_INFO_TOTAL - 1) {
        setBasicInfoSubStep((s) => s + 1);
        return;
      }
      dispatch(setCurrentStep(currentStep + 1));
      return;
    }
    if (isDetailsStep) {
      if (detailsSubStep < DETAILS_TOTAL - 1) {
        setDetailsSubStep((s) => s + 1);
        return;
      }
      dispatch(setCurrentStep(currentStep + 1));
      return;
    }
    if (isObjectiveStep) {
      if (objectiveSubStep < objectiveTotal - 1) {
        setObjectiveSubStep((s) => s + 1);
        return;
      }
      dispatch(setCurrentStep(currentStep + 1));
      return;
    }
    if (isRewardsStep) {
      if (rewardsSubStep < REWARDS_TOTAL_DYNAMIC - 1) {
        setRewardsSubStep((s) => s + 1);
        return;
      }
    }
    if (isFeaturesStep) {
      if (featuresSubStep < featuresTotal - 1) {
        setFeaturesSubStep((s) => s + 1);
        return;
      }
    }
    if (currentStep < steps.length - 1) {
      dispatch(setCurrentStep(currentStep + 1));
      dispatch(setCurrentSubStep(0));
    }
  }

  // Reset substeps when changing main step
  useEffect(() => {
    if (currentStep > 0) {
      dispatch(setCurrentSubStep(0));
    }
  }, [currentStep, dispatch]);

  // Reset introduction when changing steps
  useEffect(() => {
    setShowIntroduction(true);
  }, [currentStep]);

  // Handle form submission
  const handleSubmit = () => {
    if (showIntroduction) {
      setShowIntroduction(false);
      return;
    }

    if (isBasicInfoStep) {
      basicInfoForm.handleSubmit((values) => {
        console.log('Basic Info:', values);
        dispatch(updateFormData({ basicInformation: values }));
        handleNext();
      })();
    } else if (isDetailsStep) {
      detailsForm.handleSubmit((values) => {
        console.log('Details:', values);
        dispatch(updateFormData({ details: values }));
        handleNext();
      })();
    } else if (isObjectiveStep) {
      objectiveForm.handleSubmit((values: any) => {
        console.log('Objective:', values);
        handleNext();
      })();
    } else if (isRewardsStep) {
      rewardsForm.handleSubmit((values) => {
        console.log('Rewards:', values);
        dispatch(updateFormData({ rewards: values }));
        handleNext();
      })();
    } else if (isFeaturesStep) {
      featuresForm.handleSubmit((values) => {
        console.log('Features:', values);
        dispatch(updateFormData({ features: values }));
        handleNext();
      })();
    } else {
      // Clear persisted state when wizard is completed
      persistor.purge();
      handleNext();
    }
  };

  // Handle save and exit
  const handleSaveAndExit = () => {
    // State is automatically persisted by redux-persist
    // You can add navigation logic here to redirect to another page
  };

  // Render current step content
  let stepContent = null;
  if (showIntroduction) {
    const currentStepInfo = steps[currentStep];
    stepContent = (
      <StepIntroduction
        title={currentStepInfo.label}
        description={currentStepInfo.description}
        features={currentStepInfo.features}
        stepNumber={currentStep + 1}
        videoSrc={currentStepInfo.videoSrc}
      />
    );
  } else if (isBasicInfoStep) {
    stepContent = (
      <BasicInformationStep subStep={basicInfoSubStep} />
    );
  } else if (isDetailsStep) {
    stepContent = (
      <DetailsStep subStep={detailsSubStep} form={detailsForm} />
    );
  } else if (isObjectiveStep) {
    stepContent = (
      <ObjectiveStep subStep={objectiveSubStep} form={objectiveForm} />
    );
  } else if (isRewardsStep) {
    stepContent = (
      <RewardsStep
        subStep={rewardsSubStep}
        form={rewardsForm}
        onAdvanceSubStep={() => setRewardsSubStep((s) => s + 1)}
      />
    );
  } else if (isFeaturesStep) {
    stepContent = (
      <FeaturesStep 
        subStep={featuresSubStep} 
        form={featuresForm}
        onAdvanceSubStep={() => setFeaturesSubStep((s) => s + 1)}
        totalSteps={featuresTotal}
      />
    );
  } else {
    stepContent = <ReviewStep />;
  }

  // Calculate progress for each section
  const getSectionProgress = (sectionIndex: number) => {
    const section = steps[sectionIndex];
    let progress = 0;
    let total = 0;

    if (section.id === 'basic') {
      progress = basicInfoSubStep;
      total = BASIC_INFO_TOTAL;
    } else if (section.id === 'details') {
      progress = detailsSubStep;
      total = DETAILS_TOTAL;
    } else if (section.id === 'objective') {
      progress = objectiveSubStep;
      total = objectiveTotal;
    } else if (section.id === 'rewards') {
      progress = rewardsSubStep;
      total = REWARDS_TOTAL_DYNAMIC;
    } else if (section.id === 'features') {
      progress = featuresSubStep;
      total = featuresTotal;
    }

    // Calculate progress as a percentage
    const percentage = (progress / total) * 100;
    
    // If this is the active section, show partial progress
    if (sectionIndex === currentStep) {
      return percentage;
    }
    
    // If this is a completed section, show 100%
    if (sectionIndex < currentStep) {
      return 100;
    }
    
    // If this is a future section, show 0%
    return 0;
  };

  const progressSegments = steps.map((step, index) => ({
    label: step.label,
    value: getSectionProgress(index),
    isActive: currentStep === index,
    isCompleted: currentStep > index
  }));

  return (
    <div className="relative min-h-screen bg-background flex flex-col">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex justify-between items-center px-6 py-4">
        <Button variant="outline" className="rounded-full px-6">Save & exit</Button>
        <Button variant="outline" className="rounded-full px-6">Questions?</Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-10 pb-8 w-full">
        <div className="w-full max-w-xl">
          {stepContent}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 z-30 bg-white flex flex-col items-center py-4">
        <SegmentedProgress segments={progressSegments} className="w-full max-w-xl mb-4" />
        <div className="flex w-full max-w-xl justify-between items-center px-4">
          <Button
            variant="outline"
            type="button"
            onClick={handleBack}
            // disabled={isFirst}
          >
            Back
          </Button>
          {isLast ? (
            <Button type="button" onClick={handleSubmit} disabled={!isValid}>
              Save and Continue
            </Button>
          ) : (
            <Button type="button" onClick={handleNext} disabled={!isValid}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 