import { configureStore } from '@reduxjs/toolkit';
import challengeReducer, { ChallengeFormData } from './challengeSlice';

export interface RootState {
  challenge: {
    formData: Partial<ChallengeFormData>;
    currentStep: number;
    currentSubStep: number;
    isSubmitting: boolean;
    error: string | null;
    id: string | undefined;
  };
}

export const store = configureStore({
  reducer: {
    challenge: challengeReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 