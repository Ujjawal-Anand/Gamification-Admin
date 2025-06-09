import { configureStore } from '@reduxjs/toolkit';
import challengeReducer, { Challenge } from './challengeSlice';

export interface RootState {
  challenge: {
    challenges: Challenge[];
    isSubmitting: boolean;
    error: string | null;
  };
}

export const store = configureStore({
  reducer: {
    challenge: challengeReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 