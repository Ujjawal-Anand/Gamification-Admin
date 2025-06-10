'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Award, Trophy, Medal, Star, Crown, Target } from 'lucide-react';

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

export default function ChallengePreviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const challengeId = searchParams.get('id');
  const challenge = useAppSelector(state =>
    state.challenge.challenges.find(c => c.id === challengeId)
  );

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Challenge Not Found</h1>
          <p className="text-gray-600 mb-8">The challenge you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const { details, rewards, basicInformation } = challenge.formData;
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="bg-orange-50 p-6 rounded-b-3xl relative">
          <Button
            variant="outline"
            className="absolute left-4 top-4"
            onClick={() => router.push('/')}
          >
            Back to Dashboard
          </Button>
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
  );
} 