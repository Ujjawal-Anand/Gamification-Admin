'use client';

import { ChallengeCreationWizard } from '@/components/challenges/ChallengeCreationWizard';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { initChallenge } from '@/store/challengeSlice';

export default function NewChallengePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const challenges = useAppSelector((state) => state.challenge.challenges);
  const initialized = useRef(false);

  // Generate and set challenge ID if not present
  useEffect(() => {
    if (initialized.current) return;
    
    const challengeId = searchParams.get('id');
    if (!challengeId) {
      const newId = crypto.randomUUID();
      
      // Update URL using history API
      const newUrl = `?id=${newId}`;
      window.history.replaceState({}, '', newUrl);
      
      // Initialize new challenge with ID
      dispatch(initChallenge(newId));
    } else {
      // Initialize challenge if it doesn't exist
      const existingChallenge = challenges.find(c => c.id === challengeId);
      if (!existingChallenge) {
        dispatch(initChallenge(challengeId));
      }
    }
    
    initialized.current = true;
  }, [searchParams, router, dispatch]);

  return <ChallengeCreationWizard />;
} 