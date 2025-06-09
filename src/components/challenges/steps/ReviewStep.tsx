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

export function ReviewStep() {
  const { formData } = useAppSelector((state) => state.challenge);

  const sections = [
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
        { label: 'Squares Required', key: 'squaresRequired' },
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

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') {
      if ('min' in value && 'max' in value) {
        return `${value.min} - ${value.max}`;
      }
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    }
    return String(value);
  };

  const getValue = (data: any, key: string) => {
    if (!data) return null;
    const value = data[key as keyof typeof data];
    if (value === undefined || value === null || value === '') return null;
    return value;
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

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Objective</h3>
        <div className="space-y-2">
          {formData.objective?.objective && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Goal</span>
              <span className="font-medium">
                {(() => {
                  const obj = formData.objective?.objective as any;
                  if (obj.steps) return `${obj.steps} Steps`;
                  if (obj.distance) return `${obj.distance} ${obj.unit}`;
                  if (obj.squaresRequired) return `${obj.squaresRequired} Squares`;
                  if (obj.dailyChallenges) return `${obj.dailyChallenges} Challenges`;
                  if (obj.questionsRequired) return `${obj.questionsRequired} Questions`;
                  return '';
                })()}
              </span>
            </div>
          )}
          {formData.objective?.measurement && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Measurement</span>
              <span className="font-medium">{formData.objective.measurement}</span>
            </div>
          )}
          {formData.objective?.trackingPeriod && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tracking Period</span>
              <span className="font-medium">{formData.objective.trackingPeriod}</span>
            </div>
          )}
          {/* Only show Bingo-specific fields if theme is Bingo */}
          {formData.basicInformation?.theme === 'Bingo' && formData.objective?.squaresRequired && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Squares Required</span>
              <span className="font-medium">{formData.objective.squaresRequired}</span>
            </div>
          )}
          {/* Only show Daily Challenge-specific fields if theme is Daily Challenge */}
          {formData.basicInformation?.theme === 'Daily Challenge' && formData.objective?.dailyChallenges && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily Challenges</span>
              <span className="font-medium">{formData.objective.dailyChallenges}</span>
            </div>
          )}
          {/* Only show Quiz-specific fields if theme is Quiz */}
          {formData.basicInformation?.theme === 'Quiz' && formData.objective?.questionsRequired && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Questions Required</span>
              <span className="font-medium">{formData.objective.questionsRequired}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline">Save as Draft</Button>
        <Button>Publish Challenge</Button>
      </div>
    </div>
  );
} 