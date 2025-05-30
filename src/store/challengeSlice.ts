import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as z from 'zod';

// Define the type for our form data
export interface ChallengeFormData {
  basicInformation?: {
    name: string;
    description: string;
    category?: 'Activity' | 'Nutrition' | 'Mindfulness' | 'Sleep';
    theme: string;
    importance: string;
    type: string;
  };
  timeline?: {
    enrollmentStartDate: string;
    enrollmentEndDate?: string;
    activeStartDate: string;
    activeEndDate: string;
  };
  details: {
    description: string;
    image: string;
    video: string;
    website: string;
  };
  eligibility: {
    ageRange: {
      min: number;
      max: number;
    };
    gender: string[];
    location: string[];
    healthConditions: string[];
    otherRequirements: string;
  };
  objective: {
    primaryGoal: string;
    measurement?: string;
    trackingPeriod?: string;
    squaresRequired?: string;
    dailyChallenges?: string;
    questionsRequired?: string;
  };
  rewards: {
    type: string;
    description: string;
    value: string;
    eligibility: string;
  };
  features: {
    tracking: string[];
    social: string[];
    gamification: string[];
    support: string[];
  };
}

const initialState = {
  formData: {} as Partial<ChallengeFormData>,
  currentStep: 0,
  currentSubStep: 0,
  isSubmitting: false,
  error: null as string | null,
};

const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<Partial<ChallengeFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      state.currentSubStep = 0; // Reset subStep when changing main step
    },
    setCurrentSubStep: (state, action: PayloadAction<number>) => {
      state.currentSubStep = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetForm: (state) => {
      state.formData = {} as Partial<ChallengeFormData>;
      state.currentStep = 0;
      state.currentSubStep = 0;
      state.isSubmitting = false;
      state.error = null;
    },
  },
});

export const {
  updateFormData,
  setCurrentStep,
  setCurrentSubStep,
  setSubmitting,
  setError,
  resetForm,
} = challengeSlice.actions;

export default challengeSlice.reducer; 