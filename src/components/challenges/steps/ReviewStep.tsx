import { useAppSelector } from '@/store/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { ChallengeFormData } from '@/store/challengeSlice';

export function ReviewStep() {
  const { formData } = useAppSelector((state) => state.challenge);
  const { basicInformation, objective, timeline, details, rewards, eligibility, features } = formData;

  const sections = [
    {
      title: 'Basic Information',
      data: basicInformation,
      fields: [
        { label: 'Name', key: 'name' },
        { label: 'Category', key: 'category' },
        { label: 'Theme', key: 'theme' },
        { label: 'Importance', key: 'importance' },
      ],
    },
    {
      title: 'Objective',
      data: objective,
      fields: [
        { label: 'Primary Goal', key: 'primaryGoal' },
        { label: 'Measurement', key: 'measurement' },
        { label: 'Tracking Period', key: 'trackingPeriod' },
        { label: 'Squares Required', key: 'squaresRequired' },
        { label: 'Daily Challenges', key: 'dailyChallenges' },
        { label: 'Questions Required', key: 'questionsRequired' },
      ],
    },
    {
      title: 'Timeline',
      data: timeline,
      fields: [
        { label: 'Enrollment Start', key: 'enrollmentStartDate' },
        { label: 'Enrollment End', key: 'enrollmentEndDate' },
        { label: 'Active Start', key: 'activeStartDate' },
        { label: 'Active End', key: 'activeEndDate' },
      ],
    },
    {
      title: 'Details',
      data: details,
      fields: [
        { label: 'Description', key: 'description' },
        { label: 'Image', key: 'image' },
        { label: 'Video', key: 'video' },
        { label: 'Website', key: 'website' },
      ],
    },
    {
      title: 'Rewards',
      data: rewards,
      fields: [
        { label: 'Type', key: 'type' },
        { label: 'Description', key: 'description' },
        { label: 'Value', key: 'value' },
        { label: 'Eligibility', key: 'eligibility' },
      ],
    },
    {
      title: 'Eligibility',
      data: eligibility,
      fields: [
        { label: 'Age Range', key: 'ageRange' },
        { label: 'Gender', key: 'gender' },
        { label: 'Location', key: 'location' },
        { label: 'Health Conditions', key: 'healthConditions' },
        { label: 'Other Requirements', key: 'otherRequirements' },
      ],
    },
    {
      title: 'Features',
      data: features,
      fields: [
        { label: 'Tracking', key: 'tracking' },
        { label: 'Social', key: 'social' },
        { label: 'Gamification', key: 'gamification' },
        { label: 'Support', key: 'support' },
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
    <div className="space-y-6">
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

      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline">Save as Draft</Button>
        <Button>Publish Challenge</Button>
      </div>
    </div>
  );
} 