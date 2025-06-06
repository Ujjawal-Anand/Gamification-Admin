import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as z from 'zod';

// Define the type for our form data
export interface ChallengeFormData {
  basicInformation: {
    category: 'Nutrition' | 'Mindfulness' | 'Sleep' | 'Activity';
    theme: string;
    importance: string;
  };
  details: {
    name: string;
    headline: string;
    summary: string;
    image: string;
    heroImage: string;
    enrollmentStartDate: string;
    enrollmentEndDate: string;
    challengeStartDate: string;
    challengeEndDate: string;
  };
  eligibility: {
    ageRange: {
      min: number;
      max: number;
    };
    gender: string;
    location: string;
    healthConditions: string[];
    otherRequirements: string;
  };
  features: {
    nextBestActions: string[];
    nutritionWidget?: string;
    recipeDiet?: string;
  };
  objective: {
    objective: string;
    successCriteria: string;
    primaryGoal: string;
    measurement: string;
    trackingPeriod: string;
    squaresRequired: string;
    dailyChallenges: string;
    questionsRequired: string;
  };
  rewards: {
    types: string[];
    points?: number;
    badgeId?: string;
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