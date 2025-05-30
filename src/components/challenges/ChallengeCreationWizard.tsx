'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress, SegmentedProgress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicInformationStep, useBasicInformationForm, BASIC_INFO_TOTAL } from './steps/BasicInformationStep';
import { TimelineStep, useTimelineForm, TIMELINE_TOTAL } from './steps/TimelineStep';
import { DetailsStep, useDetailsForm, DETAILS_TOTAL } from './steps/DetailsStep';
import { ObjectiveStep, useObjectiveForm, getObjectiveTotal } from './steps/ObjectiveStep';
import { RewardsStep, useRewardsForm, getRewardsVisibleQuestions } from './steps/RewardsStep';
import { EligibilityStep, useEligibilityForm, ELIGIBILITY_TOTAL } from './steps/EligibilityStep';
import { FeaturesStep, useFeaturesForm, FEATURES_TOTAL } from './steps/FeaturesStep';
import { ReviewStep } from './steps/ReviewStep';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentStep, setCurrentSubStep } from '@/store/challengeSlice';

const steps = [
  { id: 'basic', label: 'Basic Information' },
  { id: 'objective', label: 'Challenge Objective' },
  { id: 'timeline', label: 'Challenge Timeline' },
  { id: 'details', label: 'Challenge Details' },
  { id: 'rewards', label: 'Rewards & Recognition' },
  { id: 'eligibility', label: 'User Eligibility' },
  { id: 'features', label: 'Additional Features' },
  { id: 'review', label: 'Review & Publish' },
];

