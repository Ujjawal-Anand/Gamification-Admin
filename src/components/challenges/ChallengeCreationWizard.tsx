'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicInformationStep, useBasicInformationForm, BASIC_INFO_TOTAL } from './steps/BasicInformationStep';
import { TimelineStep, useTimelineForm, TIMELINE_TOTAL } from './steps/TimelineStep';
import { DetailsStep, useDetailsForm, DETAILS_TOTAL } from './steps/DetailsStep';
import { ObjectiveStep, useObjectiveForm, OBJECTIVE_TOTAL } from './steps/ObjectiveStep';
import { RewardsStep, useRewardsForm, getRewardsVisibleQuestions } from './steps/RewardsStep';
import { EligibilityStep, useEligibilityForm, ELIGIBILITY_TOTAL } from './steps/EligibilityStep';
import { FeaturesStep, useFeaturesForm, FEATURES_TOTAL } from './steps/FeaturesStep';

const steps = [
  { id: 'basic', label: 'Basic Information' },
  { id: 'timeline', label: 'Challenge Timeline' },
  { id: 'details', label: 'Challenge Details' },
  { id: 'objective', label: 'Challenge Objective' },
  { id: 'rewards', label: 'Rewards & Recognition' },
  { id: 'eligibility', label: 'User Eligibility' },
  { id: 'features', label: 'Additional Features' },
  { id: 'review', label: 'Review & Publish' },
];

