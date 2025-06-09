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