export function ChallengeCreationWizard() {
  const dispatch = useAppDispatch();
  const { currentStep, currentSubStep, formData } = useAppSelector((state) => state.challenge);
  
  // For Basic Information step, manage subStep
  const [basicInfoSubStep, setBasicInfoSubStep] = useState(0);
  const basicInfoForm = useBasicInformationForm();

  // For Timeline step, manage subStep
  const [timelineSubStep, setTimelineSubStep] = useState(0);
  const timelineForm = useTimelineForm();

  // For Details step, manage subStep
  const [detailsSubStep, setDetailsSubStep] = useState(0);
  const detailsForm = useDetailsForm();

  // For Objective step, manage subStep
  const [objectiveSubStep, setObjectiveSubStep] = useState(0);
  const objectiveForm = useObjectiveForm();

  // For Rewards step, manage subStep
  const [rewardsSubStep, setRewardsSubStep] = useState(0);
  const rewardsForm = useRewardsForm();

  // For Eligibility step, manage subStep
  const [eligibilitySubStep, setEligibilitySubStep] = useState(0);
  const eligibilityForm = useEligibilityForm();

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

  // Substep field arrays
  const basicInfoQuestions: ('name' | 'category' | 'theme' | 'importance')[] = ['name', 'category', 'theme', 'importance'];
  const timelineQuestions: ('enrollmentStartDate' | 'enrollmentEndDate' | 'activeStartDate' | 'activeEndDate')[] = [
    'enrollmentStartDate',
    'enrollmentEndDate',
    'activeStartDate',
    'activeEndDate',
  ];
  const detailsQuestions: ('headline' | 'summary' | 'image' | 'heroImage')[] = ['headline', 'summary', 'image', 'heroImage'];
  const objectiveQuestions: ('objective' | 'measurement' | 'trackingPeriod' | 'squaresRequired' | 'dailyChallenges' | 'questionsRequired')[] = ['objective', 'measurement', 'trackingPeriod', 'squaresRequired', 'dailyChallenges', 'questionsRequired'];
  const rewardsQuestions: ('rewardTypes' | 'points' | 'badge' | 'sponsoredReward')[] = ['rewardTypes', 'points', 'badge', 'sponsoredReward'];
  const eligibilityQuestions: ('cohort')[] = ['cohort'];
  const featuresQuestions: ('nextBestActions' | 'promoHeadline' | 'promoDetails' | 'promoImage' | 'leaderboardType')[] = [
    'nextBestActions',
    'promoHeadline',
    'promoDetails',
    'promoImage',
    'leaderboardType',
  ];

  // Dynamic rewards total
  const rewardsVisibleQuestions = getRewardsVisibleQuestions(rewardsForm);
  const REWARDS_TOTAL_DYNAMIC = rewardsVisibleQuestions.length;
  // Dynamic features visible questions (for future-proofing, in case you want to make features step dynamic)
  const featuresVisibleQuestions = featuresQuestions;
  const FEATURES_TOTAL_DYNAMIC = featuresVisibleQuestions.length || FEATURES_TOTAL;

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
    (isTimelineStep && timelineSubStep === TIMELINE_TOTAL - 1 && currentStep === steps.length - 1) ||
    (isDetailsStep && detailsSubStep === DETAILS_TOTAL - 1 && currentStep === steps.length - 1) ||
    (isObjectiveStep && objectiveSubStep === objectiveTotal - 1 && currentStep === steps.length - 1) ||
    (isRewardsStep && rewardsSubStep === REWARDS_TOTAL_DYNAMIC - 1 && currentStep === steps.length - 1) ||
    (isEligibilityStep && eligibilitySubStep === ELIGIBILITY_TOTAL - 1 && currentStep === steps.length - 1) ||
    (isFeaturesStep && featuresSubStep === FEATURES_TOTAL - 1 && currentStep === steps.length - 1) ||
    (!isBasicInfoStep && !isTimelineStep && !isDetailsStep && !isObjectiveStep && !isRewardsStep && !isEligibilityStep && !isFeaturesStep && currentStep === steps.length - 1);

  // isValid logic
  let isValid = true;
  if (isBasicInfoStep) {
    const field = basicInfoQuestions[currentSubStep];
    const value = formData.basicInformation?.[field];
    console.log('Basic Info - Field:', field, 'Value:', value);
    isValid = !!value;
  } else if (isTimelineStep) {
    const field = timelineQuestions[currentSubStep];
    const value = timelineForm.getValues(field);
    console.log('Timeline - Field:', field, 'Value:', value);
    isValid = field === 'enrollmentEndDate' ? true : !!value;
  } else if (isDetailsStep) {
    const field = detailsQuestions[currentSubStep];
    const value = detailsForm.getValues(field);
    console.log('Details - Field:', field, 'Value:', value);
    isValid = !!value;
  } else if (isObjectiveStep) {
    const field = objectiveQuestions[currentSubStep];
    const value = objectiveForm.getValues(field);
    console.log('Objective Step Debug:', {
      field,
      value,
      theme,
      formValues: objectiveForm.getValues(),
      formState: objectiveForm.formState,
      isValid: !!value
    });
    isValid = theme === 'Bingo' ? !!objectiveForm.getValues('squaresRequired') : !!value;
  } else if (isRewardsStep) {
    const currentQuestion = rewardsVisibleQuestions[currentSubStep];
    const value = rewardsForm.getValues(currentQuestion?.name as any);
    console.log('Rewards - Field:', currentQuestion?.name, 'Value:', value);
    isValid = !!value;
  } else if (isEligibilityStep) {
    const field = eligibilityQuestions[currentSubStep];
    const value = eligibilityForm.getValues(field);
    console.log('Eligibility - Field:', field, 'Value:', value);
    isValid = !!value;
  } else if (isFeaturesStep) {
    const field = featuresVisibleQuestions[currentSubStep];
    const value = featuresForm.getValues(field as any);
    console.log('Features - Field:', field, 'Value:', value);
    isValid = !!value;
  }
  console.log('Current Step:', currentStep, 'SubStep:', currentSubStep, 'IsValid:', isValid);

  function handleNext() {
    if (isBasicInfoStep) {
      if (basicInfoSubStep < BASIC_INFO_TOTAL - 1) {
        setBasicInfoSubStep((s) => s + 1);
        return;
      }
      dispatch(setCurrentStep(currentStep + 1));
      return;
    }
    if (isTimelineStep) {
      if (timelineSubStep < TIMELINE_TOTAL - 1) {
        setTimelineSubStep((s) => s + 1);
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
    if (isEligibilityStep) {
      if (eligibilitySubStep < ELIGIBILITY_TOTAL - 1) {
        setEligibilitySubStep((s) => s + 1);
        return;
      }
    }
    if (isFeaturesStep) {
      if (featuresSubStep < FEATURES_TOTAL - 1) {
        setFeaturesSubStep((s) => s + 1);
        return;
      }
    }
    if (currentStep < steps.length - 1) {
      dispatch(setCurrentStep(currentStep + 1));
      dispatch(setCurrentSubStep(0));
    }
  }

  function handleBack() {
    if (isBasicInfoStep && currentSubStep > 0) {
      dispatch(setCurrentSubStep(currentSubStep - 1));
      return;
    }
    if (isTimelineStep && timelineSubStep > 0) {
      setTimelineSubStep((s) => s - 1);
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
    if (isEligibilityStep && eligibilitySubStep > 0) {
      setEligibilitySubStep((s) => s - 1);
      return;
    }
    if (isFeaturesStep && featuresSubStep > 0) {
      setFeaturesSubStep((s) => s - 1);
      return;
    }
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
      dispatch(setCurrentSubStep(0));
    }
  }

  function handleSubmit() {
    // Final submit logic here
    if (isBasicInfoStep) {
      basicInfoForm.handleSubmit((values) => {
        console.log('Basic Info:', values);
        handleNext();
      })();
    } else if (isTimelineStep) {
      timelineForm.handleSubmit((values) => {
        console.log('Timeline:', values);
        handleNext();
      })();
    } else if (isDetailsStep) {
      detailsForm.handleSubmit((values) => {
        console.log('Details:', values);
        handleNext();
      })();
    } else if (isObjectiveStep) {
      objectiveForm.handleSubmit((values) => {
        console.log('Objective:', values);
        handleNext();
      })();
    } else if (isRewardsStep) {
      rewardsForm.handleSubmit((values) => {
        console.log('Rewards:', values);
        handleNext();
      })();
    } else if (isEligibilityStep) {
      eligibilityForm.handleSubmit((values) => {
        console.log('Eligibility:', values);
        handleNext();
      })();
    } else if (isFeaturesStep) {
      featuresForm.handleSubmit((values) => {
        console.log('Features:', values);
        handleNext();
      })();
    } else {
      handleNext();
    }
  }

  // Render current step content
  let stepContent = null;
  if (isBasicInfoStep) {
    stepContent = (
      <BasicInformationStep subStep={basicInfoSubStep} />
    );
  } else if (isTimelineStep) {
    stepContent = (
      <TimelineStep subStep={timelineSubStep} form={timelineForm} />
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
  } else if (isEligibilityStep) {
    stepContent = (
      <EligibilityStep subStep={eligibilitySubStep} form={eligibilityForm} />
    );
  } else if (isFeaturesStep) {
    stepContent = (
      <FeaturesStep subStep={featuresSubStep} form={featuresForm} />
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
    } else if (section.id === 'timeline') {
      progress = timelineSubStep;
      total = TIMELINE_TOTAL;
    } else if (section.id === 'details') {
      progress = detailsSubStep;
      total = DETAILS_TOTAL;
    } else if (section.id === 'objective') {
      progress = objectiveSubStep;
      total = objectiveTotal;
    } else if (section.id === 'rewards') {
      progress = rewardsSubStep;
      total = REWARDS_TOTAL_DYNAMIC;
    } else if (section.id === 'eligibility') {
      progress = eligibilitySubStep;
      total = ELIGIBILITY_TOTAL;
    } else if (section.id === 'features') {
      progress = featuresSubStep;
      total = FEATURES_TOTAL;
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
      <div className="flex-1 flex flex-col items-center px-2 pt-10 pb-8 w-full">
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
            disabled={isFirst}
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