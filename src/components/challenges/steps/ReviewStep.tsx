import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Award, Trophy, Medal, Star, Crown, Target } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { updateChallengeStatus } from '@/store/challengeSlice';

const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

// Badge definitions (should match RewardsStep.tsx)
const challengeBadges = [
  { value: 'badge1', label: 'Challenge Master', icon: Trophy },
  { value: 'badge2', label: 'Health Champion', icon: Medal },
  { value: 'badge3', label: 'Wellness Warrior', icon: Star },
  { value: 'badge4', label: 'Fitness Pro', icon: Award },
  { value: 'badge5', label: 'Wellness Leader', icon: Crown },
  { value: 'badge6', label: 'Goal Achiever', icon: Target },
];

const defaultBadge = <Award className="w-20 h-20 text-orange-500 mx-auto" />;
const defaultChallengeImg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&q=80';
const defaultRewardImg = 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=256&q=80';
const defaultBenefitsImg = 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=256&q=80';

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
    challengeStartDate?: string;
    challengeEndDate?: string;
    benefits?: string[];
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const challengeId = searchParams.get('id') || 'new';
  const challenges = useAppSelector((state) => state.challenge.challenges);
  const currentChallenge = challenges.find(c => c.id === challengeId);
  const formData = currentChallenge?.formData || {};
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'submit' | 'draft'>('submit');
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = (type: 'submit' | 'draft') => {
    setModalType(type);
    setShowModal(true);
    
    // Update challenge status in Redux store
    if (type === 'submit') {
      dispatch(updateChallengeStatus({ id: challengeId, status: 'submitted' }));
    } else {
      dispatch(updateChallengeStatus({ id: challengeId, status: 'draft' }));
    }
  };

  const handleGoToDashboard = () => {
    router.push('/');
  };

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

  const { details, rewards, basicInformation } = formData;
  // Badge: use badgeId to find icon from challengeBadges
  const badgeObj = challengeBadges.find(b => b.value === rewards?.badgeId);
  const badgeIcon = badgeObj
    ? <badgeObj.icon className="w-20 h-20 text-orange-500 mx-auto" />
    : defaultBadge;
  // Challenge image
  const challengeImg = details?.image || defaultChallengeImg;
  // Reward image (could be same as challenge image or a different field)
  const rewardImg = details?.heroImage || defaultRewardImg;
  // Benefits (array or fallback)
  const benefits = Array.isArray((details as any)?.benefits) && (details as any).benefits.length > 0
    ? (details as any).benefits
    : [
      'You may lower your overall blood pressure.',
      'You can make improvements to your cardio health and daily mood.'
    ];
  // Dates
  const dateRange = details?.challengeStartDate && details?.challengeEndDate
    ? `${details.challengeStartDate} - ${details.challengeEndDate}`
    : '';

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Review Your Challenge</h2>
        <p className="text-muted-foreground">Please review all the information before publishing your challenge</p>
      </div>

      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>
      </div>

      {showPreview ? (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="bg-orange-50 p-6 rounded-b-3xl relative">
              {/* Badge icon */}
              <div className="flex justify-center mb-4">{badgeIcon}</div>
              <h1 className="text-3xl font-bold text-center">{details?.name || 'Untitled Challenge'}</h1>
              <div className="text-center text-lg mt-2">{details?.headline}</div>
              <div className="text-center text-gray-500 mt-1">{dateRange}</div>
            </div>

            {/* The Challenge Section: image left, text right */}
            <div className="bg-white rounded-xl shadow p-6 mt-6 mx-2 flex flex-row items-center gap-6 max-w-2xl mx-auto">
              <img src={challengeImg} alt="Challenge" className="w-28 h-28 object-cover rounded-full border-4 border-orange-200 mr-6" />
              <div className="flex-1">
                <div className="font-bold text-xl mb-2">The challenge</div>
                <div className="text-gray-700">{details?.summary || 'No summary provided.'}</div>
              </div>
            </div>

            {/* The Reward Section: text left, image right */}
            <div className="bg-white rounded-xl shadow p-6 mt-6 mx-2 flex flex-row-reverse items-center gap-6 max-w-2xl mx-auto">
              <img src={rewardImg} alt="Reward" className="w-28 h-28 object-cover rounded-full border-4 border-orange-200 ml-6" />
              <div className="flex-1">
                <div className="font-bold text-xl mb-2">The reward</div>
                <ul className="list-disc ml-5 text-gray-700">
                  {rewards?.points && <li>Points: {rewards.points}</li>}
                  {rewards?.badgeId && <li>Badge: <span className="underline">{badgeObj?.label || rewards.badgeId}</span></li>}
                  {rewards?.types && rewards.types.length > 0 && <li>Types: {rewards.types.join(', ')}</li>}
                </ul>
              </div>
            </div>

            {/* Challenge Benefits Section: image left, text right */}
            <div className="bg-orange-50 rounded-xl shadow p-6 mt-6 mx-2 flex flex-row items-center gap-6 max-w-2xl mx-auto">
              <img src={defaultBenefitsImg} alt="Benefits" className="w-28 h-28 object-cover rounded-full border-4 border-orange-200 mr-6" />
              <div className="flex-1">
                <div className="font-bold text-xl mb-2">Challenge benefits</div>
                <ul className="list-disc ml-5 text-gray-700">
                  {benefits.map((b: string, i: number) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Sticky Join Button at Bottom */}
          <div className="sticky bottom-0 left-0 w-full bg-white border-t z-50 flex justify-center py-6">
            <Button size="lg" className="px-10 py-4 text-lg rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg">
              Join Challenge
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.title} className="p-6">
              <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
              <div className="space-y-4">
                {section.fields.map((field) => {
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
      )}

      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline" onClick={() => handleSubmit('draft')}>Save as Draft</Button>
        <Button onClick={() => handleSubmit('submit')}>Submit for Review</Button>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          {showModal && (
            <ReactConfetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={200}
              gravity={0.2}
            />
          )}
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              {modalType === 'submit' ? 'Challenge Submitted!' : 'Draft Saved!'}
            </DialogTitle>
            <DialogDescription className="text-center text-lg mt-4">
              {modalType === 'submit' 
                ? 'Your challenge has been submitted for review.'
                : 'Your challenge has been saved as a draft.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button 
                  size="lg" 
                  onClick={handleGoToDashboard}
                  className="px-8"
                >
                  Go to Dashboard
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 