export function ChallengeCreationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
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

  // Substep field arrays
  const basicInfoQuestions: ('name' | 'category' | 'theme' | 'importance')[] = ['name', 'category', 'theme', 'importance'];
  const timelineQuestions: ('enrollmentStartDate' | 'enrollmentEndDate' | 'activeStartDate' | 'activeEndDate')[] = [
    'enrollmentStartDate',
    'enrollmentEndDate',
    'activeStartDate',
    'activeEndDate',
  ];
  const detailsQuestions: ('headline' | 'summary' | 'image' | 'heroImage')[] = ['headline', 'summary', 'image', 'heroImage'];
  const objectiveQuestions: ('objective' | 'criteria')[] = ['objective', 'criteria'];
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
  const isFirst =
    (isBasicInfoStep && currentStep === 0 && basicInfoSubStep === 0) ||
    (isTimelineStep && currentStep === 1 && timelineSubStep === 0) ||
    (isDetailsStep && currentStep === 2 && detailsSubStep === 0) ||
    (isObjectiveStep && currentStep === 3 && objectiveSubStep === 0) ||
    (isRewardsStep && currentStep === 4 && rewardsSubStep === 0) ||
    (isEligibilityStep && currentStep === 5 && eligibilitySubStep === 0) ||
    (isFeaturesStep && currentStep === 6 && featuresSubStep === 0);

  const isLast =
    (isBasicInfoStep && basicInfoSubStep === BASIC_INFO_TOTAL - 1 && currentStep === steps.length - 1) ||
    (isTimelineStep && timelineSubStep === TIMELINE_TOTAL - 1 && currentStep === steps.length - 1) ||
    (isDetailsStep && detailsSubStep === DETAILS_TOTAL - 1 && currentStep === steps.length - 1) ||
    (isObjectiveStep && objectiveSubStep === OBJECTIVE_TOTAL - 1 && currentStep === steps.length - 1) ||
    (isRewardsStep && rewardsSubStep === REWARDS_TOTAL_DYNAMIC - 1 && currentStep === steps.length - 1) ||
    (isEligibilityStep && eligibilitySubStep === ELIGIBILITY_TOTAL - 1 && currentStep === steps.length - 1) ||
    (isFeaturesStep && featuresSubStep === FEATURES_TOTAL - 1 && currentStep === steps.length - 1) ||
    (!isBasicInfoStep && !isTimelineStep && !isDetailsStep && !isObjectiveStep && !isRewardsStep && !isEligibilityStep && !isFeaturesStep && currentStep === steps.length - 1);

  // isValid logic
  let isValid = true;
  if (isBasicInfoStep) {
    const field = basicInfoQuestions[basicInfoSubStep];
    const fieldState = basicInfoForm.getFieldState(field);
    const fieldValue = basicInfoForm.watch(field);
    isValid = !!fieldValue && !fieldState.invalid;
  } else if (isTimelineStep) {
    const field = timelineQuestions[timelineSubStep];
    const fieldState = timelineForm.getFieldState(field);
    const fieldValue = timelineForm.watch(field);
    isValid = field === 'enrollmentEndDate' ? true : !!fieldValue && !fieldState.invalid;
  } else if (isDetailsStep) {
    const field = detailsQuestions[detailsSubStep];
    const fieldState = detailsForm.getFieldState(field);
    const fieldValue = detailsForm.watch(field);
    isValid = !!fieldValue && !fieldState.invalid;
  } else if (isObjectiveStep) {
    const field = objectiveQuestions[objectiveSubStep];
    const fieldState = objectiveForm.getFieldState(field);
    const fieldValue = objectiveForm.watch(field);
    isValid = !!fieldValue && !fieldState.invalid;
  } else if (isRewardsStep) {
    const currentQuestion = rewardsVisibleQuestions[rewardsSubStep];
    const field = currentQuestion?.name;
    const fieldState = rewardsForm.getFieldState(field as any);
    const fieldValue = rewardsForm.watch(field as any);
    isValid = !!fieldValue && !fieldState.invalid;
  } else if (isEligibilityStep) {
    const field = eligibilityQuestions[eligibilitySubStep];
    const fieldState = eligibilityForm.getFieldState(field);
    const fieldValue = eligibilityForm.watch(field);
    isValid = !!fieldValue && !fieldState.invalid;
  } else if (isFeaturesStep) {
    const field = featuresVisibleQuestions[featuresSubStep];
    const fieldState = featuresForm.getFieldState(field as any);
    const fieldValue = featuresForm.watch(field as any);
    isValid = !!fieldValue && !fieldState.invalid;
  }

  function handleNext() {
    if (isBasicInfoStep) {
      if (basicInfoSubStep < BASIC_INFO_TOTAL - 1) {
        setBasicInfoSubStep((s) => s + 1);
        return;
      }
    }
    if (isTimelineStep) {
      if (timelineSubStep < TIMELINE_TOTAL - 1) {
        setTimelineSubStep((s) => s + 1);
        return;
      }
    }
    if (isDetailsStep) {
      if (detailsSubStep < DETAILS_TOTAL - 1) {
        setDetailsSubStep((s) => s + 1);
        return;
      }
    }
    if (isObjectiveStep) {
      if (objectiveSubStep < OBJECTIVE_TOTAL - 1) {
        setObjectiveSubStep((s) => s + 1);
        return;
      }
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
      setCurrentStep((s) => s + 1);
      setBasicInfoSubStep(0);
      setTimelineSubStep(0);
      setDetailsSubStep(0);
      setObjectiveSubStep(0);
      setRewardsSubStep(0);
      setEligibilitySubStep(0);
      setFeaturesSubStep(0);
    }
  }

  function handleBack() {
    if (isBasicInfoStep && basicInfoSubStep > 0) {
      setBasicInfoSubStep((s) => s - 1);
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
      setCurrentStep((s) => s - 1);
      setBasicInfoSubStep(0);
      setTimelineSubStep(0);
      setDetailsSubStep(0);
      setObjectiveSubStep(0);
      setRewardsSubStep(0);
      setEligibilitySubStep(0);
      setFeaturesSubStep(0);
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
      <BasicInformationStep subStep={basicInfoSubStep} form={basicInfoForm} />
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
    stepContent = <div>Review & Publish Coming Soon</div>;
  }

  // Progress calculation (linear, counting all substeps)
  const totalSteps =
    steps.length + (BASIC_INFO_TOTAL - 1) + (TIMELINE_TOTAL - 1) + (DETAILS_TOTAL - 1) + (OBJECTIVE_TOTAL - 1) + (REWARDS_TOTAL_DYNAMIC - 1) + (ELIGIBILITY_TOTAL - 1) + (FEATURES_TOTAL - 1);
  const currentProgress = isBasicInfoStep
    ? currentStep + basicInfoSubStep
    : isTimelineStep
    ? currentStep + (BASIC_INFO_TOTAL - 1) + timelineSubStep
    : isDetailsStep
    ? currentStep + (BASIC_INFO_TOTAL - 1) + (TIMELINE_TOTAL - 1) + detailsSubStep
    : isObjectiveStep
    ? currentStep + (BASIC_INFO_TOTAL - 1) + (TIMELINE_TOTAL - 1) + (DETAILS_TOTAL - 1) + objectiveSubStep
    : isRewardsStep
    ? currentStep + (BASIC_INFO_TOTAL - 1) + (TIMELINE_TOTAL - 1) + (DETAILS_TOTAL - 1) + (OBJECTIVE_TOTAL - 1) + rewardsSubStep
    : isEligibilityStep
    ? currentStep + (BASIC_INFO_TOTAL - 1) + (TIMELINE_TOTAL - 1) + (DETAILS_TOTAL - 1) + (OBJECTIVE_TOTAL - 1) + (REWARDS_TOTAL_DYNAMIC - 1) + eligibilitySubStep
    : isFeaturesStep
    ? currentStep + (BASIC_INFO_TOTAL - 1) + (TIMELINE_TOTAL - 1) + (DETAILS_TOTAL - 1) + (OBJECTIVE_TOTAL - 1) + (REWARDS_TOTAL_DYNAMIC - 1) + (ELIGIBILITY_TOTAL - 1) + featuresSubStep
    : currentStep + (BASIC_INFO_TOTAL - 1) + (TIMELINE_TOTAL - 1) + (DETAILS_TOTAL - 1) + (OBJECTIVE_TOTAL - 1) + (REWARDS_TOTAL_DYNAMIC - 1) + (ELIGIBILITY_TOTAL - 1) + (FEATURES_TOTAL - 1);
  const progress = ((currentProgress + 1) / totalSteps) * 100;

  return (
    <div className="relative min-h-screen bg-background flex flex-col">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b flex justify-between items-center px-6 py-4 shadow-sm">
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
      <div className="sticky bottom-0 z-30 bg-white border-t flex flex-col items-center px-4 py-4">
        <Progress value={progress} className="w-full max-w-xl h-2 rounded-full mb-4" />
        <div className="flex w-full max-w-xl justify-between items-center">
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