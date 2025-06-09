'use client';

import { ChallengeCreationWizard } from '@/components/challenges/ChallengeCreationWizard';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setCurrentStep, setCurrentSubStep } from '@/store/challengeSlice';

export default function NewChallengePage() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // Set initial step and substep from URL
  useEffect(() => {
    const step = searchParams.get('step');
    const substep = searchParams.get('substep');
    
    if (step && !isNaN(Number(step))) {
      dispatch(setCurrentStep(Number(step)));
    }
    
    if (substep && !isNaN(Number(substep))) {
      dispatch(setCurrentSubStep(Number(substep)));
    }
  }, [searchParams, dispatch]);

  return <ChallengeCreationWizard />;
} 