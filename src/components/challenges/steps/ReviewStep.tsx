import { useAppSelector } from '@/store/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface ObjectiveData {
  steps?: number;
  distance?: number;
  unit?: string;
  squaresRequired?: number;
  dailyChallenges?: number;
  questionsRequired?: number;
}

interface FormData {
  basicInformation?: {
    category?: string;
    theme?: string;
    importance?: string;
  };
  objective?: {
    objective?: ObjectiveData;
    measurement?: string;
    trackingPeriod?: string;
    squaresRequired?: number;
    dailyChallenges?: number;
    questionsRequired?: number;
  };
  details?: {
    name?: string;
    headline?: string;
    summary?: string;
    image?: string;
    heroImage?: string;
  };
  rewards?: {
    types?: string[];
    points?: number;
    badgeId?: string;
  };
  features?: {
    nextBestActions?: string[];
    nutritionWidget?: boolean;
    recipeDiet?: string[];
  };
}

interface FieldConfig {
  label: string;
  key: string;
  showIf?: (data: any) => boolean;
}

interface SectionConfig {
  title: string;
  data: any;
  fields: FieldConfig[];
}

export function ReviewStep() {
  const { formData } = useAppSelector((state) => state.challenge);

  const sections: SectionConfig[] = [
    {
      title: 'Basic Information',
      data: formData.basicInformation,
      fields: [
        { label: 'Category', key: 'category' },
        { label: 'Theme', key: 'theme' },
        { label: 'Importance', key: 'importance' },
      ],
    },
    {
      title: 'Objective',
      data: formData.objective,
      fields: [
        { label: 'Primary Goal', key: 'objective' },
        { label: 'Measurement', key: 'measurement' },
        { label: 'Tracking Period', key: 'trackingPeriod' },
        { label: 'Squares Required', key: 'squaresRequired', showIf: (data: any) => data?.theme === 'Bingo' },
        { label: 'Daily Challenges', key: 'dailyChallenges' },
        { label: 'Questions Required', key: 'questionsRequired' },
      ],
    },
    {
      title: 'Details',
      data: formData.details,
      fields: [
        { label: 'Name', key: 'name' },
        { label: 'Headline', key: 'headline' },
        { label: 'Summary', key: 'summary' },
        { label: 'Image', key: 'image' },
        { label: 'Hero Image', key: 'heroImage' },
      ],
    },
    {
      title: 'Rewards',
      data: formData.rewards,
      fields: [
        { label: 'Reward Types', key: 'types' },
        { label: 'Points', key: 'points' },
        { label: 'Badge', key: 'badgeId' },
      ],
    },
    {
      title: 'Features',
      data: formData.features,
      fields: [
        { label: 'Next Best Actions', key: 'nextBestActions' },
        { label: 'Nutrition Widget', key: 'nutritionWidget' },
        { label: 'Recipe Diet', key: 'recipeDiet' },
      ],
    },
  ];

  const getValue = (data: any, key: string) => {
    if (!data) return null;
    const value = data[key as keyof typeof data];
    if (value === undefined || value === null || value === '') return null;
    
    // Special handling for objective field
    if (key === 'objective') {
      if (typeof value === 'object') {
        // Check if we have rawData with objectiveData
        if (value.rawData?.objectiveData) {
          return value.rawData.objectiveData;
        }
        
        // Fallback to checking specific fields
        if ('squaresRequired' in value) {
          return { squaresRequired: value.squaresRequired };
        }
        if ('steps' in value) {
          return { steps: value.steps, trackingPeriod: value.trackingPeriod };
        }
        if ('value' in value && 'unit' in value) {
          return { value: value.value, unit: value.unit };
        }
        if ('dailyChallenges' in value) {
          return { dailyChallenges: value.dailyChallenges };
        }
        if ('questionsRequired' in value) {
          return { questionsRequired: value.questionsRequired };
        }
      }
      return value;
    }

    // Special handling for squaresRequired field
    if (key === 'squaresRequired') {
      return { squaresRequired: value };
    }
    
    return value;
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') {
      if ('min' in value && 'max' in value) {
        return `${value.min} - ${value.max}`;
      }
      if ('steps' in value) {
        return `${value.steps} steps${value.trackingPeriod ? ` (${value.trackingPeriod})` : ''}`;
      }
      if ('value' in value && 'unit' in value) {
        return `${value.value} ${value.unit}`;
      }
      if ('squaresRequired' in value) {
        return `${value.squaresRequired} squares`;
      }
      if ('dailyChallenges' in value) {
        return `${value.dailyChallenges} challenges`;
      }
      if ('questionsRequired' in value) {
        return `${value.questionsRequired} questions`;
      }
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    }
    return String(value);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Review Your Challenge</h2>
        <p className="text-muted-foreground">Please review all the information before publishing your challenge</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.title} className="p-6">
            <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
            <div className="space-y-4">
              {section.fields.map((field) => {
                // Skip field if it has a showIf condition that evaluates to false
                if (field.showIf && !field.showIf(section.data)) return null;
                
                const value = getValue(section.data, field.key);
                if (!value) return null;

                return (
                  <div key={field.key} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{field.label}</p>
                      <p className="text-muted-foreground">
                        {formatValue(value)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

     

      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline">Save as Draft</Button>
        <Button>Publish Challenge</Button>
      </div>
    </div>
  );
} 