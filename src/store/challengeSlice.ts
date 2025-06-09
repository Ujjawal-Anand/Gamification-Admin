import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as z from 'zod';
import { ChallengeFormData } from '@/types/challenge';

export interface Challenge {
  id: string;
  status: 'draft' | 'submitted' | 'listed';
  formData: Partial<ChallengeFormData>;
  createdAt: string;
  updatedAt: string;
}

interface ChallengeState {
  challenges: Challenge[];
  isSubmitting: boolean;
  error: string | null;
}

const initialState: ChallengeState = {
  challenges: [],
  isSubmitting: false,
  error: null,
};

const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    initChallenge: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const exists = state.challenges.some(c => c.id === id);
      if (!exists) {
        const newChallenge: Challenge = {
          id,
          status: 'draft',
          formData: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.challenges.push(newChallenge);
      }
    },
    addChallenge: (state, action: PayloadAction<Challenge>) => {
      state.challenges.push(action.payload);
    },
    updateChallenge: (state, action: PayloadAction<{ id: string; updates: Partial<Challenge> }>) => {
      const index = state.challenges.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.challenges[index] = {
          ...state.challenges[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    updateFormData: (state, action: PayloadAction<{ id: string; formData: Partial<ChallengeFormData> }>) => {
      console.log('Redux: Updating form data with:', action.payload);
      
      const index = state.challenges.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        // Update existing challenge
        state.challenges[index] = {
          ...state.challenges[index],
          formData: {
            ...state.challenges[index].formData,
            ...action.payload.formData,
          },
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Create new challenge
        const newChallenge: Challenge = {
          id: action.payload.id,
          status: 'draft',
          formData: action.payload.formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.challenges.push(newChallenge);
      }

      console.log('Redux: Updated challenges state:', state.challenges);
    },
    updateChallengeId: (state, action: PayloadAction<{ oldId: string; newId: string }>) => {
      const index = state.challenges.findIndex(c => c.id === action.payload.oldId);
      if (index !== -1) {
        state.challenges[index] = {
          ...state.challenges[index],
          id: action.payload.newId,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    updateChallengeStatus: (state, action: PayloadAction<{ id: string; status: Challenge['status'] }>) => {
      const index = state.challenges.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.challenges[index] = {
          ...state.challenges[index],
          status: action.payload.status,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteChallenge: (state, action: PayloadAction<string>) => {
      state.challenges = state.challenges.filter(c => c.id !== action.payload);
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  initChallenge,
  addChallenge,
  updateChallenge,
  updateFormData,
  updateChallengeId,
  updateChallengeStatus,
  deleteChallenge,
  setSubmitting,
  setError,
} = challengeSlice.actions;

export default challengeSlice.reducer; 