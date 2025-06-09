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

interface ChallengeState {
  id: string;
  currentStep: number;
  currentSubStep: number;
  formData: {
    basicInformation?: {
      category?: string;
      theme?: string;
      importance?: string;
    };
    objective?: {
      objective?: string;
      measurement?: string;
      trackingPeriod?: string;
      squaresRequired?: string;
      dailyChallenges?: string;
      questionsRequired?: string;
      rawData?: any;
    };
    details?: any;
    rewards?: any;
    features?: any;
  };
}

const initialState: ChallengeState = {
  id: '',
  currentStep: 0,
  currentSubStep: 0,
  formData: {
    basicInformation: {},
    objective: {},
    details: {},
    rewards: {},
    features: {},
  },
};

const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    setChallengeId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setCurrentSubStep: (state, action: PayloadAction<number>) => {
      state.currentSubStep = action.payload;
    },
    updateFormData: (state, action: PayloadAction<any>) => {
      console.log('Redux: Updating form data with:', action.payload);
      
      // Handle objective data specifically
      if (action.payload.objective) {
        console.log('Redux: Processing objective data:', action.payload.objective);
        state.formData.objective = {
          ...state.formData.objective,
          ...action.payload.objective,
          // Ensure all fields are strings
          objective: String(action.payload.objective.objective || ''),
          measurement: String(action.payload.objective.measurement || ''),
          trackingPeriod: String(action.payload.objective.trackingPeriod || ''),
          squaresRequired: String(action.payload.objective.squaresRequired || ''),
          dailyChallenges: String(action.payload.objective.dailyChallenges || ''),
          questionsRequired: String(action.payload.objective.questionsRequired || ''),
          rawData: action.payload.objective.rawData || {}
        };
        console.log('Redux: Updated objective state:', state.formData.objective);
      }

      // Update other form data
      Object.keys(action.payload).forEach(key => {
        if (key !== 'objective') {
          state.formData[key as keyof typeof state.formData] = {
            ...state.formData[key as keyof typeof state.formData],
            ...action.payload[key]
          };
        }
      });

      console.log('Redux: Final form data state:', state.formData);
    },
    resetChallenge: (state) => {
      state.id = '';
      state.currentStep = 0;
      state.currentSubStep = 0;
      state.formData = {
        basicInformation: {},
        objective: {},
        details: {},
        rewards: {},
        features: {},
      };
    },
  },
});

export const { 
  setChallengeId,
  setCurrentStep, 
  setCurrentSubStep, 
  updateFormData, 
  resetChallenge 
} = challengeSlice.actions;

export default challengeSlice.reducer; 